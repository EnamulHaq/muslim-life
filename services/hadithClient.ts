import { islamicGet } from '@/services/islamicApi';
import { fetchWithCache, readCache } from '@/utils/offlineStore';

type LocalizedText = { en: string; ar: string };

type ApiCollection = {
  slug: string;
  type: string;
  name: LocalizedText;
  intro: LocalizedText;
  totalHadith: number;
  totalAvailable: number;
};

type ApiBook = {
  collection: string;
  bookNumber: string;
  name: LocalizedText;
  hadithCount: number;
};

type ApiHadithEntry = {
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  chapterTitle: LocalizedText;
  en: {
    text: string;
    body: string;
    grades: { graded_by: string | null; grade: string }[];
  };
  ar: {
    text: string;
    body: string;
  };
};

type HadithListResponse = {
  total: number;
  limit: number;
  offset: number;
  hadiths: ApiHadithEntry[];
};

export type HadithCollection = {
  slug: string;
  nameEn: string;
  nameAr: string;
  nameBn: string;
  total: number;
};

export type HadithBook = {
  collection: string;
  bookNumber: string;
  nameEn: string;
  nameAr: string;
  hadithCount: number;
};

export type HadithItem = {
  id: string;
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  bookName?: string;
  chapterTitle: string;
  chapterTitleAr: string;
  arabic: string;
  bangla?: string;
  english: string;
  grade: string;
  reference: string;
};

const COLLECTION_NAMES_BN: Record<string, string> = {
  bukhari: 'সহিহ বুখারি',
  muslim: 'সহিহ মুসলিম',
  nasai: 'সুনান নাসাই',
  abudawud: 'সুনান আবু দাউদ',
  tirmidhi: 'জামি তিরমিযি',
  ibnmajah: 'সুনান ইবনে মাজাহ',
  malik: 'মুয়াত্তা মালিক',
  nawawi40: 'আন-নওয়াবীর ৪০ হাদিস',
  riyadussalihin: 'রিয়াদুস সালিহিন',
  adab: 'আল-আদাব আল-মুফরাদ',
  shamail: 'শামায়েল মুহাম্মাদিয়াহ',
  mishkat: 'মিশকাতুল মাসাবিহ',
  bulugh: 'বুলুগুল মারাম',
};

export async function fetchHadithCollections(): Promise<HadithCollection[]> {
  return fetchWithCache('hadith/collections', async () => {
    const collections = await islamicGet<ApiCollection[]>('/hadith/collections?type=hadith');

    return collections.map((item) => ({
      slug: item.slug,
      nameEn: item.name.en,
      nameAr: item.name.ar,
      nameBn: COLLECTION_NAMES_BN[item.slug] ?? item.name.en,
      total: item.totalAvailable,
    }));
  });
}

export async function fetchHadithBooks(collection: string): Promise<HadithBook[]> {
  return fetchWithCache(`hadith/${collection}/books`, async () => {
    const books = await islamicGet<ApiBook[]>(`/hadith/collections/${collection}/books`);

    return books.map((book) => ({
      collection: book.collection,
      bookNumber: book.bookNumber,
      nameEn: book.name.en,
      nameAr: book.name.ar,
      hadithCount: book.hadithCount,
    }));
  });
}

export async function fetchHadiths(
  collection: string,
  bookNumber: string,
  offset = 0,
  limit = 50
): Promise<{ items: HadithItem[]; total: number; hasMore: boolean }> {
  return fetchWithCache(`hadith/${collection}/${bookNumber}/${offset}-${limit}`, async () => {
    const data = await islamicGet<HadithListResponse>(
      `/hadith/collections/${collection}/books/${bookNumber}/hadiths?limit=${limit}&offset=${offset}`
    );

    const items = data.hadiths.map((hadith) => ({
      id: `${hadith.collection}-${hadith.bookNumber}-${hadith.hadithNumber}`,
      collection: hadith.collection,
      bookNumber: hadith.bookNumber,
      hadithNumber: hadith.hadithNumber,
      chapterTitle: hadith.chapterTitle.en,
      chapterTitleAr: hadith.chapterTitle.ar,
      arabic: hadith.ar.text,
      english: hadith.en.text,
      grade: hadith.en.grades[0]?.grade ?? '',
      reference: `${COLLECTION_NAMES_BN[hadith.collection] ?? hadith.collection} ${hadith.hadithNumber}`,
    }));

    return {
      items,
      total: data.total,
      hasMore: offset + items.length < data.total,
    };
  });
}

function searchHadithIndex(items: HadithItem[], query: string, collection?: string, limit = 50) {
  const q = query.toLowerCase();
  return items
    .filter((hadith) => {
      if (collection && hadith.collection !== collection) return false;
      return (
        hadith.arabic.includes(query) ||
        hadith.english.toLowerCase().includes(q) ||
        (hadith.bangla?.includes(query) ?? false) ||
        hadith.hadithNumber.includes(query) ||
        hadith.chapterTitle.toLowerCase().includes(q)
      );
    })
    .slice(0, limit);
}

export async function searchHadiths(
  query: string,
  collection?: string,
  limit = 50
): Promise<HadithItem[]> {
  const cacheKey = `hadith/search/${encodeURIComponent(query)}${collection ? `/${collection}` : ''}/${limit}`;

  try {
    return await fetchWithCache(cacheKey, async () => {
      const params = new URLSearchParams({
        q: query,
        lang: 'en',
        limit: String(limit),
      });
      if (collection) params.set('collection', collection);

      const data = await islamicGet<{
        results: ApiHadithEntry[];
      }>(`/hadith/search?${params.toString()}`);

      return data.results.map((hadith) => ({
        id: `${hadith.collection}-${hadith.bookNumber}-${hadith.hadithNumber}`,
        collection: hadith.collection,
        bookNumber: hadith.bookNumber,
        hadithNumber: hadith.hadithNumber,
        chapterTitle: hadith.chapterTitle.en,
        chapterTitleAr: hadith.chapterTitle.ar,
        arabic: hadith.ar.text,
        english: hadith.en.text,
        grade: hadith.en.grades[0]?.grade ?? '',
        reference: `${COLLECTION_NAMES_BN[hadith.collection] ?? hadith.collection} ${hadith.hadithNumber}`,
      }));
    });
  } catch {
    const index = await readCache<HadithItem[]>('hadith/search-index');
    if (index?.length) {
      return searchHadithIndex(index, query, collection, limit);
    }
    throw new Error('Hadith search unavailable offline');
  }
}
