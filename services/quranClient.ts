import { QURAN_API_BASE, QURAN_TRANSLATIONS } from '@/constants/quran';
import { getWordAudioUrl, QURAN_AUDIO_API } from '@/constants/audio';
import { fetchWithCache } from '@/utils/offlineStore';

type ApiWord = {
  position: number;
  text_uthmani: string;
  char_type_name: string;
  audio_url?: string;
  translation?: { text: string };
  transliteration?: { text: string };
};

type ApiResponse<T> = {
  code: number;
  status: string;
  data: T;
};

type ApiChapter = {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
};

type ApiVerse = {
  id: number;
  verse_number: number;
  verse_key: string;
  chapter_id: number;
  text_uthmani: string;
  translations?: {
    slug: string;
    resource_name: string;
    language_name: string;
    text: string;
  }[];
  words?: ApiWord[];
};

type VersesPayload = {
  verses: ApiVerse[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    pages: number;
  };
};

export type ChapterWithBn = {
  id: number;
  nameSimple: string;
  nameArabic: string;
  nameEnglish: string;
  nameBangla: string;
  versesCount: number;
  revelationPlace: string;
  pages: number[];
};

export type QuranWord = {
  position: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl: string;
};

export type QuranVerseView = {
  id: number;
  verseNumber: number;
  verseKey: string;
  arabic: string;
  arabicIndopak?: string;
  arabicTajweed?: string;
  english: string;
  bangla: string;
  words: QuranWord[];
};

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${QURAN_API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Quran API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  if (json.code !== 200) {
    throw new Error(json.status || 'Quran API request failed');
  }

  return json.data;
}

export async function fetchChapters(): Promise<ChapterWithBn[]> {
  return fetchWithCache('quran/chapters', fetchChaptersFromNetwork);
}

async function fetchChaptersFromNetwork(): Promise<ChapterWithBn[]> {
  const [english, bengali] = await Promise.all([
    apiGet<{ chapters: ApiChapter[] }>('/chapters?language=en'),
    apiGet<{ chapters: ApiChapter[] }>('/chapters?language=bn'),
  ]);

  const banglaNames = new Map(bengali.chapters.map((c) => [c.id, c.translated_name.name]));

  return english.chapters.map((chapter) => ({
    id: chapter.id,
    nameSimple: chapter.name_simple,
    nameArabic: chapter.name_arabic,
    nameEnglish: chapter.translated_name.name,
    nameBangla: banglaNames.get(chapter.id) ?? chapter.translated_name.name,
    versesCount: chapter.verses_count,
    revelationPlace: chapter.revelation_place,
    pages: chapter.pages,
  }));
}

export async function fetchChapterVerses(chapterId: number): Promise<{
  verses: QuranVerseView[];
  chapter: ChapterWithBn | null;
}> {
  return fetchWithCache(`quran/v3/chapter/${chapterId}`, () => fetchChapterVersesFromNetwork(chapterId));
}

async function fetchChapterVersesFromNetwork(chapterId: number): Promise<{
  verses: QuranVerseView[];
  chapter: ChapterWithBn | null;
}> {
  const [chapterData, verses, tajweedData, indopakData] = await Promise.all([
    apiGet<{ chapter: ApiChapter }>(`/chapters/${chapterId}?language=en`).catch(() => null),
    fetchAllVerses(chapterId),
    fetchTajweedVerses(chapterId).catch(() => new Map<number, string>()),
    fetchIndoPakVerses(chapterId).catch(() => new Map<number, string>()),
  ]);

  const chapter = chapterData?.chapter
    ? {
        id: chapterData.chapter.id,
        nameSimple: chapterData.chapter.name_simple,
        nameArabic: chapterData.chapter.name_arabic,
        nameEnglish: chapterData.chapter.translated_name.name,
        nameBangla: chapterData.chapter.translated_name.name,
        versesCount: chapterData.chapter.verses_count,
        revelationPlace: chapterData.chapter.revelation_place,
        pages: chapterData.chapter.pages,
      }
    : null;

  if (chapter) {
    try {
      const bnChapter = await apiGet<{ chapter: ApiChapter }>(
        `/chapters/${chapterId}?language=bn`
      );
      chapter.nameBangla = bnChapter.chapter.translated_name.name;
    } catch {
      // Bengali name is optional
    }
  }

  // Merge Tajweed and IndoPak into verses
  const mergedVerses = verses.map((verse) => ({
    ...verse,
    arabicTajweed: tajweedData.get(verse.verseNumber),
    arabicIndopak: indopakData.get(verse.verseNumber),
  }));

  return { verses: mergedVerses, chapter };
}

async function fetchTajweedVerses(chapterId: number): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const res = await fetch(
      `${QURAN_AUDIO_API}/quran/verses/uthmani_tajweed?chapter_number=${chapterId}&per_page=300`
    );
    if (!res.ok) return map;
    const json = (await res.json()) as {
      verses: { id: number; verse_key: string; text_uthmani_tajweed: string }[];
    };
    json.verses?.forEach((v) => {
      const parts = v.verse_key.split(':');
      const vNum = parseInt(parts[1] || '0', 10);
      if (vNum > 0) map.set(vNum, v.text_uthmani_tajweed);
    });
  } catch {
    // optional fallback
  }
  return map;
}

async function fetchIndoPakVerses(chapterId: number): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const res = await fetch(
      `${QURAN_AUDIO_API}/quran/verses/indopak?chapter_number=${chapterId}&per_page=300`
    );
    if (!res.ok) return map;
    const json = (await res.json()) as {
      verses: { id: number; verse_key: string; text_indopak: string }[];
    };
    json.verses?.forEach((v) => {
      const parts = v.verse_key.split(':');
      const vNum = parseInt(parts[1] || '0', 10);
      if (vNum > 0) map.set(vNum, v.text_indopak);
    });
  } catch {
    // optional fallback
  }
  return map;
}

async function fetchAllVerses(chapterId: number): Promise<QuranVerseView[]> {
  const translations = `${QURAN_TRANSLATIONS.english},${QURAN_TRANSLATIONS.bengali}`;
  const allVerses: ApiVerse[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await apiGet<VersesPayload>(
      `/verses/by_chapter/${chapterId}?translations=${translations}&words=true&per_page=50&page=${page}`
    );

    allVerses.push(...data.verses);
    totalPages = data.pagination.pages;
    page += 1;

    if (data.verses.length === 0) break;
  }

  return allVerses.map(mapVerse);
}

function mapVerse(verse: ApiVerse): QuranVerseView {
  const english =
    verse.translations?.find((t) => t.slug === QURAN_TRANSLATIONS.english)?.text ??
    verse.translations?.find((t) => t.language_name === 'english')?.text ??
    '';
  const bangla =
    verse.translations?.find((t) => t.slug === QURAN_TRANSLATIONS.bengali)?.text ??
    verse.translations?.find((t) => t.language_name === 'bengali')?.text ??
    '';

  const parsedFromKey = verse.verse_key?.includes(':')
    ? parseInt(verse.verse_key.split(':')[1], 10)
    : NaN;

  const validVerseNum = !Number.isNaN(parsedFromKey) && parsedFromKey > 0
    ? parsedFromKey
    : verse.verse_number;

  return {
    id: verse.id,
    verseNumber: validVerseNum,
    verseKey: verse.verse_key || `${verse.chapter_id || ''}:${validVerseNum}`,
    arabic: verse.text_uthmani,
    english: cleanTranslation(english),
    bangla: cleanTranslation(bangla),
    words: mapWords(verse.words),
  };
}

function mapWords(words: ApiWord[] | undefined): QuranWord[] {
  if (!words) return [];

  return words
    .filter((word) => word.char_type_name === 'word' && word.audio_url)
    .map((word) => ({
      position: word.position,
      arabic: word.text_uthmani,
      transliteration: word.transliteration?.text ?? '',
      translation: cleanTranslation(word.translation?.text ?? ''),
      audioUrl: getWordAudioUrl(word.audio_url!),
    }));
}

export function cleanTranslation(text: string): string {
  if (!text) return '';
  return text
    .replace(/<sup\b[^>]*>.*?<\/sup>/gi, '') // Strip <sup foot_note=195932>1</sup>
    .replace(/<[^>]+>/g, '') // Strip any remaining HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+\d+\s*$/g, '')
    .trim();
}
