import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { formatTime, PrayerTime } from '@/utils/prayerTimes';
import { shadowStyle } from '@/utils/shadow';
import { PrayerAlertMode } from '@/hooks/useAppSettings';

type Props = {
  prayer: PrayerTime;
  isActive?: boolean;
  isNext?: boolean;
  alarmMode?: PrayerAlertMode;
  offsetMinutes?: number;
  onAlarmPress?: () => void;
};

export function PrayerCard({
  prayer,
  isActive,
  isNext,
  alarmMode = 'adhan',
  offsetMinutes = 0,
  onAlarmPress,
}: Props) {
  const isAlarmOn = alarmMode !== 'off';

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
        <View style={styles.nameRow}>
          <Text style={[styles.name, isActive && styles.nameActive]}>{prayer.label}</Text>
          {isNext && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Next</Text>
            </View>
          )}
        </View>
        <Text style={[styles.nameBn, isActive && styles.nameBnActive]}>{prayer.labelBn}</Text>
        {offsetMinutes > 0 && isAlarmOn && (
          <Text style={[styles.offsetTag, isActive && { color: Theme.colors.accentLight }]}>
            🔔 Alert: {offsetMinutes}m before
          </Text>
        )}
      </View>

      <Text style={[styles.time, isActive && styles.timeActive]}>{formatTime(prayer.time)}</Text>

      {onAlarmPress && (
        <Pressable
          style={({ pressed }) => [
            styles.alarmBtn,
            isAlarmOn ? (isActive ? styles.alarmBtnActiveOn : styles.alarmBtnOn) : styles.alarmBtnOff,
            pressed && { opacity: 0.7 },
          ]}
          onPress={onAlarmPress}
          hitSlop={8}
        >
          <Ionicons
            name={
              alarmMode === 'alarm'
                ? 'alarm'
                : alarmMode === 'adhan'
                ? 'volume-high'
                : alarmMode === 'silent'
                ? 'notifications'
                : 'notifications-off-outline'
            }
            size={18}
            color={
              isAlarmOn
                ? isActive
                  ? '#FFF'
                  : Theme.colors.primary
                : isActive
                ? 'rgba(255,255,255,0.4)'
                : Theme.colors.textSecondary
            }
          />
        </Pressable>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offsetTag: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginTop: 2,
  },
  alarmBtn: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.sm,
  },
  alarmBtnOn: {
    backgroundColor: Theme.colors.primary + '18',
  },
  alarmBtnActiveOn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  alarmBtnOff: {
    backgroundColor: 'transparent',
  },
  badge: {
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
