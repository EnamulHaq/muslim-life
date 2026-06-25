import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { NURANI_LESSONS } from '@/data/nuraniQaida';
import { isStorageAvailable } from '@/utils/storage';

const STORAGE_KEY = '@muslim-life/nurani-progress';

type NuraniStore = {
  completedLessons: number[];
  lastLessonId?: number;
};

let cached: NuraniStore = { completedLessons: [] };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function persist(store: NuraniStore) {
  cached = store;
  notify();
  if (isStorageAvailable()) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export function useNuraniProgress() {
  const [store, setStore] = useState<NuraniStore>(cached);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setStore({ ...cached });
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
          cached = { completedLessons: [], ...JSON.parse(raw) };
          setStore(cached);
        }
      })
      .finally(() => setLoaded(true));

    return () => {
      listeners.delete(sync);
    };
  }, []);

  const markLessonComplete = useCallback(async (lessonId: number) => {
    const completed = new Set(cached.completedLessons);
    completed.add(lessonId);
    await persist({
      completedLessons: Array.from(completed).sort((a, b) => a - b),
      lastLessonId: lessonId,
    });
  }, []);

  const setLastLesson = useCallback(async (lessonId: number) => {
    await persist({ ...cached, lastLessonId: lessonId });
  }, []);

  const isLessonComplete = useCallback(
    (lessonId: number) => cached.completedLessons.includes(lessonId),
    [store]
  );

  const progressPercent = Math.round(
    (cached.completedLessons.length / NURANI_LESSONS.length) * 100
  );

  return {
    loaded,
    completedLessons: store.completedLessons,
    lastLessonId: store.lastLessonId,
    progressPercent,
    markLessonComplete,
    setLastLesson,
    isLessonComplete,
    totalLessons: NURANI_LESSONS.length,
  };
}
