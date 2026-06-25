import { QURAN_COM_API } from '@/constants/tafsir';
import { fetchWithCache } from '@/utils/offlineStore';

export type TafsirResource = {
  id: number;
  name: string;
  language: string;
  languageName: string;
};

export type AyahTafsir = {
  verseKey: string;
  verseNumber: number;
  text: string;
};

let cachedTafsirs: TafsirResource[] | null = null;

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function mapPool<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  concurrency = 6
): Promise<R[]> {
  if (items.length === 0) return [];
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

export async function fetchTafsirList(): Promise<TafsirResource[]> {
  if (cachedTafsirs) return cachedTafsirs;

  cachedTafsirs = await fetchWithCache('tafsir/list', async () => {
    const response = await fetch(`${QURAN_COM_API}/resources/tafsirs`);
    if (!response.ok) throw new Error('Failed to load tafsir list');

    const json = (await response.json()) as {
      tafsirs: { id: number; name: string; language_name: string; translated_name?: { name: string } }[];
    };

    return json.tafsirs.map((t) => ({
      id: t.id,
      name: t.translated_name?.name ?? t.name,
      language: t.language_name,
      languageName: t.language_name,
    }));
  });

  return cachedTafsirs;
}

export async function fetchAyahTafsir(
  tafsirId: number,
  chapterId: number,
  verseNumber: number
): Promise<AyahTafsir> {
  const response = await fetch(
    `${QURAN_COM_API}/tafsirs/${tafsirId}/by_ayah/${chapterId}:${verseNumber}`
  );

  if (!response.ok) {
    return { verseKey: `${chapterId}:${verseNumber}`, verseNumber, text: '' };
  }

  const json = (await response.json()) as { tafsir?: { text?: string } };
  return {
    verseKey: `${chapterId}:${verseNumber}`,
    verseNumber,
    text: stripHtml(json.tafsir?.text ?? ''),
  };
}

export async function fetchChapterTafsir(
  tafsirId: number,
  chapterId: number,
  verseCount: number
): Promise<AyahTafsir[]> {
  return fetchWithCache(`tafsir/${tafsirId}/chapter/${chapterId}`, async () => {
    const verseNumbers = Array.from({ length: verseCount }, (_, i) => i + 1);
    return mapPool(verseNumbers, (verseNumber) => fetchAyahTafsir(tafsirId, chapterId, verseNumber), 6);
  });
}
