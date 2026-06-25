import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { isStorageAvailable } from '@/utils/storage';

export type SurahHifzProgress = {
  memorizedVerses: number[];
  lastPracticed?: string;
};

export type HifzStore = Record<number, SurahHifzProgress>;

const STORAGE_KEY = '@muslim-life/hifz';

let cached: HifzStore = {};
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

async function persist(store: HifzStore) {
  cached = store;
  notify();
  if (isStorageAvailable()) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export function useHifz() {
  const [progress, setProgress] = useState<HifzStore>(cached);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setProgress({ ...cached });
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
          cached = JSON.parse(raw) as HifzStore;
          setProgress(cached);
        }
      })
      .finally(() => setLoaded(true));

    return () => {
      listeners.delete(sync);
    };
  }, []);

  const getSurahProgress = useCallback(
    (surahId: number, totalVerses: number) => {
      const data = progress[surahId];
      const memorized = data?.memorizedVerses.length ?? 0;
      return {
        memorized,
        total: totalVerses,
        percent: totalVerses ? Math.round((memorized / totalVerses) * 100) : 0,
        verses: data?.memorizedVerses ?? [],
      };
    },
    [progress]
  );

  const toggleVerseMemorized = useCallback(async (surahId: number, verseNumber: number) => {
    const current = cached[surahId] ?? { memorizedVerses: [] };
    const exists = current.memorizedVerses.includes(verseNumber);
    const memorizedVerses = exists
      ? current.memorizedVerses.filter((v) => v !== verseNumber)
      : [...current.memorizedVerses, verseNumber].sort((a, b) => a - b);

    const next = {
      ...cached,
      [surahId]: {
        memorizedVerses,
        lastPracticed: new Date().toISOString(),
      },
    };
    setProgress(next);
    await persist(next);
  }, []);

  const getTotalMemorized = useCallback(() => {
    return Object.values(progress).reduce((sum, item) => sum + item.memorizedVerses.length, 0);
  }, [progress]);

  return {
    progress,
    loaded,
    getSurahProgress,
    toggleVerseMemorized,
    getTotalMemorized,
  };
}
