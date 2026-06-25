import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NURANI_LESSONS } from '@/data/nuraniQaida';
import { Theme } from '@/constants/Theme';
import { useNuraniProgress } from '@/hooks/useNuraniProgress';

export default function NuraniQaidaScreen() {
  const { progressPercent, completedLessons, lastLessonId, isLessonComplete } = useNuraniProgress();

  const continueLesson = lastLessonId
    ? NURANI_LESSONS.find((l) => l.id === lastLessonId)
    : NURANI_LESSONS[0];

  return (
    <View style={styles.wrapper}>
      <Header title="Nurani Qaida" subtitle="নূরানী পদ্ধতিতে কুরআন শিক্ষা" showBack />
      <ScreenContainer>
        <View style={styles.hero}>
          <Ionicons name="school" size={36} color={Theme.colors.textLight} />
          <Text style={styles.heroTitle}>নূরানী কায়দা</Text>
          <Text style={styles.heroSubtitle}>
            হরফ থেকে আম পারা — ধাপে ধাপে কুরআন পড়া শিখুন
          </Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedLessons.length}/{NURANI_LESSONS.length} · {progressPercent}%
            </Text>
          </View>
        </View>

        {continueLesson ? (
          <Pressable
            style={styles.continueCard}
            onPress={() => router.push(`/features/nurani-qaida/${continueLesson.id}`)}
          >
            <Ionicons name="play-circle" size={28} color={Theme.colors.primary} />
            <View style={styles.continueText}>
              <Text style={styles.continueLabel}>চালিয়ে যান</Text>
              <Text style={styles.continueTitle}>{continueLesson.titleBn}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.textSecondary} />
          </Pressable>
        ) : null}

        <SectionHeading title="Lessons" subtitle={`${NURANI_LESSONS.length}টি পাঠ`} />

        {NURANI_LESSONS.map((lesson) => {
          const done = isLessonComplete(lesson.id);
          return (
            <Pressable
              key={lesson.id}
              style={[styles.lessonCard, done && styles.lessonDone]}
              onPress={() => router.push(`/features/nurani-qaida/${lesson.id}`)}
            >
              <View style={[styles.lessonBadge, done && styles.lessonBadgeDone]}>
                {done ? (
                  <Ionicons name="checkmark" size={16} color={Theme.colors.textLight} />
                ) : (
                  <Text style={styles.lessonNumber}>{lesson.id}</Text>
                )}
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.titleBn}</Text>
                <Text style={styles.lessonEn}>{lesson.titleEn}</Text>
                <Text style={styles.lessonMeta}>{lesson.items.length}টি অনুশীলন</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
            </Pressable>
          );
        })}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Theme.colors.background },
  hero: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.xs,
  },
  heroTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  heroSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accentLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressRow: { width: '100%', marginTop: Theme.spacing.md, gap: 6 },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.borderRadius.full,
  },
  progressText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.accentLight,
    textAlign: 'center',
    fontWeight: '600',
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '40',
  },
  continueText: { flex: 1 },
  continueLabel: { fontSize: Theme.fontSize.xs, color: Theme.colors.primary, fontWeight: '700' },
  continueTitle: { fontSize: Theme.fontSize.md, fontWeight: '600', color: Theme.colors.text },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.sm,
  },
  lessonDone: {
    borderColor: Theme.colors.success + '50',
    backgroundColor: Theme.colors.success + '06',
  },
  lessonBadge: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBadgeDone: { backgroundColor: Theme.colors.success },
  lessonNumber: { fontWeight: '700', color: Theme.colors.primary, fontSize: Theme.fontSize.sm },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: Theme.fontSize.md, fontWeight: '700', color: Theme.colors.text },
  lessonEn: { fontSize: Theme.fontSize.xs, color: Theme.colors.textSecondary },
  lessonMeta: { fontSize: Theme.fontSize.xs, color: Theme.colors.primary, marginTop: 2 },
});
