import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { PrayerCard } from '@/components/ui/PrayerCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FORBIDDEN_TIMES, SALAH_GUIDE } from '@/data/salatGuide';
import { Theme } from '@/constants/Theme';
import {
  ASR_METHODS,
  CALCULATION_METHODS,
  useAppSettings,
  type AsrMethodKey,
  type CalculationMethodKey,
} from '@/hooks/useAppSettings';
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import {
  formatTime,
  getComputedSalahTimes,
  getFardPrayerWindows,
  getForbiddenTimeWindows,
  getHijriDate,
  isInForbiddenTime,
} from '@/utils/prayerTimes';
import { scheduleOfflinePrayerAlarms } from '@/services/prayerNotifications';

type Tab = 'times' | 'guide' | 'forbidden';

const TYPE_COLORS: Record<string, string> = {
  fard: Theme.colors.primary,
  sunnah: Theme.colors.accent,
  nafl: '#6B4C9A',
  witr: '#2C3E6B',
};

export default function PrayerTimesScreen() {
  const [tab, setTab] = useState<Tab>('times');
  const [isSyncing, setIsSyncing] = useState(false);
  const { settings, updateSettings } = useAppSettings();
  const { location } = useLocation();
  const { prayers, nextPrayer } = usePrayerTimes(location.latitude, location.longitude);

  const hijri = getHijriDate();
  const forbiddenNow = isInForbiddenTime(prayers);
  const fardWindows = getFardPrayerWindows(prayers);
  const forbiddenWindows = getForbiddenTimeWindows(prayers);
  const extra = getComputedSalahTimes(prayers);

  const handleSyncOffline = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Offline Mode', 'Offline alarm push is supported on Android and iOS.');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await scheduleOfflinePrayerAlarms(
        location.latitude,
        location.longitude,
        settings,
        14
      );
      Alert.alert(
        'Offline Alarms Ready',
        `Scheduled ${res.scheduledCount} real-time prayer & Tahajjud alarms for the next 14 days!`
      );
    } catch {
      Alert.alert('Error', 'Failed to schedule offline alarms.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header title="Prayer Times" subtitle="নামাজের সময়সূচি" showBack />
      <ScreenContainer>
        <View style={styles.infoCard}>
          <Text style={styles.location}>
            📍 {location.city}, {location.country}
          </Text>
          <Text style={styles.hijri}>
            {hijri.day} {hijri.monthBn} {hijri.year} হিজরি
          </Text>
          <Text style={styles.method}>
            {CALCULATION_METHODS[settings.calculationMethod as CalculationMethodKey] ?? ''} · {ASR_METHODS[settings.asrMethod as AsrMethodKey] ?? ''} Asr
          </Text>

          {/* Alarm Status Pills */}
          <View style={styles.alarmStatusRow}>
            <View style={styles.alarmPill}>
              <Ionicons name="alarm" size={14} color={Theme.colors.accent} />
              <Text style={styles.alarmPillText}>
                Tahajjud: {settings.tahajjudAlarm ? `On (${settings.tahajjudOffsetMinutes ?? 45}m pre-Fajr)` : 'Off'}
              </Text>
            </View>
            <View style={styles.alarmPill}>
              <Ionicons name="sunny" size={14} color={Theme.colors.primary} />
              <Text style={styles.alarmPillText}>
                Fajr Alarm: {settings.fajrAlarm ? 'On' : 'Off'}
              </Text>
            </View>
          </View>

          {/* 30-day Automatic Offline Alarms Badge */}
          <View style={styles.autoStatusWrap}>
            <Ionicons name="checkmark-circle" size={16} color={Theme.colors.success} />
            <Text style={styles.autoStatusText}>
              Offline Alarms Active: 30 days automatically scheduled with Adhan & Tahajjud
            </Text>
          </View>

          {forbiddenNow ? (
            <View style={styles.forbiddenNow}>
              <Ionicons name="warning" size={16} color={Theme.colors.error} />
              <Text style={styles.forbiddenNowText}>
                এখন নামাজ নিষিদ্ধ: {forbiddenNow.titleBn}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.tabs}>
          {(['times', 'guide', 'forbidden'] as Tab[]).map((key) => (
            <Pressable
              key={key}
              style={[styles.tab, tab === key && styles.tabActive]}
              onPress={() => setTab(key)}
            >
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
                {key === 'times' ? '৫ ওয়াক্ত' : key === 'guide' ? 'সব নামাজ' : 'নিষিদ্ধ'}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'times' && (
          <>
            {prayers.map((prayer) => {
              const window = fardWindows.find((w) => w.name === prayer.name);
              return (
                <View key={prayer.name}>
                  <PrayerCard
                    prayer={prayer}
                    isNext={nextPrayer?.name === prayer.name}
                    isActive={nextPrayer?.name === prayer.name}
                  />
                  {window && prayer.name !== 'sunrise' ? (
                    <View style={styles.windowCard}>
                      <Text style={styles.windowValid}>✓ {window.validBn}</Text>
                      <Text style={styles.windowInvalid}>✗ {window.invalidBn}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </>
        )}

        {tab === 'guide' && (
          <>
            <SectionHeading title="Daily Salah Guide" subtitle="ফরজ, সুন্নত, নফল ও বিতর" />
            {extra.ishraq ? (
              <View style={styles.extraTime}>
                <Text style={styles.extraLabel}>ইশরাক · {formatTime(extra.ishraq)}</Text>
              </View>
            ) : null}
            {extra.tahajjudStart ? (
              <View style={styles.extraTime}>
                <Text style={styles.extraLabel}>তাহাজ্জুদ শুরু · {formatTime(extra.tahajjudStart)}</Text>
              </View>
            ) : null}
            {SALAH_GUIDE.map((salah) => (
              <View key={salah.id} style={styles.salahCard}>
                <View style={styles.salahHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[salah.type] + '20' }]}>
                    <Text style={[styles.typeText, { color: TYPE_COLORS[salah.type] }]}>
                      {salah.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.rakah}>{salah.rakah} rakah</Text>
                </View>
                <Text style={styles.salahName}>{salah.nameBn}</Text>
                <Text style={styles.salahNameEn}>{salah.nameEn}</Text>
                <Text style={styles.salahTiming}>⏰ {salah.timingBn}</Text>
                <Text style={styles.salahValid}>✓ {salah.validBn}</Text>
                {salah.invalidBn ? (
                  <Text style={styles.salahInvalid}>✗ {salah.invalidBn}</Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        {tab === 'forbidden' && (
          <>
            <SectionHeading
              title="Forbidden Prayer Times"
              subtitle="যে সময়ে নামাজ পড়া নিষিদ্ধ/মাকরুহ"
            />
            {FORBIDDEN_TIMES.map((item) => {
              const live = forbiddenWindows.find((w) => w.id === item.id);
              const isActive =
                live && new Date() >= live.start && new Date() < live.end;

              return (
                <View key={item.id} style={[styles.forbiddenCard, isActive && styles.forbiddenActive]}>
                  <Text style={styles.forbiddenTitle}>{item.titleBn}</Text>
                  <Text style={styles.forbiddenEn}>{item.titleEn}</Text>
                  <Text style={styles.forbiddenDesc}>{item.descBn}</Text>
                  {live ? (
                    <Text style={styles.forbiddenTime}>
                      Today: {formatTime(live.start)} – {formatTime(live.end)}
                    </Text>
                  ) : null}
                  {isActive ? (
                    <Text style={styles.forbiddenActiveLabel}>● এখন এই সময় চলছে</Text>
                  ) : null}
                </View>
              );
            })}
          </>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Theme.colors.background },
  infoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  location: { fontSize: Theme.fontSize.lg, fontWeight: '600', color: Theme.colors.text },
  hijri: { fontSize: Theme.fontSize.md, color: Theme.colors.primary, marginTop: 4 },
  method: { fontSize: Theme.fontSize.xs, color: Theme.colors.textSecondary, marginTop: Theme.spacing.sm },
  alarmStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Theme.spacing.sm,
  },
  alarmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
  },
  alarmPillText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  autoStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 8,
    marginTop: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  autoStatusText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
    color: Theme.colors.text,
    flex: 1,
    lineHeight: 18,
  },
  forbiddenNow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.error + '12',
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
  },
  forbiddenNowText: { flex: 1, fontSize: Theme.fontSize.sm, color: Theme.colors.error, fontWeight: '600' },
  tabs: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  tabActive: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  tabText: { fontSize: Theme.fontSize.sm, fontWeight: '600', color: Theme.colors.text },
  tabTextActive: { color: Theme.colors.textLight },
  windowCard: {
    marginTop: -Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    marginLeft: Theme.spacing.md,
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary,
  },
  windowValid: { fontSize: Theme.fontSize.xs, color: Theme.colors.success, lineHeight: 18 },
  windowInvalid: { fontSize: Theme.fontSize.xs, color: Theme.colors.error, marginTop: 2, lineHeight: 18 },
  extraTime: {
    backgroundColor: Theme.colors.accent + '15',
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.sm,
  },
  extraLabel: { fontSize: Theme.fontSize.sm, fontWeight: '600', color: Theme.colors.accent },
  salahCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  salahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Theme.borderRadius.sm },
  typeText: { fontSize: 10, fontWeight: '700' },
  rakah: { fontSize: Theme.fontSize.xs, color: Theme.colors.textSecondary },
  salahName: { fontSize: Theme.fontSize.md, fontWeight: '700', color: Theme.colors.primary },
  salahNameEn: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary },
  salahTiming: { fontSize: Theme.fontSize.sm, color: Theme.colors.text, marginTop: Theme.spacing.sm },
  salahValid: { fontSize: Theme.fontSize.xs, color: Theme.colors.success, marginTop: 4, lineHeight: 18 },
  salahInvalid: { fontSize: Theme.fontSize.xs, color: Theme.colors.error, marginTop: 2, lineHeight: 18 },
  forbiddenCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  forbiddenActive: {
    borderColor: Theme.colors.error + '60',
    backgroundColor: Theme.colors.error + '08',
  },
  forbiddenTitle: { fontSize: Theme.fontSize.md, fontWeight: '700', color: Theme.colors.text },
  forbiddenEn: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary },
  forbiddenDesc: { fontSize: Theme.fontSize.sm, color: Theme.colors.text, marginTop: Theme.spacing.sm, lineHeight: 22 },
  forbiddenTime: { fontSize: Theme.fontSize.xs, color: Theme.colors.primary, marginTop: Theme.spacing.sm, fontWeight: '600' },
  forbiddenActiveLabel: { fontSize: Theme.fontSize.xs, color: Theme.colors.error, fontWeight: '700', marginTop: 4 },
});
