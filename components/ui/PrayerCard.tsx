import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/Theme';
import { formatTime, PrayerTime } from '@/utils/prayerTimes';
import { shadowStyle } from '@/utils/shadow';

type Props = {
  prayer: PrayerTime;
  isActive?: boolean;
  isNext?: boolean;
};

export function PrayerCard({ prayer, isActive, isNext }: Props) {
  return (
    <View
      style={[
        styles.card,
        isActive && styles.active,
        isNext && styles.next,
        { borderLeftColor: prayer.color },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.name, isActive && styles.nameActive]}>{prayer.label}</Text>
        <Text style={[styles.nameBn, isActive && styles.nameBnActive]}>{prayer.labelBn}</Text>
      </View>
      <Text style={[styles.time, isActive && styles.timeActive]}>{formatTime(prayer.time)}</Text>
      {isNext && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Next</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 4,
    ...shadowStyle({
      color: Theme.colors.cardShadow,
      offset: { width: 0, height: 2 },
      radius: 6,
      elevation: 2,
    }),
  },
  active: {
    backgroundColor: Theme.colors.primary,
  },
  next: {
    borderWidth: 1,
    borderColor: Theme.colors.accent,
    borderLeftWidth: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  nameActive: {
    color: Theme.colors.textLight,
  },
  nameBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 1,
  },
  nameBnActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  time: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  timeActive: {
    color: Theme.colors.accentLight,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
});
