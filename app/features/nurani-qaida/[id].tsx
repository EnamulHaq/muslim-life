import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '@/components/ui/ErrorState';
import { Header } from '@/components/ui/Header';
import { RecitationButton } from '@/components/ui/RecitationButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { getNuraniLesson } from '@/data/nuraniQaida';
import { Theme } from '@/constants/Theme';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useNuraniProgress } from '@/hooks/useNuraniProgress';

export default function NuraniLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = parseInt(id ?? '1', 10);
  const lesson = getNuraniLesson(lessonId);
  const [itemIndex, setItemIndex] = useState(0);
  const { activeId, isPlaying, isLoading, speakArabic } = useAudioPlayer();
  const { markLessonComplete, setLastLesson, isLessonComplete } = useNuraniProgress();

  useEffect(() => {
    if (lesson) setLastLesson(lesson.id);
  }, [lesson, setLastLesson]);

  if (!lesson) {
    return (
      <View style={styles.wrapper}>
        <Header title="Lesson" showBack />
        <ErrorState title="Lesson not found" message="This lesson does not exist." />
      </View>
    );
  }

  const item = lesson.items[itemIndex];
  const isLast = itemIndex === lesson.items.length - 1;
  const isFirst = itemIndex === 0;
  const speakId = `nurani-${lesson.id}-${item.id}`;

  const goNext = () => {
    if (isLast) {
      markLessonComplete(lesson.id);
      const nextLesson = getNuraniLesson(lesson.id + 1);
      if (nextLesson) {
        router.replace(`/features/nurani-qaida/${nextLesson.id}`);
      } else {
        router.back();
      }
      return;
    }
    setItemIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (!isFirst) setItemIndex((i) => i - 1);
  };

  return (
    <View style={styles.wrapper}>
      <Header
        title={`Lesson ${lesson.id}`}
        subtitle={lesson.titleBn}
        showBack
      />
      <ScreenContainer scroll={false} contentStyle={styles.content}>
        <Text style={styles.description}>{lesson.descriptionBn}</Text>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {itemIndex + 1} / {lesson.items.length}
          </Text>
          {isLessonComplete(lesson.id) ? (
            <View style={styles.doneBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Theme.colors.success} />
              <Text style={styles.doneText}>সম্পন্ন</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.arabic}>{item.arabic}</Text>
          <Text style={styles.translit}>{item.transliteration}</Text>
          <Text style={styles.nameBn}>{item.nameBn}</Text>
          {item.noteBn ? <Text style={styles.note}>{item.noteBn}</Text> : null}

          <RecitationButton
            id={speakId}
            activeId={activeId}
            isPlaying={isPlaying}
            isLoading={isLoading}
            onPress={() => speakArabic(speakId, item.arabic)}
            label="শুনুন"
            size="md"
          />
        </View>

        <View style={styles.dots}>
          {lesson.items.map((_, i) => (
            <Pressable key={i} onPress={() => setItemIndex(i)}>
              <View style={[styles.dot, i === itemIndex && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <View style={styles.nav}>
          <Pressable
            style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
            onPress={goPrev}
            disabled={isFirst}
          >
            <Ionicons name="chevron-back" size={20} color={Theme.colors.primary} />
            <Text style={styles.navBtnText}>আগে</Text>
          </Pressable>

          <Pressable style={styles.navBtnPrimary} onPress={goNext}>
            <Text style={styles.navBtnPrimaryText}>
              {isLast ? (lesson.id < 15 ? 'পরের পাঠ' : 'শেষ করুন') : 'পরেরটি'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textLight} />
          </Pressable>
        </View>

        <View style={styles.itemList}>
          {lesson.items.map((it, i) => (
            <Pressable
              key={it.id}
              style={[styles.itemChip, i === itemIndex && styles.itemChipActive]}
              onPress={() => setItemIndex(i)}
            >
              <Text style={[styles.itemChipArabic, i === itemIndex && styles.itemChipArabicActive]}>
                {it.arabic}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Theme.colors.background },
  content: { flexGrow: 1 },
  description: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  counter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  counterText: { fontSize: Theme.fontSize.sm, fontWeight: '700', color: Theme.colors.primary },
  doneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  doneText: { fontSize: Theme.fontSize.xs, color: Theme.colors.success, fontWeight: '600' },
  card: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.md,
    minHeight: 280,
  },
  arabic: {
    fontSize: 56,
    color: Theme.colors.text,
    textAlign: 'center',
    lineHeight: 72,
  },
  translit: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.accent,
    fontStyle: 'italic',
  },
  nameBn: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.primary,
    textAlign: 'center',
  },
  note: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Theme.spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: Theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.border,
  },
  dotActive: { backgroundColor: Theme.colors.primary, width: 20 },
  nav: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: Theme.fontSize.md, fontWeight: '600', color: Theme.colors.primary },
  navBtnPrimary: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
  },
  navBtnPrimaryText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  itemList: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    paddingBottom: Theme.spacing.lg,
  },
  itemChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  itemChipActive: {
    backgroundColor: Theme.colors.primary + '15',
    borderColor: Theme.colors.primary,
  },
  itemChipArabic: { fontSize: Theme.fontSize.arabic, color: Theme.colors.text },
  itemChipArabicActive: { color: Theme.colors.primary, fontWeight: '700' },
});
