import type { QuranVerseView, QuranWord } from '@/services/quranClient';

export function formatAyahShareText(
  verse: QuranVerseView,
  surahName: string,
  surahNumber: number
): string {
  const lines = [
    `${surahName} (${surahNumber}:${verse.verseNumber})`,
    verse.arabic,
    '',
    verse.english || verse.bangla,
    verse.bangla && verse.english ? verse.bangla : '',
    '',
    '— Muslim Life',
  ].filter((line, i, arr) => !(line === '' && arr[i - 1] === ''));

  return lines.join('\n').trim();
}

export function formatWordShareText(
  word: QuranWord,
  verse: QuranVerseView,
  surahName: string,
  surahNumber: number
): string {
  return [
    `${surahName} (${surahNumber}:${verse.verseNumber})`,
    word.arabic,
    word.transliteration,
    word.translation,
    '',
    '— Muslim Life',
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatWordCopyText(word: QuranWord): string {
  return [word.arabic, word.transliteration, word.translation].filter(Boolean).join('\n');
}
