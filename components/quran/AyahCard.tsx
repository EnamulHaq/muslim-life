import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { RecitationButton } from '@/components/ui/RecitationButton';
import { Theme } from '@/constants/Theme';
import type { QuranVerseView, QuranWord } from '@/services/quranClient';
import {
  formatAyahShareText,
  formatWordCopyText,
  formatWordShareText,
} from '@/utils/quranShare';

type Props = {
  verse: QuranVerseView;
  surahNumber: number;
  surahName: string;
  activeId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  activeWordPosition: number | null;
  onPlayWord: (wordId: string, audioUrl: string, position: number) => void;
  onPlayAyah: (verseId: string, audioUrl: string) => void;
  getVerseAudioUrl: (surah: number, verse: number) => string;
  isMemorized?: boolean;
  isHidden?: boolean;
  isHifzMode?: boolean;
  onToggleMemorized?: () => void;
  onReveal?: () => void;
};

export function AyahCard({
  verse,
  surahNumber,
  surahName,
  activeId,
  isPlaying,
  isLoading,
  activeWordPosition,
  onPlayWord,
  onPlayAyah,
  getVerseAudioUrl,
  isMemorized,
  isHidden,
  isHifzMode,
  onToggleMemorized,
  onReveal,
}: Props) {
  const [selectedWord, setSelectedWord] = useState<QuranWord | null>(null);
  const verseId = `verse-${surahNumber}-${verse.verseNumber}`;

  const handleWordPress = (word: QuranWord) => {
    setSelectedWord(word);
    const wordId = `word-${surahNumber}-${verse.verseNumber}-${word.position}`;
    onPlayWord(wordId, word.audioUrl, word.position);
  };

  const copyAyah = async () => {
    const text = formatAyahShareText(verse, surahName, surahNumber);
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Ayah copied to clipboard');
  };

  const shareAyah = async () => {
    const text = formatAyahShareText(verse, surahName, surahNumber);
    await Share.share({ message: text });
  };

  const copyWord = async (word: QuranWord) => {
    await Clipboard.setStringAsync(formatWordCopyText(word));
    Alert.alert('Copied', 'Word copied to clipboard');
  };

  const shareWord = async (word: QuranWord) => {
    await Share.share({
      message: formatWordShareText(word, verse, surahName, surahNumber),
    });
  };

  if (isHifzMode && isHidden) {
    return (
      <View style={[styles.card, isMemorized && styles.cardMemorized]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.ayahBadge}>
              <Text style={styles.ayahNumber}>{verse.verseNumber}</Text>
            </View>
            {onToggleMemorized ? (
              <Pressable onPress={onToggleMemorized} hitSlop={8}>
                <Ionicons
                  name={isMemorized ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={22}
                  color={isMemorized ? Theme.colors.success : Theme.colors.textSecondary}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
        <Pressable style={styles.hiddenBox} onPress={onReveal}>
          <Ionicons name="eye-outline" size={20} color={Theme.colors.primary} />
          <Text style={styles.hiddenText}>Tap to reveal ayah</Text>
        </Pressable>
      </View>
    );
  }

  const hasWords = verse.words.length > 0;

  return (
    <View style={[styles.card, isMemorized && styles.cardMemorized]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.ayahBadge}>
            <Text style={styles.ayahNumber}>{verse.verseNumber}</Text>
          </View>
          {isHifzMode && onToggleMemorized ? (
            <Pressable onPress={onToggleMemorized} hitSlop={8}>
              <Ionicons
                name={isMemorized ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={22}
                color={isMemorized ? Theme.colors.success : Theme.colors.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} onPress={copyAyah} hitSlop={8}>
            <Ionicons name="copy-outline" size={18} color={Theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={shareAyah} hitSlop={8}>
            <Ionicons name="share-outline" size={18} color={Theme.colors.textSecondary} />
          </Pressable>
          <RecitationButton
            id={verseId}
            activeId={activeId}
            isPlaying={isPlaying}
            isLoading={isLoading}
            onPress={() => {
              setSelectedWord(null);
              onPlayAyah(verseId, getVerseAudioUrl(surahNumber, verse.verseNumber));
            }}
            label="Play"
          />
        </View>
      </View>

      {hasWords ? (
        <Text style={styles.arabicFlow}>
          {verse.words.map((word, index) => {
            const isActive =
              activeWordPosition === word.position ||
              selectedWord?.position === word.position;

            return (
              <Text
                key={word.position}
                onPress={() => handleWordPress(word)}
                style={[styles.arabicWord, isActive && styles.arabicWordActive]}
              >
                {word.arabic}
                {index < verse.words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
      ) : (
        <Text style={styles.arabicFlow}>{verse.arabic}</Text>
      )}

      {selectedWord ? (
        <View style={styles.wordPanel}>
          <View style={styles.wordPanelHeader}>
            <Text style={styles.wordPanelLabel}>Word meaning</Text>
            <Pressable onPress={() => setSelectedWord(null)} hitSlop={8}>
              <Ionicons name="close" size={18} color={Theme.colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={styles.wordPanelArabic}>{selectedWord.arabic}</Text>
          {selectedWord.transliteration ? (
            <Text style={styles.wordPanelTranslit}>{selectedWord.transliteration}</Text>
          ) : null}
          {selectedWord.translation ? (
            <Text style={styles.wordPanelTranslation}>{selectedWord.translation}</Text>
          ) : null}
          <View style={styles.wordPanelActions}>
            <Pressable
              style={styles.wordActionBtn}
              onPress={() => {
                const wordId = `word-${surahNumber}-${verse.verseNumber}-${selectedWord.position}`;
                onPlayWord(wordId, selectedWord.audioUrl, selectedWord.position);
              }}
            >
              <Ionicons name="volume-high" size={16} color={Theme.colors.primary} />
              <Text style={styles.wordActionText}>Listen</Text>
            </Pressable>
            <Pressable
              style={styles.wordActionBtn}
              onPress={() => copyWord(selectedWord)}
            >
              <Ionicons name="copy-outline" size={16} color={Theme.colors.primary} />
              <Text style={styles.wordActionText}>Copy</Text>
            </Pressable>
            <Pressable
              style={styles.wordActionBtn}
              onPress={() => shareWord(selectedWord)}
            >
              <Ionicons name="share-outline" size={16} color={Theme.colors.primary} />
              <Text style={styles.wordActionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {verse.bangla ? <Text style={styles.bangla}>{verse.bangla}</Text> : null}
      {verse.english ? <Text style={styles.english}>{verse.english}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardMemorized: {
    borderColor: Theme.colors.success + '60',
    backgroundColor: Theme.colors.success + '08',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  iconBtn: {
    padding: 6,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.background,
  },
  ayahBadge: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumber: {
    color: Theme.colors.textLight,
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
  },
  arabicFlow: {
    fontSize: Theme.fontSize.arabicLarge,
    color: Theme.colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 48,
    marginBottom: Theme.spacing.md,
  },
  arabicWord: {
    fontSize: Theme.fontSize.arabicLarge,
    color: Theme.colors.text,
    lineHeight: 48,
  },
  arabicWordActive: {
    color: Theme.colors.primary,
    backgroundColor: Theme.colors.primary + '18',
    borderRadius: 4,
  },
  wordPanel: {
    backgroundColor: Theme.colors.primary + '08',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '25',
  },
  wordPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  wordPanelLabel: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
    color: Theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wordPanelArabic: {
    fontSize: Theme.fontSize.arabicLarge,
    color: Theme.colors.text,
    textAlign: 'right',
    lineHeight: 40,
  },
  wordPanelTranslit: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accent,
    fontStyle: 'italic',
    marginTop: 4,
  },
  wordPanelTranslation: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
    lineHeight: 22,
  },
  wordPanelActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.primary + '20',
  },
  wordActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  wordActionText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  bangla: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 26,
    marginBottom: Theme.spacing.sm,
  },
  english: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  hiddenBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xl,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Theme.colors.border,
    gap: Theme.spacing.sm,
  },
  hiddenText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
});
