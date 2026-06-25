import { useCallback, useEffect, useState } from 'react';
import {
  AyahTafsir,
  fetchChapterTafsir,
  fetchTafsirList,
  TafsirResource,
} from '@/services/tafsirClient';

export function useTafsirList() {
  const [tafsirs, setTafsirs] = useState<TafsirResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTafsirList()
      .then(setTafsirs)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load tafsirs'))
      .finally(() => setLoading(false));
  }, []);

  return { tafsirs, loading, error };
}

export function useChapterTafsir(chapterId: number, verseCount: number, tafsirId: number | null) {
  const [entries, setEntries] = useState<AyahTafsir[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tafsirId || verseCount === 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchChapterTafsir(tafsirId, chapterId, verseCount);
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tafsir');
    } finally {
      setLoading(false);
    }
  }, [tafsirId, chapterId, verseCount]);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, loading, error, reload: load };
}
