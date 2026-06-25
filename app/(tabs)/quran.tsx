import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { Theme } from '@/constants/Theme';
import { useQuranChapters } from '@/hooks/useQuran';

export default function QuranScreen() {
  const [search, setSearch] = useState('');
  const { chapters, loading, error, reload } = useQuranChapters();

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

  return (
    <View style={styles.wrapper}>
      <Header title="Al-Quran" subtitle="পবিত্র কুরআন শরীফ" />
      <ScreenContainer>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search surah..."
        />

        {loading ? (
          <LoadingState message="Loading all 114 surahs..." />
        ) : error ? (
          <ErrorState title="Could not load Quran" message={error} onRetry={reload} />
        ) : (
          <>
            <View style={styles.quickLinks}>
              <Pressable
                style={styles.quickLink}
                onPress={() => router.push('/features/nurani-qaida' as never)}
              >
                <Ionicons name="school-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.quickLinkText}>নূরানী</Text>
              </Pressable>
              <Pressable style={styles.quickLink} onPress={() => router.push('/features/hifz' as never)}>
                <Ionicons name="ribbon-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.quickLinkText}>Hifz</Text>
              </Pressable>
              <Pressable style={styles.quickLink} onPress={() => router.push('/quran/1')}>
                <Ionicons name="play-circle-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.quickLinkText}>Recite</Text>
              </Pressable>
            </View>

            <View style={styles.lastRead}>
              <Ionicons name="bookmark" size={20} color={Theme.colors.accent} />
              <View style={styles.lastReadText}>
                <Text style={styles.lastReadLabel}>114 Surahs with Audio</Text>
                <Text style={styles.lastReadSurah}>
                  Arabic + Bangla + English · Tap words to listen
                </Text>
              </View>
              <Pressable onPress={() => router.push('/quran/1')}>
                <Ionicons name="headset" size={32} color={Theme.colors.primary} />
              </Pressable>
            </View>

            {filtered.map((surah) => (
              <Pressable
                key={surah.id}
                style={({ pressed }) => [styles.surahCard, pressed && styles.pressed]}
                onPress={() => router.push(`/quran/${surah.id}`)}
              >
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{surah.id}</Text>
                </View>
                <View style={styles.surahInfo}>
                  <Text style={styles.nameEnglish}>{surah.nameSimple}</Text>
                  <Text style={styles.nameBangla}>{surah.nameBangla}</Text>
                  <Text style={styles.meta}>
                    {surah.versesCount} verses · {surah.revelationPlace}
                  </Text>
                </View>
                <Text style={styles.nameArabic}>{surah.nameArabic}</Text>
              </Pressable>
            ))}
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
  lastRead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.accent + '40',
    gap: Theme.spacing.sm,
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
    backgroundColor: Theme.colors.primary + '10',
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '25',
  },
  quickLinkText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  lastReadText: {
    flex: 1,
  },
  lastReadLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  lastReadSurah: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  surahCard: {
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
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  numberText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  surahInfo: {
    flex: 1,
  },
  nameEnglish: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  nameBangla: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  meta: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  nameArabic: {
    fontSize: Theme.fontSize.arabic,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});
