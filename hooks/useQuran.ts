import { useCallback, useEffect, useState } from 'react';
import {
  ChapterWithBn,
  fetchChapterVerses,
  fetchChapters,
  QuranVerseView,
} from '@/services/quranClient';

export function useQuranChapters() {
  const [chapters, setChapters] = useState<ChapterWithBn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchChapters();
      setChapters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Quran');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { chapters, loading, error, reload: load };
}

export function useQuranChapter(chapterId: number) {
  const [verses, setVerses] = useState<QuranVerseView[]>([]);
  const [chapter, setChapter] = useState<ChapterWithBn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchChapterVerses(chapterId);
      setVerses(data.verses);
      setChapter(data.chapter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load surah');
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    load();
  }, [load]);

  return { verses, chapter, loading, error, reload: load };
}
