import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { RecitationButton } from '@/components/ui/RecitationButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Theme } from '@/constants/Theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useDuaSearch, useDuas } from '@/hooks/useDua';

type ViewMode = 'chapters' | 'duas';

export default function DuaScreen() {
  const [view, setView] = useState<ViewMode>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { duas, chaptersWithCount, loading, error, reload } = useDuas();
  const { results: searchResults, loading: searching } = useDuaSearch(search);
  const { activeId, isPlaying, isLoading, playUrl } = useAudioPlayer();

  const selectedChapter = chaptersWithCount.find((chapter) => chapter.id === selectedChapterId);
  const isSearching = search.trim().length >= 2;

  const chapterDuas = useMemo(() => {
    if (!selectedChapterId) return [];
    return duas.filter((dua) => dua.chapterId === selectedChapterId);
  }, [duas, selectedChapterId]);

  const displayItems = useMemo(() => {
    if (isSearching) return searchResults;
    return chapterDuas;
  }, [isSearching, searchResults, chapterDuas]);

  const goBack = () => {
    if (view === 'duas') {
      setView('chapters');
      setSelectedChapterId(null);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header
        title="Dua & Azkar"
        subtitle={
          view === 'duas' && selectedChapter
            ? selectedChapter.titleBn
            : 'দোয়া ও যিকির (Hisn al-Muslim)'
        }
        showBack
        onBack={view === 'chapters' ? undefined : goBack}
      />
      <ScreenContainer>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search dua..." />

        {loading ? (
          <LoadingState message="Loading Hisn al-Muslim chapters..." />
        ) : error ? (
          <ErrorState title="Could not load duas" message={error} onRetry={reload} />
        ) : (
          <>
            {view === 'chapters' && !isSearching && (
              <>
                <SectionHeading
                  title="Select Chapter"
                  subtitle="অধ্যায় নির্বাচন করুন"
                />
                {chaptersWithCount.map((chapter) => (
                  <Pressable
                    key={chapter.id}
                    style={styles.chapterCard}
                    onPress={() => {
                      setSelectedChapterId(chapter.id);
                      setView('duas');
                    }}
                  >
                    <View style={styles.chapterBadge}>
                      <Text style={styles.chapterBadgeText}>{chapter.number}</Text>
                    </View>
                    <View style={styles.chapterInfo}>
                      <Text style={styles.chapterName}>{chapter.titleBn}</Text>
                      <Text style={styles.chapterEn}>{chapter.titleEn}</Text>
                      <Text style={styles.chapterMeta}>
                        {chapter.duaCount} {chapter.duaCount === 1 ? 'dua' : 'duas'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
                  </Pressable>
                ))}
              </>
            )}

            {(view === 'duas' || isSearching) && (
              <>
                {searching ? (
                  <LoadingState message="Searching..." />
                ) : (
                  <>
                    <Text style={styles.countLabel}>
                      {isSearching
                        ? `${displayItems.length} results`
                        : `${displayItems.length} duas in ${selectedChapter?.titleBn}`}
                    </Text>

                    {displayItems.map((dua) => (
                      <View key={dua.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <View style={styles.cardHeaderText}>
                            {isSearching ? (
                              <>
                                <Text style={styles.title}>{dua.titleBn}</Text>
                                <Text style={styles.titleEn}>{dua.title}</Text>
                              </>
                            ) : (
                              <Text style={styles.duaNumber}>Dua #{dua.number}</Text>
                            )}
                          </View>
                          {dua.audioUrl ? (
                            <RecitationButton
                              id={`dua-${dua.id}`}
                              activeId={activeId}
                              isPlaying={isPlaying}
                              isLoading={isLoading}
                              onPress={() => playUrl(`dua-${dua.id}`, dua.audioUrl)}
                              label="শুনুন"
                            />
                          ) : null}
                        </View>
                        <Text style={styles.arabic}>{dua.arabic}</Text>
                        {dua.transliteration ? (
                          <Text style={styles.transliteration}>{dua.transliteration}</Text>
                        ) : null}
                        <Text style={styles.english}>{dua.english}</Text>
                        {dua.repeat > 1 ? (
                          <Text style={styles.ref}>🔁 Repeat {dua.repeat} times</Text>
                        ) : null}
                      </View>
                    ))}

                    {displayItems.length === 0 ? (
                      <Text style={styles.emptyText}>No duas found.</Text>
                    ) : null}
                  </>
                )}
              </>
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
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  chapterBadge: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  chapterBadgeText: {
    fontWeight: '700',
    color: Theme.colors.primary,
    fontSize: Theme.fontSize.sm,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  chapterEn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text,
    marginTop: 2,
  },
  chapterMeta: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  countLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  titleEn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  duaNumber: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  arabic: {
    fontSize: Theme.fontSize.arabicLarge,
    color: Theme.colors.text,
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: Theme.spacing.sm,
  },
  transliteration: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accent,
    fontStyle: 'italic',
    marginBottom: Theme.spacing.sm,
  },
  english: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  ref: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.md,
    marginTop: Theme.spacing.lg,
  },
});
