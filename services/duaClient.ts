import { HISN_API_BASE, HISN_TITLE_BN } from '@/constants/hisnulMuslim';
import { fetchWithCache, readCache } from '@/utils/offlineStore';

type HisnChapterIndex = {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: string;
};

type HisnDuaEntry = {
  ID: number;
  ARABIC_TEXT?: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
  TRANSLATED_TEXT?: string;
  REPEAT?: number;
  AUDIO?: string;
};

export type DuaChapter = {
  id: string;
  number: string;
  titleEn: string;
  titleAr: string;
  titleBn: string;
  audioUrl?: string;
};

export type DuaItem = {
  id: string;
  number: string;
  chapterId: string;
  title: string;
  titleBn: string;
  category: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
  reference: string;
  audioUrl: string;
  repeat: number;
};

let cachedDuas: DuaItem[] | null = null;
let cachedChapters: DuaChapter[] | null = null;

function toHttps(url: string): string {
  return url.replace(/^http:\/\//i, 'https://');
}

function stripBom(raw: string): string {
  return typeof raw === 'string' ? raw.replace(/^\uFEFF/, '') : '';
}

function cleanText(text: string | undefined | null): string {
  if (!text) return '';
  return text.replace(/^\(|\)$/g, '').trim();
}

function parseChapterJson(raw: string): Record<string, HisnDuaEntry[]> {
  const cleaned = stripBom(raw);
  const normalized = cleaned.replace(/:\s*[\r\n]+\s*\[/g, ': [');

  try {
    const json = JSON.parse(normalized) as Record<string, HisnDuaEntry[]>;
    if (json && typeof json === 'object') return json;
  } catch {
    // fall through to regex extraction
  }

  const entries: HisnDuaEntry[] = [];
  const pattern =
    /\{\s*"ID"\s*:\s*(\d+)\s*,\s*"ARABIC_TEXT"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,[\s\S]*?"TRANSLATED_TEXT"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,[\s\S]*?"REPEAT"\s*:\s*(\d+)\s*,[\s\S]*?"AUDIO"\s*:\s*"((?:[^"\\]|\\.)*)"/g;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(cleaned)) !== null) {
    entries.push({
      ID: Number(match[1]),
      ARABIC_TEXT: match[2],
      TRANSLATED_TEXT: match[3],
      REPEAT: Number(match[4]),
      AUDIO: match[5],
    });
  }

  if (entries.length === 0) return {};
  return { recovered: entries };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const raw = stripBom(await response.text());
  return JSON.parse(raw) as T;
}

async function fetchChapterIndex(): Promise<HisnChapterIndex[]> {
  const response = await fetch(`${HISN_API_BASE}/en/husn_en.json`);
  if (!response.ok) throw new Error('Failed to load Hisn al-Muslim index');

  const json = await parseJsonResponse<{ English?: HisnChapterIndex[] }>(response);
  if (!Array.isArray(json.English)) {
    throw new Error('Invalid Hisn al-Muslim index response');
  }

  return json.English;
}

function mapEntryToDua(
  chapter: HisnChapterIndex,
  entry: HisnDuaEntry,
  titleBn: string
): DuaItem | null {
  if (!entry?.ID) return null;

  const arabic = cleanText(entry.ARABIC_TEXT);
  const english = cleanText(entry.TRANSLATED_TEXT);
  if (!arabic && !english) return null;

  return {
    id: `hisn-${chapter.ID}-${entry.ID}`,
    number: String(entry.ID),
    chapterId: String(chapter.ID),
    title: chapter.TITLE,
    titleBn,
    category: chapter.TITLE,
    arabic,
    transliteration: cleanText(entry.LANGUAGE_ARABIC_TRANSLATED_TEXT),
    english,
    bangla: '',
    reference: '',
    audioUrl: entry.AUDIO ? toHttps(entry.AUDIO) : '',
    repeat: entry.REPEAT ?? 1,
  };
}

async function fetchChapterDuas(chapter: HisnChapterIndex): Promise<DuaItem[]> {
  try {
    const response = await fetch(toHttps(chapter.TEXT));
    if (!response.ok) return [];

    const raw = await response.text();
    const json = parseChapterJson(raw);
    const entries = Object.values(json).flat().filter(Boolean);
    const titleBn = HISN_TITLE_BN[chapter.TITLE] ?? chapter.TITLE;

    return entries
      .map((entry) => mapEntryToDua(chapter, entry, titleBn))
      .filter((dua): dua is DuaItem => dua !== null);
  } catch {
    return [];
  }
}

async function mapPool<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  concurrency = 8
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

export async function fetchDuaChapters(): Promise<DuaChapter[]> {
  if (cachedChapters) return cachedChapters;

  const index = await fetchWithCache('dua/chapters-index', fetchChapterIndex);
  cachedChapters = index.map((chapter) => ({
    id: String(chapter.ID),
    number: String(chapter.ID),
    titleEn: chapter.TITLE,
    titleAr: chapter.TITLE,
    titleBn: HISN_TITLE_BN[chapter.TITLE] ?? chapter.TITLE,
    audioUrl: chapter.AUDIO_URL ? toHttps(chapter.AUDIO_URL) : undefined,
  }));

  return cachedChapters;
}

export async function fetchAllDuas(): Promise<DuaItem[]> {
  if (cachedDuas) return cachedDuas;

  const cached = await readCache<DuaItem[]>('dua/all');
  if (cached && cached.length > 0) {
    cachedDuas = cached;
    return cachedDuas;
  }

  const index = await fetchWithCache('dua/chapters-index', fetchChapterIndex);
  const chapterResults = await mapPool(index, fetchChapterDuas, 8);
  cachedDuas = chapterResults.flat();

  if (cachedDuas.length === 0) {
    throw new Error('No duas could be loaded from Hisn al-Muslim');
  }

  await fetchWithCache('dua/all', async () => cachedDuas!);
  return cachedDuas;
}

export async function searchDuas(query: string): Promise<DuaItem[]> {
  const duas = await fetchAllDuas();
  const q = query.toLowerCase();

  return duas.filter(
    (dua) =>
      dua.title.toLowerCase().includes(q) ||
      dua.titleBn.includes(query) ||
      dua.arabic.includes(query) ||
      dua.english.toLowerCase().includes(q) ||
      dua.transliteration.toLowerCase().includes(q)
  );
}
