import {
  DEFAULT_RECITER_ID,
  getSurahAudioFallbackUrl,
  getVerseAudioUrl,
  QURAN_AUDIO_API,
  QURAN_RECITERS,
} from '@/constants/audio';

type ChapterAudioFile = {
  chapter_id: number;
  audio_url: string;
};

export function getVerseRecitationUrl(
  chapterId: number,
  verseNumber: number,
  reciterId = DEFAULT_RECITER_ID
): string {
  return getVerseAudioUrl(chapterId, verseNumber, reciterId);
}

export async function fetchSurahAudioUrl(
  chapterId: number,
  reciterId = DEFAULT_RECITER_ID
): Promise<string> {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) ?? QURAN_RECITERS[0];
  const qdcId = reciter.quranComId ?? 7;

  try {
    const response = await fetch(
      `${QURAN_AUDIO_API}/chapter_recitations/${qdcId}?recitation=${qdcId}`
    );
    if (!response.ok) throw new Error('Failed');

    const json = (await response.json()) as { audio_files: ChapterAudioFile[] };
    const match = json.audio_files.find((file) => file.chapter_id === chapterId);
    if (match?.audio_url) return match.audio_url;
  } catch {
    // fallback
  }

  return getSurahAudioFallbackUrl(chapterId, reciterId);
}
