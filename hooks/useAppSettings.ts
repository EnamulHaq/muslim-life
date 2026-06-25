import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { isStorageAvailable } from '@/utils/storage';

export type AppLanguage = 'bn' | 'en';
export type CalculationMethodKey =
  | 'MuslimWorldLeague'
  | 'Karachi'
  | 'Egyptian'
  | 'UmmAlQura'
  | 'NorthAmerica';
export type AsrMethodKey = 'Hanafi' | 'Shafi';

export type AppSettings = {
  language: AppLanguage;
  calculationMethod: CalculationMethodKey;
  asrMethod: AsrMethodKey;
  prayerNotifications: boolean;
  adhanSound: boolean;
  darkMode: boolean;
};

const STORAGE_KEY = '@muslim-life/settings';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'bn',
  calculationMethod: 'MuslimWorldLeague',
  asrMethod: 'Hanafi',
  prayerNotifications: true,
  adhanSound: true,
  darkMode: false,
};

export const CALCULATION_METHODS: Record<CalculationMethodKey, string> = {
  MuslimWorldLeague: 'Muslim World League',
  Karachi: 'University of Islamic Sciences, Karachi',
  Egyptian: 'Egyptian General Authority',
  UmmAlQura: 'Umm Al-Qura, Makkah',
  NorthAmerica: 'ISNA (North America)',
};

export const ASR_METHODS: Record<AsrMethodKey, string> = {
  Hanafi: 'Hanafi',
  Shafi: "Shafi'i / Standard",
};

export const LANGUAGES: Record<AppLanguage, string> = {
  bn: 'বাংলা',
  en: 'English',
};

let cachedSettings = DEFAULT_SETTINGS;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(cachedSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setSettings({ ...cachedSettings });
    listeners.add(sync);

    if (!isStorageAvailable()) {
      setLoaded(true);
      return () => {
        listeners.delete(sync);
      };
    }

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          cachedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
          setSettings(cachedSettings);
        }
      })
      .finally(() => setLoaded(true));

    return () => {
      listeners.delete(sync);
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    cachedSettings = { ...cachedSettings, ...patch };
    setSettings(cachedSettings);
    notifyListeners();
    if (isStorageAvailable()) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cachedSettings));
    }
  }, []);

  return { settings, loaded, updateSettings };
}
