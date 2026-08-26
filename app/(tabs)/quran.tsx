import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { QuranSettingsSheet } from '@/components/quran/QuranSettingsSheet';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { SearchBar } from '@/components/ui/SearchBar';
import { Theme } from '@/constants/Theme';
import { useAppTheme } from '@/context/AppThemeContext';
import { useQuranChapters } from '@/hooks/useQuran';
import { useQuranSettings } from '@/hooks/useQuranSettings';
import type { ChapterWithBn } from '@/services/quranClient';

export default function QuranScreen() {
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { chapters, loading, error, reload } = useQuranChapters();
  const { activeReciter, quranSettings } = useQuranSettings();
  const { colors } = useAppTheme();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (s) =>
        s.nameSimple.toLowerCase().includes(q) ||
        s.nameArabic.includes(search) ||
        s.nameEnglish.toLowerCase().includes(q) ||
        s.nameBangla.includes(search) ||
        String(s.id).includes(q)
    );
  }, [search, chapters]);

  const keyExtractor = useCallback((item: ChapterWithBn) => String(item.id), []);

  const renderSurahItem = useCallback(({ item: surah }: { item: ChapterWithBn }) => (
    <Pressable
      style={({ pressed }) => [styles.surahCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}
      onPress={() => router.push(`/quran/${surah.id}`)}
    >
      <View style={[styles.numberBadge, { backgroundColor: colors.primary + '15' }]}>
        <Text style={[styles.numberText, { color: colors.primary }]}>{surah.id}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={[styles.nameEnglish, { color: colors.text }]}>{surah.nameSimple}</Text>
        <Text style={[styles.nameBangla, { color: colors.textSecondary }]}>{surah.nameBangla}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {surah.versesCount} verses · {surah.revelationPlace}
        </Text>
      </View>
      <Text style={[styles.nameArabic, { color: colors.primary }]}>{surah.nameArabic}</Text>
    </Pressable>
  ), [colors]);

  const ListHeader = useMemo(() => (
    <>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search surah..."
      />

      <View style={styles.quickLinks}>
        <Pressable
          style={[styles.quickLink, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }]}
          onPress={() => router.push('/features/nurani-qaida' as never)}
        >
          <Ionicons name="school-outline" size={18} color={colors.primary} />
          <Text style={[styles.quickLinkText, { color: colors.primary }]}>নূরানী</Text>
        </Pressable>
        <Pressable style={[styles.quickLink, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }]} onPress={() => router.push('/features/hifz' as never)}>
          <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
          <Text style={[styles.quickLinkText, { color: colors.primary }]}>Hifz</Text>
        </Pressable>
        <Pressable style={[styles.quickLink, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }]} onPress={() => setShowSettings(true)}>
          <Ionicons name="color-palette-outline" size={18} color={colors.primary} />
          <Text style={[styles.quickLinkText, { color: colors.primary }]}>Font & Audio</Text>
        </Pressable>
      </View>

      {/* Reciter & Script Banner */}
      <Pressable style={[styles.reciterBanner, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setShowSettings(true)}>
        <View style={styles.reciterBannerLeft}>
          <Ionicons name="headset" size={22} color={colors.primary} />
          <View style={styles.reciterBannerInfo}>
            <Text style={[styles.reciterBannerTitle, { color: colors.text }]}>{activeReciter.name}</Text>
            <Text style={[styles.reciterBannerSub, { color: colors.textSecondary }]}>
              Script: {quranSettings.scriptType.toUpperCase()} · Font: {quranSettings.fontStyle}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </Pressable>

      <View style={[styles.lastRead, { backgroundColor: colors.surface, borderColor: colors.accent + '40' }]}>
        <Ionicons name="bookmark" size={20} color={colors.accent} />
        <View style={styles.lastReadText}>
          <Text style={[styles.lastReadLabel, { color: colors.textSecondary }]}>114 Surahs with Audio</Text>
          <Text style={[styles.lastReadSurah, { color: colors.text }]}>
            Arabic + Bangla + English · Word-by-word meaning
          </Text>
        </View>
        <Pressable onPress={() => router.push('/quran/1')}>
          <Ionicons name="play-circle" size={32} color={colors.primary} />
        </Pressable>
      </View>
    </>
  ), [search, activeReciter.name, quranSettings.scriptType, quranSettings.fontStyle, colors]);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <Header
        title="Al-Quran"
        subtitle="পবিত্র কুরআন শরীফ"
        rightAction={
          <Pressable
            style={styles.headerBtn}
            onPress={() => setShowSettings(true)}
            hitSlop={8}
          >
            <Ionicons name="options-outline" size={22} color={Theme.colors.textLight} />
          </Pressable>
        }
      />

      {loading ? (
        <LoadingState message="Loading all 114 surahs..." />
      ) : error ? (
        <ErrorState title="Could not load Quran" message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderSurahItem}
          ListHeaderComponent={ListHeader}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

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
  },
  headerBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  listContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  quickLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.sm,
    borderWidth: 1,
  },
  quickLinkText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
  },
  reciterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
  },
  reciterBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reciterBannerInfo: {
    flex: 1,
  },
  reciterBannerTitle: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
  },
  reciterBannerSub: {
    fontSize: Theme.fontSize.xs,
    marginTop: 2,
  },
  lastRead: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    gap: Theme.spacing.sm,
  },
  lastReadText: {
    flex: 1,
  },
  lastReadLabel: {
    fontSize: Theme.fontSize.xs,
  },
  lastReadSurah: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  numberText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
  },
  surahInfo: {
    flex: 1,
  },
  nameEnglish: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
  nameBangla: {
    fontSize: Theme.fontSize.sm,
  },
  meta: {
    fontSize: Theme.fontSize.xs,
    marginTop: 2,
  },
  nameArabic: {
    fontSize: Theme.fontSize.arabic,
    fontWeight: '600',
  },
});
