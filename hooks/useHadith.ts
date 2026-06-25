import { useCallback, useEffect, useState } from 'react';
import { enrichHadithItemsWithBangla } from '@/services/banglaHadithClient';
import {
  fetchHadithBooks,
  fetchHadithCollections,
  fetchHadiths,
  HadithBook,
  HadithCollection,
  HadithItem,
  searchHadiths,
} from '@/services/hadithClient';

export function useHadithCollections() {
  const [collections, setCollections] = useState<HadithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCollections(await fetchHadithCollections());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { collections, loading, error, reload: load };
}

export function useHadithBooks(collection: string | null) {
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!collection) {
      setBooks([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setBooks(await fetchHadithBooks(collection));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    load();
  }, [load]);

  return { books, loading, error, reload: load };
}

export function useHadithList(collection: string | null, bookNumber: string | null) {
  const [items, setItems] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    if (!collection || !bookNumber) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchHadiths(collection, bookNumber, 0, 50);
      setItems(await enrichHadithItemsWithBangla(data.items));
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hadiths');
    } finally {
      setLoading(false);
    }
  }, [collection, bookNumber]);

  const loadMore = useCallback(async () => {
    if (!collection || !bookNumber || !hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const data = await fetchHadiths(collection, bookNumber, items.length, 50);
      const enriched = await enrichHadithItemsWithBangla(data.items);
      setItems((prev) => [...prev, ...enriched]);
      setHasMore(data.hasMore);
    } catch {
      // keep existing items
    } finally {
      setLoadingMore(false);
    }
  }, [collection, bookNumber, hasMore, loadingMore, items.length]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, loadingMore, error, hasMore, total, reload: load, loadMore };
}

export function useHadithSearch(query: string, collection: string | null) {
  const [results, setResults] = useState<HadithItem[]>([]);
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
        const data = await searchHadiths(query, collection ?? undefined);
        if (active) setResults(await enrichHadithItemsWithBangla(data));
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, collection]);

  return { results, loading };
}
