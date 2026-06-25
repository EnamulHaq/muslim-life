export const QURAN_RECITERS = [
  { id: 7, name: 'Mishari Al-Afasy', nameBn: 'মিশারি আল-আফাসি', folder: 'murattal' },
  { id: 2, name: 'Abdul Basit', nameBn: 'আব্দুল বাসিত', folder: 'murattal' },
  { id: 4, name: 'Abu Bakr Ash-Shatri', nameBn: 'আবু বকর আশ-শাত্রি', folder: 'murattal' },
] as const;

export const DEFAULT_RECITER_ID = 7;

export const VERSE_AUDIO_BASE = 'https://everyayah.com/data/Alafasy_128kbps';

export const QURAN_AUDIO_API = 'https://api.quran.com/api/v4';

export const WORD_AUDIO_BASE = 'https://audio.qurancdn.com';

export function getWordAudioUrl(audioPath: string): string {
  if (audioPath.startsWith('http')) return audioPath;
  return `${WORD_AUDIO_BASE}/${audioPath}`;
}

export function getVerseAudioUrl(chapterId: number, verseNumber: number): string {
  return `${VERSE_AUDIO_BASE}/${String(chapterId).padStart(3, '0')}${String(verseNumber).padStart(3, '0')}.mp3`;
}

export function getSurahAudioFallbackUrl(chapterId: number): string {
  return `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${chapterId}.mp3`;
}
