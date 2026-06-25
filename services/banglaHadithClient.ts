import { HADITH_BANGLA_CDN, HADITH_BANGLA_COLLECTIONS } from '@/constants/banglaSources';
import { HadithItem } from '@/services/hadithClient';
import { fetchWithCache } from '@/utils/offlineStore';

type BanglaHadithResponse = {
  hadith?: {
    bn?: string;
    grade?: string;
    narrator?: string;
  };
};

const cache = new Map<string, string>();

async function mapPool<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  concurrency = 8
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await mapper(items[current]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

export function hasBanglaHadith(collection: string): boolean {
  return collection in HADITH_BANGLA_COLLECTIONS;
}

export async function fetchBanglaHadithText(
  collection: string,
  hadithNumber: string
): Promise<string | null> {
  const folder = HADITH_BANGLA_COLLECTIONS[collection];
  if (!folder) return null;

  const key = `${collection}-${hadithNumber}`;
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const bangla = await fetchWithCache(`bangla-hadith/${key}`, async () => {
      const response = await fetch(`${HADITH_BANGLA_CDN}/${folder}/hadith/${hadithNumber}.json`);
      if (!response.ok) return '';

      const json = (await response.json()) as BanglaHadithResponse;
      return json.hadith?.bn?.trim() ?? '';
    });

    if (bangla) {
      cache.set(key, bangla);
      return bangla;
    }
    return null;
  } catch {
    return null;
  }
}

export async function enrichHadithItemsWithBangla(items: HadithItem[]): Promise<HadithItem[]> {
  return mapPool(items, async (item) => {
    if (!hasBanglaHadith(item.collection)) return item;

    const bangla = await fetchBanglaHadithText(item.collection, item.hadithNumber);
    return bangla ? { ...item, bangla } : item;
  });
}
