import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Theme } from '@/constants/Theme';
import { useHifz } from '@/hooks/useHifz';
import { useQuranChapters } from '@/hooks/useQuran';

export default function HifzScreen() {
  const [search, setSearch] = useState('');
  const { chapters, loading, error, reload } = useQuranChapters();
  const { getSurahProgress, getTotalMemorized } = useHifz();

  const totalMemorized = getTotalMemorized();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (chapter) =>
        chapter.nameSimple.toLowerCase().includes(q) ||
        chapter.nameBangla.includes(search) ||
        String(chapter.id).includes(q)
    );
  }, [chapters, search]);

  return (
    <View style={styles.wrapper}>
      <Header title="Hifz" subtitle="কুরআন হিফজ · তিলাওয়াত" showBack />
      <ScreenContainer>
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryTitle}>Memorization Progress</Text>
            <Text style={styles.summaryBn}>হিফজের অগ্রগতি</Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryCount}>{totalMemorized}</Text>
            <Text style={styles.summaryLabel}>ayahs</Text>
          </View>
        </View>

        <SectionHeading
          title="Practice by Surah"
          subtitle="সূরা ভিত্তিক হিফজ ও তিলাওয়াত"
        />

        <SearchBar value={search} onChangeText={setSearch} placeholder="Search surah..." />

        {loading ? (
          <LoadingState message="Loading surahs..." />
        ) : error ? (
          <ErrorState title="Could not load surahs" message={error} onRetry={reload} />
        ) : (
          filtered.map((chapter) => {
            const stats = getSurahProgress(chapter.id, chapter.versesCount);
            return (
              <Pressable
                key={chapter.id}
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                onPress={() => router.push(`/quran/${chapter.id}?mode=hifz`)}
              >
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{chapter.id}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.nameEn}>{chapter.nameSimple}</Text>
                  <Text style={styles.nameBn}>{chapter.nameBangla}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${stats.percent}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                      {stats.memorized}/{stats.total}
                    </Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Ionicons name="headset" size={18} color={Theme.colors.primary} />
                  <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
                </View>
              </Pressable>
            );
          })
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
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  summaryBn: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  summaryBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  summaryCount: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Theme.colors.accentLight,
  },
  summaryLabel: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  numberText: {
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  info: {
    flex: 1,
  },
  nameEn: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  nameBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.full,
  },
  progressText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  actions: {
    alignItems: 'center',
    gap: 6,
    marginLeft: Theme.spacing.sm,
  },
});
