import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isStorageAvailable } from '@/utils/storage';

type DailyFitness = {
  date: string;
  steps: number;
  distanceKm: number;
  runDistanceKm: number;
};

type FitnessState = {
  steps: number;
  distanceKm: number;
  runDistanceKm: number;
  isTrackingRun: boolean;
  pedometerAvailable: boolean;
};

const STORAGE_KEY = '@muslim-life/fitness';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useFitness() {
  const [state, setState] = useState<FitnessState>({
    steps: 0,
    distanceKm: 0,
    runDistanceKm: 0,
    isTrackingRun: false,
    pedometerAvailable: false,
  });
  const lastPositionRef = useRef<Location.LocationObject | null>(null);
  const persist = useCallback(async (patch: Partial<DailyFitness>) => {
    if (!isStorageAvailable()) return;

    const date = todayKey();
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const store = raw ? (JSON.parse(raw) as Record<string, DailyFitness>) : {};
    const current = store[date] ?? { date, steps: 0, distanceKm: 0, runDistanceKm: 0 };
    store[date] = { ...current, ...patch, date };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, []);

  const loadToday = useCallback(async () => {
    if (!isStorageAvailable()) return;

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const store = JSON.parse(raw) as Record<string, DailyFitness>;
    const today = store[todayKey()];
    if (!today) return;

    setState((prev) => ({
      ...prev,
      steps: today.steps,
      distanceKm: today.distanceKm,
      runDistanceKm: today.runDistanceKm,
    }));
  }, []);

  useEffect(() => {
    let stepSub: { remove: () => void } | null = null;
    let mounted = true;

    const init = async () => {
      await loadToday();

      if (Platform.OS === 'web') {
        setState((prev) => ({ ...prev, pedometerAvailable: false }));
        return;
      }

      const available = await Pedometer.isAvailableAsync();
      if (!mounted) return;
      setState((prev) => ({ ...prev, pedometerAvailable: available }));

      if (available) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        try {
          const past = await Pedometer.getStepCountAsync(start, end);
          if (mounted) {
            const distanceKm = Number((past.steps * 0.000762).toFixed(2));
            setState((prev) => ({ ...prev, steps: past.steps, distanceKm }));
            await persist({ steps: past.steps, distanceKm });
          }
        } catch {
          // device may not support historical step count
        }

        let watchSteps = 0;
        stepSub = Pedometer.watchStepCount((result) => {
          const delta = result.steps - watchSteps;
          watchSteps = result.steps;
          if (delta <= 0) return;

          setState((prev) => {
            const steps = prev.steps + delta;
            const distanceKm = Number((steps * 0.000762).toFixed(2));
            persist({ steps, distanceKm });
            return { ...prev, steps, distanceKm };
          });
        });
      }
    };

    init();

    return () => {
      mounted = false;
      stepSub?.remove();
    };
  }, [loadToday, persist]);

  const startRun = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return false;

    setState((prev) => ({ ...prev, isTrackingRun: true, runDistanceKm: 0 }));
    lastPositionRef.current = null;
    return true;
  }, []);

  const stopRun = useCallback(async () => {
    setState((prev) => {
      persist({ runDistanceKm: prev.runDistanceKm });
      return { ...prev, isTrackingRun: false };
    });
    lastPositionRef.current = null;
  }, [persist]);

  useEffect(() => {
    if (!state.isTrackingRun) return;

    let subscription: Location.LocationSubscription | null = null;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 3000,
      },
      (position) => {
        const prev = lastPositionRef.current;
        if (prev) {
          const delta = haversineKm(
            prev.coords.latitude,
            prev.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          );

          if (delta > 0.001) {
            setState((current) => {
              const runDistanceKm = Number((current.runDistanceKm + delta).toFixed(2));
              persist({ runDistanceKm });
              return { ...current, runDistanceKm };
            });
          }
        }
        lastPositionRef.current = position;
      }
    ).then((sub) => {
      subscription = sub;
    });

    return () => {
      subscription?.remove();
    };
  }, [state.isTrackingRun, persist]);

  return {
    ...state,
    startRun,
    stopRun,
  };
}
