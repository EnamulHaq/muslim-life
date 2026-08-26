import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AyahCard } from '@/components/quran/AyahCard';
import { QuranSettingsSheet } from '@/components/quran/QuranSettingsSheet';
import { AudioPlayerBar } from '@/components/ui/AudioPlayerBar';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { Theme } from '@/constants/Theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useHifz } from '@/hooks/useHifz';
import { useQuranChapter } from '@/hooks/useQuran';
import { useQuranSettings } from '@/hooks/useQuranSettings';
import {
  fetchSurahAudioUrl,
  getVerseRecitationUrl,
} from '@/services/quranAudioClient';
import type { QuranVerseView } from '@/services/quranClient';
import { getTajweedStyledBismillah } from '@/utils/tajweed';

export default function SurahDetailScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const surahNumber = parseInt(id ?? '1', 10);
  const isHifzMode = mode === 'hifz';
  const { verses, chapter, loading, error, reload } = useQuranChapter(surahNumber);
  const { getSurahProgress, toggleVerseMemorized } = useHifz();
  const { activeId, isPlaying, isLoading, playUrl, stop } = useAudioPlayer();
  const { quranSettings, activeReciter } = useQuranSettings();

  const [surahAudioUrl, setSurahAudioUrl] = useState<string | null>(null);
  const [hiddenVerses, setHiddenVerses] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [activeWord, setActiveWord] = useState<{ verse: number; position: number } | null>(
    null
  );

  const stats = getSurahProgress(surahNumber, chapter?.versesCount ?? verses.length);
  const surahName = chapter?.nameSimple ?? `Surah ${surahNumber}`;

  useEffect(() => {
    fetchSurahAudioUrl(surahNumber, activeReciter.id)
      .then(setSurahAudioUrl)
      .catch(() => setSurahAudioUrl(null));
  }, [surahNumber, activeReciter.id]);

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

  const title = chapter ? `${surahNumber}. Surah ${chapter.nameSimple}` : surahName;
  const subtitle = chapter
    ? `${chapter.nameBangla} (${chapter.nameEnglish}) · ${isHifzMode ? `Hifz ${stats.memorized}/${stats.total}` : `${chapter.versesCount} verses`}`
    : `${verses.length} verses`;

  const toggleHidden = useCallback((verseNumber: number) => {
    setHiddenVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) next.delete(verseNumber);
      else next.add(verseNumber);
      return next;
    });
  }, []);

  const handlePlayWord = useCallback((wordId: string, audioUrl: string, verseNumber: number, position: number) => {
    setActiveWord({ verse: verseNumber, position });
    playUrl(wordId, audioUrl);
  }, [playUrl]);

  const tajweedTokens = useMemo(() => getTajweedStyledBismillah(), []);

  const keyExtractor = useCallback((item: QuranVerseView) => String(item.id), []);

  const renderVerseItem = useCallback(({ item: verse }: { item: QuranVerseView }) => {
    const activeWordPosition =
      activeWord?.verse === verse.verseNumber ? activeWord.position : null;

    return (
      <AyahCard
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
        getVerseAudioUrl={(s, v) => getVerseRecitationUrl(s, v, activeReciter.id)}
        isMemorized={stats.verses.includes(verse.verseNumber)}
        isHidden={hiddenVerses.has(verse.verseNumber)}
        isHifzMode={isHifzMode}
        onToggleMemorized={() =>
          toggleVerseMemorized(surahNumber, verse.verseNumber)
        }
        onReveal={() => toggleHidden(verse.verseNumber)}
      />
    );
  }, [activeWord, surahNumber, surahName, activeId, isPlaying, isLoading, handlePlayWord, playUrl, activeReciter.id, stats.verses, hiddenVerses, isHifzMode, toggleVerseMemorized, toggleHidden]);

  const ListHeader = useMemo(() => (
    <>
      {/* Quick Bar: Active Reciter & Appearance Trigger */}
      <View style={styles.reciterBar}>
        <Pressable
          style={styles.reciterBarContent}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="headset-outline" size={16} color={Theme.colors.primary} />
          <Text style={styles.reciterBarText} numberOfLines={1}>
            {activeReciter.name} · {quranSettings.scriptType.toUpperCase()}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Theme.colors.textSecondary} />
        </Pressable>
      </View>

      {surahAudioUrl ? (
        <AudioPlayerBar
          title={`Full Surah Recitation`}
          subtitle={`${activeReciter.name}`}
          playId={`surah-${surahNumber}-${activeReciter.id}`}
          activeId={activeId}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onPlay={() => playUrl(`surah-${surahNumber}-${activeReciter.id}`, surahAudioUrl)}
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
            Tap any word to see meaning & listen · Tap Settings (top right) to change reciter or script
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
          {quranSettings.scriptType === 'tajweed' && quranSettings.showTajweedRules ? (
            <Text style={styles.bismillahArabic}>
              {tajweedTokens.map((t, i) =>
                t.isEndMarker ? null : (
                  <Text key={i} style={t.color ? { color: t.color } : { color: Theme.colors.text }}>
                    {t.text}
                  </Text>
                )
              )}
            </Text>
          ) : (
            <Text style={styles.bismillahArabic}>
              {quranSettings.scriptType === 'indopak'
                ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
                : 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'}
            </Text>
          )}
          <Text style={styles.bismillahBn}>পরম করুণাময় অতি দয়ালু আল্লাহর নামে</Text>
        </View>
      )}
    </>
  ), [activeReciter, quranSettings, surahAudioUrl, surahNumber, activeId, isPlaying, isLoading, isHifzMode, tajweedTokens, playUrl, stop]);

  const ListEmpty = useMemo(() => (
    <ErrorState
      title="No verses found"
      message="This surah could not be loaded. Please try again."
      onRetry={reload}
    />
  ), [reload]);

  return (
    <View style={styles.wrapper}>
      <Header
        title={title}
        subtitle={subtitle}
        showBack
        rightAction={
          <Pressable
            style={styles.settingsHeaderBtn}
            onPress={() => setShowSettings(true)}
            hitSlop={8}
          >
            <Ionicons name="options-outline" size={22} color={Theme.colors.textLight} />
          </Pressable>
        }
      />

      {loading ? (
        <LoadingState message={`Loading Surah ${surahNumber}...`} />
      ) : error ? (
        <ErrorState title="Could not load surah" message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={verses}
          keyExtractor={keyExtractor}
          renderItem={renderVerseItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          windowSize={7}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Quran.com Appearance & Options Sheet */}
      <QuranSettingsSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  settingsHeaderBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  listContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  reciterBar: {
    marginBottom: Theme.spacing.sm,
  },
  reciterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 8,
  },
  reciterBarText: {
    flex: 1,
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
    color: Theme.colors.text,
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
