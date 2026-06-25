import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useAppTheme } from '@/context/AppThemeContext';
import { Theme } from '@/constants/Theme';
import { useChapterTafsir, useTafsirList } from '@/hooks/useTafsir';
import { useQuranChapter } from '@/hooks/useQuran';
import { useLabels } from '@/utils/labels';
import { shadowStyle } from '@/utils/shadow';

function truncate(text: string, max = 100): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

const LANG_LABELS: Record<string, string> = {
  bengali: 'বাংলা',
  english: 'English',
  arabic: 'العربية',
  urdu: 'اردو',
};

export default function TafsirScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = parseInt(id ?? '1', 10);
  const { chapter, loading: loadingChapter } = useQuranChapter(surahNumber);
  const { tafsirs, loading: loadingTafsirs, error: tafsirListError } = useTafsirList();
  const [selectedTafsirId, setSelectedTafsirId] = useState<number | null>(null);
  const [expandedVerses, setExpandedVerses] = useState<Set<number>>(() => new Set([1]));
  const [showPicker, setShowPicker] = useState(false);
  const { colors } = useAppTheme();
  const { t, isBn } = useLabels();

  const activeTafsirId =
    selectedTafsirId ?? tafsirs.find((item) => item.language === 'bengali')?.id ?? tafsirs[0]?.id ?? null;

  const activeTafsir = tafsirs.find((item) => item.id === activeTafsirId);

  const { entries, loading: loadingTafsir, error: tafsirError, reload } = useChapterTafsir(
    surahNumber,
    chapter?.versesCount ?? 0,
    activeTafsirId
  );

  const groupedByLanguage = useMemo(() => {
    const groups = new Map<string, typeof tafsirs>();
    tafsirs.forEach((item) => {
      const list = groups.get(item.language) ?? [];
      list.push(item);
      groups.set(item.language, list);
    });
    return Array.from(groups.entries());
  }, [tafsirs]);

  const allExpanded = entries.length > 0 && expandedVerses.size === entries.length;

  const toggleVerse = (verseNumber: number) => {
    setExpandedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(verseNumber)) next.delete(verseNumber);
      else next.add(verseNumber);
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedVerses(new Set());
      return;
    }
    setExpandedVerses(new Set(entries.map((e) => e.verseNumber)));
  };

  const surahTitle = chapter?.nameSimple ?? `Surah ${surahNumber}`;
  const surahSubtitle = isBn ? chapter?.nameBangla : chapter?.nameEnglish;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <Header title={t('tafsir')} subtitle={surahTitle} showBack />
      <ScreenContainer>
        {loadingTafsirs || loadingChapter ? (
          <LoadingState message={t('loadingTafsir')} />
        ) : tafsirListError ? (
          <ErrorState title="Could not load tafsirs" message={tafsirListError} />
        ) : (
          <>
            <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
              <Text style={[styles.surahArabic, { color: colors.primary }]}>{chapter?.nameArabic}</Text>
              <Text style={[styles.surahName, { color: colors.text }]}>{surahTitle}</Text>
              {surahSubtitle ? (
                <Text style={[styles.surahBn, { color: colors.textSecondary }]}>{surahSubtitle}</Text>
              ) : null}
              <View style={styles.heroMeta}>
                <View style={[styles.metaPill, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {chapter?.versesCount ?? 0} {t('verses')}
                  </Text>
                </View>
                {activeTafsir ? (
                  <View style={[styles.metaPill, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.metaText, { color: colors.primary }]} numberOfLines={1}>
                      {activeTafsir.name}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <Pressable
              style={[styles.pickerBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setShowPicker((v) => !v)}
            >
              <Ionicons name="library-outline" size={18} color={colors.primary} />
              <Text style={[styles.pickerBtnText, { color: colors.text }]}>
                {activeTafsir?.name ?? t('selectTafsir')}
              </Text>
              <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
            </Pressable>

            {showPicker ? (
              <View style={[styles.pickerPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.pickerLabel, { color: colors.textSecondary }]}>
                  {t('selectTafsir')} ({tafsirs.length})
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langScroll}>
                  {groupedByLanguage.map(([lang, items]) => (
                    <View key={lang} style={styles.langBlock}>
                      <Text style={[styles.langTitle, { color: colors.textSecondary }]}>
                        {LANG_LABELS[lang] ?? lang}
                      </Text>
                      <View style={styles.chipRow}>
                        {items.map((item) => {
                          const active = activeTafsirId === item.id;
                          return (
                            <Pressable
                              key={item.id}
                              style={[
                                styles.chip,
                                { borderColor: colors.border, backgroundColor: colors.muted },
                                active && { backgroundColor: colors.primary, borderColor: colors.primary },
                              ]}
                              onPress={() => {
                                setSelectedTafsirId(item.id);
                                setExpandedVerses(new Set([1]));
                                setShowPicker(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.chipText,
                                  { color: colors.text },
                                  active && { color: colors.textLight, fontWeight: '700' },
                                ]}
                                numberOfLines={2}
                              >
                                {item.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {loadingTafsir ? (
              <LoadingState message={t('loadingTafsir')} />
            ) : tafsirError ? (
              <ErrorState title="Could not load tafsir" message={tafsirError} onRetry={reload} />
            ) : (
              <>
                <View style={styles.toolbar}>
                  <Text style={[styles.toolbarText, { color: colors.textSecondary }]}>
                    {entries.length} {t('ayah')}
                  </Text>
                  <Pressable onPress={toggleAll}>
                    <Text style={[styles.toolbarAction, { color: colors.primary }]}>
                      {allExpanded ? t('collapseAll') : t('expandAll')}
                    </Text>
                  </Pressable>
                </View>

                {entries.map((entry) => {
                  const expanded = expandedVerses.has(entry.verseNumber);
                  const hasText = Boolean(entry.text?.trim());
                  return (
                    <View
                      key={entry.verseNumber}
                      style={[
                        styles.verseCard,
                        { backgroundColor: colors.surface, borderColor: expanded ? colors.primary + '50' : colors.border },
                        expanded && { borderLeftWidth: 3, borderLeftColor: colors.primary },
                        cardShadow(colors),
                      ]}
                    >
                      <Pressable style={styles.verseHeader} onPress={() => toggleVerse(entry.verseNumber)}>
                        <View style={[styles.ayahBadge, { backgroundColor: colors.primary }]}>
                          <Text style={styles.ayahNumber}>{entry.verseNumber}</Text>
                        </View>
                        <View style={styles.verseHeaderText}>
                          <Text style={[styles.verseKey, { color: colors.primary }]}>
                            {t('ayah')} {surahNumber}:{entry.verseNumber}
                          </Text>
                          {!expanded && hasText ? (
                            <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={2}>
                              {truncate(entry.text, 120)}
                            </Text>
                          ) : null}
                        </View>
                        <Ionicons
                          name={expanded ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </Pressable>
                      {expanded ? (
                        <View style={[styles.verseBody, { borderTopColor: colors.border }]}>
                          {hasText ? (
                            <Text style={[styles.tafsirText, { color: colors.tafsirBody }]}>{entry.text}</Text>
                          ) : (
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('noTafsir')}</Text>
                          )}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </>
            )}

            <Pressable
              style={[styles.readBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push(`/quran/${surahNumber}`)}
            >
              <Ionicons name="book-outline" size={18} color={colors.textLight} />
              <Text style={styles.readBtnText}>{t('readSurah')}</Text>
            </Pressable>
          </>
        )}
      </ScreenContainer>
    </View>
  );
}

function cardShadow(colors: { cardShadow: string }) {
  return shadowStyle({ color: colors.cardShadow, offset: { width: 0, height: 2 }, radius: 6, elevation: 2 });
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  heroCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  surahArabic: {
    fontSize: Theme.fontSize.arabicLarge,
    fontWeight: '700',
    marginBottom: Theme.spacing.xs,
  },
  surahName: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
  },
  surahBn: {
    fontSize: Theme.fontSize.md,
    marginTop: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
    justifyContent: 'center',
  },
  metaPill: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    maxWidth: '90%',
  },
  metaText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: Theme.spacing.sm,
  },
  pickerBtnText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
  pickerPanel: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  pickerLabel: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
    marginBottom: Theme.spacing.sm,
    letterSpacing: 0.5,
  },
  langScroll: { marginHorizontal: -4 },
  langBlock: { marginRight: Theme.spacing.lg, maxWidth: 280 },
  langTitle: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
    marginBottom: Theme.spacing.xs,
    textTransform: 'capitalize',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Theme.spacing.sm },
  chip: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    maxWidth: 240,
  },
  chipText: { fontSize: Theme.fontSize.sm, lineHeight: 18 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: 2,
  },
  toolbarText: { fontSize: Theme.fontSize.sm, fontWeight: '600' },
  toolbarAction: { fontSize: Theme.fontSize.sm, fontWeight: '700' },
  verseCard: {
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  ayahBadge: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumber: { color: '#FFF', fontSize: Theme.fontSize.sm, fontWeight: '700' },
  verseHeaderText: { flex: 1 },
  verseKey: { fontSize: Theme.fontSize.sm, fontWeight: '700' },
  preview: { fontSize: Theme.fontSize.sm, marginTop: 4, lineHeight: 20 },
  verseBody: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
  },
  tafsirText: {
    fontSize: Theme.fontSize.tafsir,
    lineHeight: Theme.fontSize.tafsirLine,
    letterSpacing: 0.15,
  },
  emptyText: {
    fontSize: Theme.fontSize.sm,
    fontStyle: 'italic',
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  readBtnText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: '#FFF',
  },
});
