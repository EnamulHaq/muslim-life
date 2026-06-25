import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AyahCard } from '@/components/quran/AyahCard';
import { AudioPlayerBar } from '@/components/ui/AudioPlayerBar';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useHifz } from '@/hooks/useHifz';
import { useQuranChapter } from '@/hooks/useQuran';
import {
  fetchSurahAudioUrl,
  getVerseRecitationUrl,
} from '@/services/quranAudioClient';

export default function SurahDetailScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const surahNumber = parseInt(id ?? '1', 10);
  const isHifzMode = mode === 'hifz';
  const { verses, chapter, loading, error, reload } = useQuranChapter(surahNumber);
  const { getSurahProgress, toggleVerseMemorized } = useHifz();
  const { activeId, isPlaying, isLoading, playUrl, stop } = useAudioPlayer();
  const [surahAudioUrl, setSurahAudioUrl] = useState<string | null>(null);
  const [hiddenVerses, setHiddenVerses] = useState<Set<number>>(new Set());
  const [activeWord, setActiveWord] = useState<{ verse: number; position: number } | null>(
    null
  );

  const stats = getSurahProgress(surahNumber, chapter?.versesCount ?? verses.length);
  const surahName = chapter?.nameSimple ?? `Surah ${surahNumber}`;

  useEffect(() => {
    fetchSurahAudioUrl(surahNumber).then(setSurahAudioUrl).catch(() => setSurahAudioUrl(null));
  }, [surahNumber]);

  useEffect(() => {
    if (isHifzMode) {
      setHiddenVerses(new Set(verses.map((v) => v.verseNumber)));
    }
  }, [isHifzMode, verses]);

  useEffect(() => {
    if (!activeId && !isPlaying) {
      setActiveWord(null);
    }
  }, [activeId, isPlaying]);

  const title = surahName;
  const subtitle = chapter
    ? `${chapter.nameBangla} · ${isHifzMode ? `Hifz ${stats.memorized}/${stats.total}` : `${chapter.versesCount} verses`}`
    : `${verses.length} verses`;

  const toggleHidden = (verseNumber: number) => {
    setHiddenVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) next.delete(verseNumber);
      else next.add(verseNumber);
      return next;
    });
  };

  const handlePlayWord = (wordId: string, audioUrl: string, verseNumber: number, position: number) => {
    setActiveWord({ verse: verseNumber, position });
    playUrl(wordId, audioUrl);
  };

  return (
    <View style={styles.wrapper}>
      <Header title={title} subtitle={subtitle} showBack />
      <ScreenContainer>
        {loading ? (
          <LoadingState message={`Loading Surah ${surahNumber}...`} />
        ) : error ? (
          <ErrorState title="Could not load surah" message={error} onRetry={reload} />
        ) : (
          <>
            {surahAudioUrl ? (
              <AudioPlayerBar
                title="Full Surah Recitation"
                subtitle="সম্পূর্ণ সূরার তিলাওয়াত"
                playId={`surah-${surahNumber}`}
                activeId={activeId}
                isPlaying={isPlaying}
                isLoading={isLoading}
                onPlay={() => playUrl(`surah-${surahNumber}`, surahAudioUrl)}
                onStop={stop}
              />
            ) : null}

            {isHifzMode ? (
              <View style={styles.hintBanner}>
                <Ionicons name="eye-off" size={18} color={Theme.colors.primary} />
                <Text style={styles.hintText}>
                  Tap ayah to reveal · Mark memorized with ✓
                </Text>
              </View>
            ) : (
              <View style={styles.hintBanner}>
                <Ionicons name="hand-left-outline" size={16} color={Theme.colors.primary} />
                <Text style={styles.hintText}>
                  Tap any word in the ayah to hear it and see its meaning · Play for full ayah
                </Text>
              </View>
            )}

            {!isHifzMode ? (
              <Pressable
                style={styles.tafsirBtn}
                onPress={() => router.push(`/quran/tafsir/${surahNumber}`)}
              >
                <Ionicons name="library-outline" size={18} color={Theme.colors.primary} />
                <View style={styles.tafsirBtnText}>
                  <Text style={styles.tafsirTitle}>Tafsir</Text>
                  <Text style={styles.tafsirSubtitle}>তাফসীর — ২০টি তাফসীর উপলব্ধ</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
              </Pressable>
            ) : null}

            {surahNumber !== 1 && surahNumber !== 9 && (
              <View style={styles.bismillah}>
                <Text style={styles.bismillahArabic}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
                <Text style={styles.bismillahBn}>পরম করুণাময় অতি দয়ালু আল্লাহর নামে</Text>
              </View>
            )}

            {verses.map((verse) => {
              const verseId = `verse-${surahNumber}-${verse.verseNumber}`;
              const activeWordPosition =
                activeWord?.verse === verse.verseNumber ? activeWord.position : null;

              return (
                <AyahCard
                  key={verse.id}
                  verse={verse}
                  surahNumber={surahNumber}
                  surahName={surahName}
                  activeId={activeId}
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  activeWordPosition={activeWordPosition}
                  onPlayWord={(wordId, audioUrl, position) =>
                    handlePlayWord(wordId, audioUrl, verse.verseNumber, position)
                  }
                  onPlayAyah={(vId, url) => playUrl(vId, url)}
                  getVerseAudioUrl={getVerseRecitationUrl}
                  isMemorized={stats.verses.includes(verse.verseNumber)}
                  isHidden={hiddenVerses.has(verse.verseNumber)}
                  isHifzMode={isHifzMode}
                  onToggleMemorized={() =>
                    toggleVerseMemorized(surahNumber, verse.verseNumber)
                  }
                  onReveal={() => toggleHidden(verse.verseNumber)}
                />
              );
            })}

            {verses.length === 0 && (
              <ErrorState
                title="No verses found"
                message="This surah could not be loaded. Please try again."
                onRetry={reload}
              />
            )}
          </>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary + '08',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  hintText: {
    flex: 1,
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
    fontWeight: '600',
    lineHeight: 18,
  },
  tafsirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  tafsirBtnText: { flex: 1 },
  tafsirTitle: { fontSize: Theme.fontSize.md, fontWeight: '700', color: Theme.colors.primary },
  tafsirSubtitle: { fontSize: Theme.fontSize.xs, color: Theme.colors.textSecondary, marginTop: 2 },
  bismillah: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  bismillahArabic: {
    fontSize: Theme.fontSize.arabicLarge,
    color: Theme.colors.primary,
    textAlign: 'center',
    lineHeight: 40,
  },
  bismillahBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
});
