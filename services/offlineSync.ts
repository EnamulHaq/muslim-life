import { fetchChapters, fetchChapterVerses } from '@/services/quranClient';
import { fetchAllDuas } from '@/services/duaClient';
import {
  fetchHadithBooks,
  fetchHadithCollections,
  fetchHadiths,
  type HadithItem,
} from '@/services/hadithClient';
import { enrichHadithItemsWithBangla, hasBanglaHadith } from '@/services/banglaHadithClient';
import { fetchChapterTafsir, fetchTafsirList } from '@/services/tafsirClient';
import { readSyncMeta, writeCache, writeSyncMeta } from '@/utils/offlineStore';

export type SyncState = {
  status: 'idle' | 'running' | 'done' | 'error';
  phase: string;
  current: number;
  total: number;
  error?: string;
};

let state: SyncState = { status: 'idle', phase: '', current: 0, total: 0 };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function setState(next: Partial<SyncState>) {
  state = { ...state, ...next };
  notify();
}

export function getSyncState(): SyncState {
  return state;
}

export function subscribeSync(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function syncAllReadingContent(): Promise<void> {
  if (state.status === 'running') return;

  setState({ status: 'running', phase: 'Quran', current: 0, total: 114, error: undefined });

  try {
    await fetchChapters();
    for (let chapterId = 1; chapterId <= 114; chapterId += 1) {
      await fetchChapterVerses(chapterId);
      setState({ current: chapterId, total: 114, phase: `Quran (${chapterId}/114)` });
    }
    await writeSyncMeta({ ...(await readSyncMeta()), quranReady: true });

    setState({ phase: 'Dua & Azkar', current: 0, total: 1 });
    await fetchAllDuas();
    await writeSyncMeta({ ...(await readSyncMeta()), duaReady: true });

    setState({ phase: 'Hadith', current: 0, total: 1 });
    const collections = await fetchHadithCollections();
    const searchIndex: HadithItem[] = [];

    for (const collection of collections) {
      const books = await fetchHadithBooks(collection.slug);
      for (const book of books) {
        let offset = 0;
        let hasMore = true;
        while (hasMore) {
          const result = await fetchHadiths(collection.slug, book.bookNumber, offset);
          const items = hasBanglaHadith(collection.slug)
            ? await enrichHadithItemsWithBangla(result.items)
            : result.items;
          searchIndex.push(...items);
          hasMore = result.hasMore;
          offset += 50;
          setState({ phase: `Hadith: ${collection.nameBn}`, current: searchIndex.length });
        }
      }
    }
    await writeCache('hadith/search-index', searchIndex);
    await writeSyncMeta({ ...(await readSyncMeta()), hadithReady: true });

    setState({ phase: 'Tafsir', current: 0, total: 114 });
    const tafsirs = await fetchTafsirList();
    const defaultTafsir =
      tafsirs.find((t) => t.language === 'bengali') ?? tafsirs.find((t) => t.language === 'english') ?? tafsirs[0];

    if (defaultTafsir) {
      const chapters = await fetchChapters();
      for (const chapter of chapters) {
        await fetchChapterTafsir(defaultTafsir.id, chapter.id, chapter.versesCount);
        setState({ current: chapter.id, total: chapters.length, phase: `Tafsir (${chapter.id}/${chapters.length})` });
      }
    }

    await writeSyncMeta({
      quranReady: true,
      duaReady: true,
      hadithReady: true,
      tafsirReady: Boolean(defaultTafsir),
      completedAt: new Date().toISOString(),
    });
    setState({ status: 'done', phase: 'Complete', current: 1, total: 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Offline sync failed';
    setState({ status: 'error', error: message });
    throw err;
  }
}
