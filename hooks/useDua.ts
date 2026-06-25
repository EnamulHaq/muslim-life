import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DuaChapter,
  DuaItem,
  fetchAllDuas,
  fetchDuaChapters,
  searchDuas,
} from '@/services/duaClient';

export function useDuas() {
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [chapters, setChapters] = useState<DuaChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [duaData, chapterData] = await Promise.all([fetchAllDuas(), fetchDuaChapters()]);
      setDuas(duaData);
      setChapters(chapterData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load duas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const chaptersWithCount = useMemo(() => {
    const counts = new Map<string, number>();
    duas.forEach((dua) => {
      counts.set(dua.chapterId, (counts.get(dua.chapterId) ?? 0) + 1);
    });

    return [...chapters]
      .sort((a, b) => Number(a.number) - Number(b.number))
      .map((chapter) => ({
        ...chapter,
        duaCount: counts.get(chapter.id) ?? 0,
      }));
  }, [chapters, duas]);

  return { duas, chapters, chaptersWithCount, loading, error, reload: load };
}

export function useDuaSearch(query: string) {
  const [results, setResults] = useState<DuaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchDuas(query);
        if (active) setResults(data);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}
