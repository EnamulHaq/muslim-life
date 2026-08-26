export type Reciter = {
  id: number;
  name: string;
  nameBn: string;
  style: string;
  subfolder: string; // EveryAyah folder name
  quranComId?: number;
};

export const QURAN_RECITERS: Reciter[] = [
  {
    id: 1,
    name: 'Mahmoud Khalil Al-Husary - Murattal',
    nameBn: 'মাহমুদ খলিল আল-হুসারী (মুরাত্তাল)',
    style: 'Murattal',
    subfolder: 'Husary_128kbps',
    quranComId: 6,
  },
  {
    id: 2,
    name: 'Mahmoud Khalil Al-Husary - Mujawwad',
    nameBn: 'মাহমুদ খলিল আল-হুসারী (মুজাওয়াদ)',
    style: 'Mujawwad',
    subfolder: 'Husary_128kbps_Mujawwad',
    quranComId: 12,
  },
  {
    id: 3,
    name: 'Mishary Rashid Alafasy',
    nameBn: 'মিশারি রাশিদ আল-আফাসি',
    style: 'Murattal',
    subfolder: 'Alafasy_128kbps',
    quranComId: 7,
  },
  {
    id: 4,
    name: 'AbdulBaset AbdulSamad - Murattal',
    nameBn: 'আব্দুল বাসেত আব্দুল সামাদ (মুরাত্তাল)',
    style: 'Murattal',
    subfolder: 'Abdul_Basit_Murattal_192kbps',
    quranComId: 2,
  },
  {
    id: 5,
    name: 'AbdulBaset AbdulSamad - Mujawwad',
    nameBn: 'আব্দুল বাসেত আব্দুল সামাদ (মুজাওয়াদ)',
    style: 'Mujawwad',
    subfolder: 'AbdulSamad_64kbps_QuranExplorer.Com',
    quranComId: 1,
  },
  {
    id: 6,
    name: 'Abu Bakr Al-Shatri',
    nameBn: 'আবু বকর আশ-শাত্রি',
    style: 'Murattal',
    subfolder: 'Abu_Bakr_Ash-Shaatree_128kbps',
    quranComId: 4,
  },
  {
    id: 7,
    name: 'Saad Al-Ghamdi',
    nameBn: 'সাআদ আল-গামদী',
    style: 'Murattal',
    subfolder: 'Ghamadi_40kbps',
    quranComId: 3,
  },
  {
    id: 8,
    name: 'Maher Al-Muaiqly',
    nameBn: 'মাহের আল-মুয়াইকলী',
    style: 'Murattal',
    subfolder: 'Maher_AlMuaiqly_64kbps',
    quranComId: 9,
  },
  {
    id: 9,
    name: 'Abdul Rahman Al-Sudais',
    nameBn: 'আব্দুর রহমান আস-সুদাইস',
    style: 'Murattal',
    subfolder: 'Abdurrahmaan_As-Sudais_192kbps',
    quranComId: 5,
  },
  {
    id: 10,
    name: 'Saud Al-Shuraim',
    nameBn: 'সউদ আশ-শুরাইম',
    style: 'Murattal',
    subfolder: 'Saood_ash-Shuraym_128kbps',
    quranComId: 10,
  },
];

export const DEFAULT_RECITER_ID = 1; // Mahmoud Khalil Al-Husary - Murattal (matches screenshots)

export const EVERYAYAH_BASE = 'https://everyayah.com/data';
export const QURAN_AUDIO_API = 'https://api.quran.com/api/v4';
export const WORD_AUDIO_BASE = 'https://audio.qurancdn.com';

export function getWordAudioUrl(audioPath: string): string {
  if (audioPath.startsWith('http')) return audioPath;
  return `${WORD_AUDIO_BASE}/${audioPath}`;
}

export function getVerseAudioUrl(
  chapterId: number,
  verseNumber: number,
  reciterId = DEFAULT_RECITER_ID
): string {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) ?? QURAN_RECITERS[0];
  const surahStr = String(chapterId).padStart(3, '0');
  const ayahStr = String(verseNumber).padStart(3, '0');
  return `${EVERYAYAH_BASE}/${reciter.subfolder}/${surahStr}${ayahStr}.mp3`;
}

export function getSurahAudioFallbackUrl(chapterId: number, reciterId = DEFAULT_RECITER_ID): string {
  const reciter = QURAN_RECITERS.find((r) => r.id === reciterId) ?? QURAN_RECITERS[0];
  const surahStr = String(chapterId).padStart(3, '0');
  return `${EVERYAYAH_BASE}/${reciter.subfolder}/${surahStr}001.mp3`;
}

