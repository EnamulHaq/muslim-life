import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { RecitationButton } from '@/components/ui/RecitationButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HADITH_BANGLA_SUPPORTED } from '@/constants/banglaSources';
import { Theme } from '@/constants/Theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import {
  useHadithBooks,
  useHadithCollections,
  useHadithList,
  useHadithSearch,
} from '@/hooks/useHadith';

type ViewMode = 'collections' | 'books' | 'hadiths';

export default function HadithScreen() {
  const [view, setView] = useState<ViewMode>('collections');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedBookName, setSelectedBookName] = useState('');
  const [search, setSearch] = useState('');

  const { collections, loading: loadingCollections, error, reload } = useHadithCollections();
  const { books, loading: loadingBooks } = useHadithBooks(selectedCollection);
  const { items, loading: loadingHadiths, loadingMore, hasMore, total, loadMore } =
    useHadithList(selectedCollection, selectedBook);
  const { results: searchResults, loading: searching } = useHadithSearch(
    search,
    selectedCollection
  );
  const { activeId, isPlaying, isLoading, speakArabic } = useAudioPlayer();

  const activeCollection = collections.find((c) => c.slug === selectedCollection);

  const displayItems = useMemo(() => {
    if (search.trim().length >= 2) return searchResults;
    return items;
  }, [search, searchResults, items]);

  const goBack = () => {
    if (view === 'hadiths') {
      setView('books');
      setSelectedBook(null);
      return;
    }
    if (view === 'books') {
      setView('collections');
      setSelectedCollection(null);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header
        title="Hadith"
        subtitle={
          view === 'hadiths'
            ? selectedBookName
            : view === 'books'
              ? activeCollection?.nameBn
              : 'হাদিস শরীফ'
        }
        showBack
        onBack={view === 'collections' ? undefined : goBack}
      />
      <ScreenContainer>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search hadith..."
        />

        {loadingCollections ? (
          <LoadingState message="Loading hadith collections..." />
        ) : error ? (
          <ErrorState title="Could not load hadith" message={error} onRetry={reload} />
        ) : (
          <>
            {view === 'collections' && (
              <>
                <SectionHeading
                  title="Select Collection"
                  subtitle="হাদিস গ্রন্থ নির্বাচন করুন"
                />
                {collections.map((collection) => (
                  <Pressable
                    key={collection.slug}
                    style={styles.collectionCard}
                    onPress={() => {
                      setSelectedCollection(collection.slug);
                      setView('books');
                    }}
                  >
                    <View style={styles.collectionInfo}>
                      <Text style={styles.collectionName}>{collection.nameBn}</Text>
                      <Text style={styles.collectionEn}>{collection.nameEn}</Text>
                      <Text style={styles.collectionMeta}>
                        {collection.total.toLocaleString()} hadiths
                        {HADITH_BANGLA_SUPPORTED.has(collection.slug) ? ' · বাংলা' : ''}
                      </Text>
                    </View>
                    <Text style={styles.collectionArabic}>{collection.nameAr}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Theme.colors.textSecondary} />
                  </Pressable>
                ))}
              </>
            )}

            {view === 'books' && (
              <>
                {loadingBooks ? (
                  <LoadingState message="Loading books..." />
                ) : (
                  books.map((book) => (
                    <Pressable
                      key={book.bookNumber}
                      style={styles.bookCard}
                      onPress={() => {
                        setSelectedBook(book.bookNumber);
                        setSelectedBookName(book.nameEn);
                        setView('hadiths');
                      }}
                    >
                      <View style={styles.bookBadge}>
                        <Text style={styles.bookBadgeText}>{book.bookNumber}</Text>
                      </View>
                      <View style={styles.bookInfo}>
                        <Text style={styles.bookName}>{book.nameEn}</Text>
                        <Text style={styles.bookMeta}>{book.hadithCount} hadiths</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
                    </Pressable>
                  ))
                )}
              </>
            )}

            {view === 'hadiths' && (
              <>
                {search.trim().length < 2 && loadingHadiths ? (
                  <LoadingState message="Loading hadiths..." />
                ) : searching ? (
                  <LoadingState message="Searching..." />
                ) : (
                  <>
                    {search.trim().length < 2 && (
                      <Text style={styles.countLabel}>
                        Showing {displayItems.length} of {total.toLocaleString()} hadiths
                      </Text>
                    )}

                    {displayItems.map((hadith) => (
                      <View key={hadith.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.book}>{activeCollection?.nameBn}</Text>
                          <View style={styles.cardHeaderRight}>
                            <RecitationButton
                              id={`hadith-${hadith.id}`}
                              activeId={activeId}
                              isPlaying={isPlaying}
                              isLoading={isLoading}
                              onPress={() => speakArabic(`hadith-${hadith.id}`, hadith.arabic)}
                              label="শুনুন"
                            />
                            <Text style={styles.ref}>#{hadith.hadithNumber}</Text>
                          </View>
                        </View>
                        <Text style={styles.chapter}>{hadith.chapterTitle}</Text>
                        <Text style={styles.arabic}>{hadith.arabic}</Text>
                        {hadith.bangla ? <Text style={styles.bangla}>{hadith.bangla}</Text> : null}
                        <Text style={styles.english}>{hadith.english}</Text>
                        {hadith.grade ? (
                          <Text style={styles.grade}>{hadith.grade}</Text>
                        ) : null}
                      </View>
                    ))}

                    {search.trim().length < 2 && hasMore && (
                      <Pressable
                        style={styles.loadMore}
                        onPress={loadMore}
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <ActivityIndicator color={Theme.colors.primary} />
                        ) : (
                          <Text style={styles.loadMoreText}>Load More Hadiths</Text>
                        )}
                      </Pressable>
                    )}
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
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.sm,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  collectionEn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text,
  },
  collectionMeta: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  collectionArabic: {
    fontSize: Theme.fontSize.arabic,
    color: Theme.colors.primary,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  bookBadge: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  bookBadgeText: {
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  bookMeta: {
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
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  book: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  ref: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  chapter: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.accent,
    marginBottom: Theme.spacing.sm,
  },
  arabic: {
    fontSize: Theme.fontSize.arabic,
    color: Theme.colors.text,
    textAlign: 'right',
    lineHeight: 32,
    marginBottom: Theme.spacing.sm,
  },
  bangla: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 26,
    marginBottom: Theme.spacing.sm,
  },
  english: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 24,
  },
  grade: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.success,
    fontWeight: '700',
    marginTop: Theme.spacing.sm,
  },
  loadMore: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  loadMoreText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});
