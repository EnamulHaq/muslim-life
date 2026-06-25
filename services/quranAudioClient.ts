import {
  DEFAULT_RECITER_ID,
  getSurahAudioFallbackUrl,
  getVerseAudioUrl,
  QURAN_AUDIO_API,
} from '@/constants/audio';

type ChapterAudioFile = {
  chapter_id: number;
  audio_url: string;
};

export function getVerseRecitationUrl(chapterId: number, verseNumber: number): string {
  return getVerseAudioUrl(chapterId, verseNumber);
}

export async function fetchSurahAudioUrl(
  chapterId: number,
  reciterId = DEFAULT_RECITER_ID
): Promise<string> {
  try {
    const response = await fetch(
      `${QURAN_AUDIO_API}/chapter_recitations/${reciterId}?recitation=${reciterId}`
    );
    if (!response.ok) throw new Error('Failed');

    const json = (await response.json()) as { audio_files: ChapterAudioFile[] };
    const match = json.audio_files.find((file) => file.chapter_id === chapterId);
    if (match?.audio_url) return match.audio_url;
  } catch {
    // fallback below
  }

  return getSurahAudioFallbackUrl(chapterId);
}
