import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { Theme } from '@/constants/Theme';
import {
  PrayerAlertMode,
  useAppSettings,
} from '@/hooks/useAppSettings';
import { useLocation } from '@/hooks/useLocation';
import {
  requestNotificationPermission,
  scheduleOfflinePrayerAlarms,
  scheduleTestAlarm,
} from '@/services/prayerNotifications';
import { formatTime, PrayerName, PrayerTime } from '@/utils/prayerTimes';

type Props = {
  visible: boolean;
  selectedPrayerName?: PrayerName | 'tahajjud' | null;
  prayers?: PrayerTime[];
  onClose: () => void;
};

const PRAYER_LIST: { name: PrayerName | 'tahajjud'; labelEn: string; labelBn: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'tahajjud', labelEn: 'Tahajjud (Qiyam)', labelBn: 'তাহাজ্জুদ', icon: 'moon' },
  { name: 'fajr', labelEn: 'Fajr', labelBn: 'ফজর', icon: 'sunny' },
  { name: 'sunrise', labelEn: 'Sunrise (Ishraq)', labelBn: 'সূর্যোদয় / ইশরাক', icon: 'partly-sunny' },
  { name: 'dhuhr', labelEn: 'Dhuhr', labelBn: 'যোহর', icon: 'sunny-outline' },
  { name: 'asr', labelEn: 'Asr', labelBn: 'আসর', icon: 'time-outline' },
  { name: 'maghrib', labelEn: 'Maghrib', labelBn: 'মাগরিব', icon: 'cloudy-night-outline' },
  { name: 'isha', labelEn: 'Isha', labelBn: 'এশা', icon: 'moon-outline' },
];

const MODES: { key: PrayerAlertMode; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'alarm', label: 'Loud Alarm', desc: 'Continuous alarm sound & vibration', icon: 'alarm' },
  { key: 'adhan', label: 'Adhan Sound', desc: 'Adhan audio on prayer time', icon: 'volume-high' },
  { key: 'silent', label: 'Silent Alert', desc: 'Visual notification only (no audio)', icon: 'notifications-outline' },
  { key: 'off', label: 'Off', desc: 'No alarm or notification', icon: 'notifications-off-outline' },
];

const OFFSETS = [
  { value: 0, label: 'At Exact Time (0 min)' },
  { value: 5, label: '5 Minutes Before' },
  { value: 10, label: '10 Minutes Before' },
  { value: 15, label: '15 Minutes Before' },
  { value: 20, label: '20 Minutes Before' },
  { value: 30, label: '30 Minutes Before' },
  { value: 45, label: '45 Minutes Before' },
  { value: 60, label: '60 Minutes Before' },
];

export function PrayerAlarmModal({ visible, selectedPrayerName, prayers, onClose }: Props) {
  const { colors } = useAppTheme();
  const { settings, updateSettings } = useAppSettings();
  const { location } = useLocation();

  const [activeTab, setActiveTab] = useState<PrayerName | 'tahajjud'>(
    selectedPrayerName || 'fajr'
  );
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync active tab when selectedPrayerName changes
  React.useEffect(() => {
    if (selectedPrayerName) {
      setActiveTab(selectedPrayerName);
    }
  }, [selectedPrayerName]);

  const currentMode: PrayerAlertMode =
    settings.prayerAlertModes?.[activeTab] ??
    (activeTab === 'tahajjud'
      ? settings.tahajjudAlarm ? 'alarm' : 'off'
      : activeTab === 'fajr'
      ? settings.fajrAlarm ? 'alarm' : 'adhan'
      : activeTab === 'sunrise'
      ? 'off'
      : settings.adhanSound ? 'adhan' : 'silent');

  const currentOffset: number =
    settings.prayerAlertOffsets?.[activeTab] ??
    (activeTab === 'tahajjud' ? (settings.tahajjudOffsetMinutes ?? 45) : 0);

  const handleSetMode = async (mode: PrayerAlertMode) => {
    const newModes = { ...settings.prayerAlertModes, [activeTab]: mode };
    const newAlerts = { ...settings.prayerAlerts, [activeTab]: mode !== 'off' };

    const patch: any = {
      prayerAlertModes: newModes,
      prayerAlerts: newAlerts,
    };

    if (activeTab === 'tahajjud') {
      patch.tahajjudAlarm = mode !== 'off';
    } else if (activeTab === 'fajr') {
      patch.fajrAlarm = mode === 'alarm';
    }

    await updateSettings(patch);

    if (location.latitude && location.longitude) {
      scheduleOfflinePrayerAlarms(location.latitude, location.longitude, {
        ...settings,
        ...patch,
      }, 30).catch(() => undefined);
    }
  };

  const handleSetOffset = async (offsetMinutes: number) => {
    const newOffsets = { ...settings.prayerAlertOffsets, [activeTab]: offsetMinutes };
    const patch: any = { prayerAlertOffsets: newOffsets };

    if (activeTab === 'tahajjud') {
      patch.tahajjudOffsetMinutes = offsetMinutes;
    }

    await updateSettings(patch);

    if (location.latitude && location.longitude) {
      scheduleOfflinePrayerAlarms(location.latitude, location.longitude, {
        ...settings,
        ...patch,
      }, 30).catch(() => undefined);
    }
  };

  const handleTestAlarm = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web Mode', 'Test alarm push is supported on Android and iOS devices.');
      return;
    }

    setIsTesting(true);
    try {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Please enable notification permissions in your device settings.');
        return;
      }

      await scheduleTestAlarm(3, currentMode === 'off' ? 'alarm' : currentMode);
      Alert.alert(
        '🔔 Test Alarm Scheduled',
        'Alarm will ring in 3 seconds with sound & vibration! Lock your phone or switch apps to test background ring.'
      );
    } catch {
      Alert.alert('Error', 'Could not trigger test alarm.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleRescheduleAll = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web Mode', 'Offline alarm push is supported on Android and iOS devices.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await scheduleOfflinePrayerAlarms(
        location.latitude,
        location.longitude,
        settings,
        30
      );
      Alert.alert(
        '✅ Alarms Synchronized',
        `Successfully scheduled ${res.scheduledCount} prayer & Tahajjud alarms for the next 30 days offline!`
      );
    } catch {
      Alert.alert('Error', 'Failed to calculate and schedule alarms.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedPrayerInfo = PRAYER_LIST.find((p) => p.name === activeTab);
  const prayerTimeObj = prayers?.find((p) => p.name === activeTab);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.titleWrap}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Prayer & Alarm Timings</Text>
              <Text style={[styles.sheetSubtitle, { color: colors.textSecondary }]}>
                Set exact reminder times & audio alerts
              </Text>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          {/* Prayer Selector Chips */}
          <View style={styles.chipRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {PRAYER_LIST.map((item) => {
                const isSelected = activeTab === item.name;
                const mode = settings.prayerAlertModes?.[item.name] ?? 'adhan';
                const isActive = mode !== 'off';

                return (
                  <Pressable
                    key={item.name}
                    style={[
                      styles.chip,
                      { backgroundColor: isSelected ? colors.primary : colors.background, borderColor: colors.border },
                    ]}
                    onPress={() => setActiveTab(item.name)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={15}
                      color={isSelected ? '#FFF' : isActive ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>
                      {item.labelEn}
                    </Text>
                    {isActive && (
                      <View style={[styles.activeDot, { backgroundColor: isSelected ? '#FFF' : Theme.colors.success }]} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* Active Prayer Card Summary */}
            <View style={[styles.prayerSummary, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.flex}>
                <Text style={[styles.prayerSummaryTitle, { color: colors.text }]}>
                  {selectedPrayerInfo?.labelEn} ({selectedPrayerInfo?.labelBn})
                </Text>
                {prayerTimeObj ? (
                  <Text style={[styles.prayerSummaryTime, { color: colors.primary }]}>
                    Today's Time: {formatTime(prayerTimeObj.time)}
                  </Text>
                ) : activeTab === 'tahajjud' ? (
                  <Text style={[styles.prayerSummaryTime, { color: colors.primary }]}>
                    Time: {currentOffset} min before Fajr
                  </Text>
                ) : null}
              </View>
              <View style={[styles.modeBadge, { backgroundColor: currentMode === 'off' ? colors.border : colors.primary + '18' }]}>
                <Ionicons
                  name={currentMode === 'alarm' ? 'alarm' : currentMode === 'adhan' ? 'volume-high' : currentMode === 'silent' ? 'notifications' : 'notifications-off'}
                  size={16}
                  color={currentMode === 'off' ? colors.textSecondary : colors.primary}
                />
                <Text style={[styles.modeBadgeText, { color: currentMode === 'off' ? colors.textSecondary : colors.primary }]}>
                  {currentMode.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* ALERT MODE SELECTION */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ALERT SOUND & BEHAVIOR</Text>
            <View style={[styles.optionGroup, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {MODES.map((m, idx) => {
                const isSelected = currentMode === m.key;
                return (
                  <Pressable
                    key={m.key}
                    style={[
                      styles.optionRow,
                      idx < MODES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.primary + '10' },
                    ]}
                    onPress={() => handleSetMode(m.key)}
                  >
                    <View style={[styles.optionIconWrap, { backgroundColor: isSelected ? colors.primary : colors.surface }]}>
                      <Ionicons name={m.icon} size={18} color={isSelected ? '#FFF' : colors.primary} />
                    </View>
                    <View style={styles.flex}>
                      <Text style={[styles.optionLabel, { color: colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                        {m.label}
                      </Text>
                      <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{m.desc}</Text>
                    </View>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </Pressable>
                );
              })}
            </View>

            {/* REMINDER TIME / OFFSET SELECTION */}
            {currentMode !== 'off' && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: Theme.spacing.md }]}>
                  {activeTab === 'tahajjud' ? 'TAHAJJUD ALARM OFFSET (BEFORE FAJR)' : 'REMINDER TIME / OFFSET'}
                </Text>
                <View style={[styles.optionGroup, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  {OFFSETS.map((off, idx) => {
                    const isSelected = currentOffset === off.value;
                    return (
                      <Pressable
                        key={off.value}
                        style={[
                          styles.optionRow,
                          idx < OFFSETS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                          isSelected && { backgroundColor: colors.primary + '10' },
                        ]}
                        onPress={() => handleSetOffset(off.value)}
                      >
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color={isSelected ? colors.primary : colors.textSecondary}
                        />
                        <Text style={[styles.offsetLabel, { color: colors.text, fontWeight: isSelected ? '700' : '400' }]}>
                          {off.label}
                        </Text>
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={isSelected ? colors.primary : colors.border}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* ACTION BUTTONS */}
            <View style={styles.actionRow}>
              <Pressable
                style={[styles.testBtn, { backgroundColor: colors.primary + '18' }]}
                onPress={handleTestAlarm}
                disabled={isTesting}
              >
                <Ionicons name="volume-medium" size={18} color={colors.primary} />
                <Text style={[styles.testBtnText, { color: colors.primary }]}>
                  {isTesting ? 'Scheduling...' : '🔔 Test Alarm (3s)'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={handleRescheduleAll}
                disabled={isSaving}
              >
                <Ionicons name="sync" size={18} color="#FFF" />
                <Text style={styles.saveBtnText}>
                  {isSaving ? 'Syncing...' : 'Sync 30 Days'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
  },
  titleWrap: { flex: 1 },
  sheetTitle: { fontSize: Theme.fontSize.lg, fontWeight: '700' },
  sheetSubtitle: { fontSize: Theme.fontSize.xs, marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    paddingVertical: Theme.spacing.sm,
  },
  chipScroll: {
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    maxHeight: 480,
  },
  bodyContent: {
    padding: Theme.spacing.md,
  },
  prayerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    marginBottom: Theme.spacing.md,
  },
  flex: { flex: 1 },
  prayerSummaryTitle: { fontSize: Theme.fontSize.md, fontWeight: '700' },
  prayerSummaryTime: { fontSize: Theme.fontSize.sm, fontWeight: '600', marginTop: 2 },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.sm,
    gap: 4,
  },
  modeBadgeText: { fontSize: 10, fontWeight: '700' },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Theme.spacing.xs,
    marginLeft: 4,
  },
  optionGroup: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Theme.spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  optionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: { fontSize: Theme.fontSize.sm },
  optionDesc: { fontSize: Theme.fontSize.xs, marginTop: 2 },
  offsetLabel: { flex: 1, fontSize: Theme.fontSize.sm },
  actionRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  testBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
    gap: 6,
  },
  testBtnText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
  },
});
