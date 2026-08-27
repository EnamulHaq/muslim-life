import { Ionicons } from '@expo/vector-icons';
import { Alert, Linking, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SettingPicker } from '@/components/ui/SettingPicker';
import { QuranSettingsSheet } from '@/components/quran/QuranSettingsSheet';
import { PrayerAlarmModal } from '@/components/prayer/PrayerAlarmModal';
import { useAppTheme } from '@/context/AppThemeContext';
import { Theme } from '@/constants/Theme';
import {
  ASR_METHODS,
  CALCULATION_METHODS,
  LANGUAGES,
  useAppSettings,
  type AppLanguage,
  type AsrMethodKey,
  type CalculationMethodKey,
} from '@/hooks/useAppSettings';
import { useLocation } from '@/hooks/useLocation';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useQuranSettings } from '@/hooks/useQuranSettings';
import {
  requestNotificationPermission,
  scheduleOfflinePrayerAlarms,
  scheduleTestAlarm,
} from '@/services/prayerNotifications';
import { useLabels } from '@/utils/labels';
import { shadowStyle } from '@/utils/shadow';
import { useState } from 'react';

type PickerKey = 'language' | 'calculation' | 'asr' | 'tahajjudOffset' | null;

const TAHAJJUD_OFFSETS: Record<string, string> = {
  '30': '30 Minutes before Fajr',
  '45': '45 Minutes before Fajr',
  '60': '60 Minutes before Fajr',
};

export default function SettingsScreen() {
  const { settings, updateSettings } = useAppSettings();
  const { syncState, meta, ready, startSync } = useOfflineSync();
  const { location } = useLocation();
  const { activeReciter, quranSettings } = useQuranSettings();
  const { colors } = useAppTheme();
  const { t } = useLabels();
  const [picker, setPicker] = useState<PickerKey>(null);
  const [showQuranSettings, setShowQuranSettings] = useState(false);
  const [showPrayerAlarms, setShowPrayerAlarms] = useState(false);
  const [isSyncingAlarms, setIsSyncingAlarms] = useState(false);

  const syncPercent =
    syncState.status === 'running' && syncState.total > 0
      ? Math.round((syncState.current / syncState.total) * 100)
      : 0;

  const handlePrayerNotifications = async (value: boolean) => {
    if (value && Platform.OS !== 'web') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(t('prayerNotifications'), t('notificationDenied'));
        return;
      }
    }
    await updateSettings({ prayerNotifications: value });
    if (value && location.latitude && location.longitude) {
      await scheduleOfflinePrayerAlarms(location.latitude, location.longitude, {
        ...settings,
        prayerNotifications: value,
      }, 14);
    }
  };

  const handleSyncOfflineAlarms = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Offline Alarms', 'Offline push notifications are supported on Android and iOS devices.');
      return;
    }
    setIsSyncingAlarms(true);
    try {
      const res = await scheduleOfflinePrayerAlarms(
        location.latitude,
        location.longitude,
        settings,
        14
      );
      Alert.alert(
        'Alarms Scheduled',
        `Successfully calculated and scheduled ${res.scheduledCount} prayer & Tahajjud alarms for the next 14 days offline!`
      );
    } catch (e) {
      Alert.alert('Error', 'Could not schedule offline alarms.');
    } finally {
      setIsSyncingAlarms(false);
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <Header title={t('settings')} subtitle="Muslim Life" />
      <ScreenContainer>
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="person" size={30} color={colors.primary} />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: colors.text }]}>{t('greeting')}</Text>
            <Text style={[styles.profileSub, { color: colors.textSecondary }]}>Muslim Life · v1.0.0</Text>
          </View>
        </View>

        {/* QURAN & AUDIO SETTINGS */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>AL-QURAN & RECITATION</Text>
        <Pressable
          style={[styles.offlineCard, { backgroundColor: colors.surface, borderColor: colors.primary + '35' }, cardShadow(colors)]}
          onPress={() => setShowQuranSettings(true)}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primary + '14' }]}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Quran Script, Font & Reciter</Text>
            <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>
              {quranSettings.scriptType.toUpperCase()} ({quranSettings.fontStyle}) · {activeReciter.name}
            </Text>
            <Text style={[styles.rowValue, { color: colors.primary }]}>Tap to customize appearance</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>

        {/* OFFLINE READING SYNC */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('offlineReading').toUpperCase()}</Text>
        <Pressable
          style={[styles.offlineCard, { backgroundColor: colors.surface, borderColor: colors.primary + '35' }, cardShadow(colors)]}
          onPress={() => syncState.status !== 'running' && startSync()}
          disabled={syncState.status === 'running'}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primary + '14' }]}>
            <Ionicons name={ready ? 'cloud-done' : 'cloud-download-outline'} size={24} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('offlineReading')}</Text>
            <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{t('offlineDesc')}</Text>
            <Text style={[styles.rowValue, { color: colors.primary }]}>
              {syncState.status === 'running' ? syncState.phase : ready ? t('offlineReady') : t('offlineDownload')}
            </Text>
            {syncState.status === 'running' ? (
              <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                <View style={[styles.progressFill, { width: `${syncPercent}%`, backgroundColor: colors.primary }]} />
              </View>
            ) : null}
            {syncState.error ? <Text style={[styles.errorText, { color: colors.error }]}>{syncState.error}</Text> : null}
          </View>
          {syncState.status === 'running' ? (
            <Text style={[styles.percent, { color: colors.primary }]}>{syncPercent}%</Text>
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          )}
        </Pressable>

        {/* PRAYER TIMES & ALARMS */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PRAYER ALARMS & ADHAN (OFFLINE)</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
          <SettingNav
            icon="alarm"
            title="Configure All Prayer & Tahajjud Alarms"
            value="Custom times, Adhan & loud alarms"
            onPress={() => setShowPrayerAlarms(true)}
          />
          <Divider color={colors.border} />
          <SettingToggle
            icon="notifications-outline"
            title={t('prayerNotifications')}
            description="Automatic real-time alerts for all 5 prayers"
            value={settings.prayerNotifications}
            onChange={handlePrayerNotifications}
          />
          <Divider color={colors.border} />
          <SettingToggle
            icon="alarm-outline"
            title="Tahajjud Night Alarm"
            description={`Automatic alarm before Fajr (${settings.tahajjudOffsetMinutes ?? 45}m before)`}
            value={settings.tahajjudAlarm ?? true}
            onChange={(v) => updateSettings({ tahajjudAlarm: v })}
            disabled={!settings.prayerNotifications}
          />
          <Divider color={colors.border} />
          <SettingNav
            icon="time-outline"
            title="Tahajjud Alarm Time"
            value={TAHAJJUD_OFFSETS[String(settings.tahajjudOffsetMinutes ?? 45)] ?? '45 Minutes before Fajr'}
            onPress={() => setPicker('tahajjudOffset')}
          />
          <Divider color={colors.border} />
          <SettingToggle
            icon="sunny-outline"
            title="Fajr Wakeup Alarm"
            description="Loud wakeup alarm and Adhan for Fajr"
            value={settings.fajrAlarm ?? true}
            onChange={(v) => updateSettings({ fajrAlarm: v })}
            disabled={!settings.prayerNotifications}
          />
          <Divider color={colors.border} />
          <SettingToggle
            icon="volume-high-outline"
            title={t('adhanSound')}
            description="Play Adhan audio sound on prayer times"
            value={settings.adhanSound}
            onChange={(v) => updateSettings({ adhanSound: v })}
            disabled={!settings.prayerNotifications}
          />
          <Divider color={colors.border} />
          <SettingNav
            icon="play-outline"
            title="🔔 Test Device Alarm Now (3s)"
            value="Test audio & vibration trigger"
            onPress={async () => {
              if (Platform.OS === 'web') {
                Alert.alert('Web Mode', 'Test alarm is supported on mobile.');
                return;
              }
              const granted = await requestNotificationPermission();
              if (!granted) {
                Alert.alert('Permission Required', 'Please enable notification permissions in your device settings.');
                return;
              }
              await scheduleTestAlarm(3, 'alarm');
              Alert.alert('🔔 Test Alarm Scheduled', 'Alarm will ring with sound & vibration in 3 seconds!');
            }}
          />
          <Divider color={colors.border} />
          <View style={styles.autoOfflineRow}>
            <Ionicons name="checkmark-circle" size={18} color={Theme.colors.success} />
            <Text style={[styles.autoOfflineText, { color: colors.text }]}>
              Offline Alarms: Auto-active (30 days scheduled automatically, no download needed)
            </Text>
          </View>
          <Divider color={colors.border} />
          <SettingNav
            icon="calculator-outline"
            title={t('calculationMethod')}
            value={CALCULATION_METHODS[settings.calculationMethod as CalculationMethodKey] ?? ''}
            onPress={() => setPicker('calculation')}
          />
          <Divider color={colors.border} />
          <SettingNav
            icon="compass-outline"
            title={t('asrMethod')}
            value={ASR_METHODS[settings.asrMethod as AsrMethodKey] ?? ''}
            onPress={() => setPicker('asr')}
          />
        </View>

        {/* APP SETTINGS */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('appSection').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
          <SettingNav
            icon="language-outline"
            title={t('language')}
            value={LANGUAGES[settings.language as AppLanguage] ?? ''}
            onPress={() => setPicker('language')}
          />
          <Divider color={colors.border} />
          <SettingToggle
            icon="moon-outline"
            title={t('darkMode')}
            description={t('darkModeDesc')}
            value={settings.darkMode}
            onChange={(v) => updateSettings({ darkMode: v })}
          />
        </View>

        {/* SUPPORT */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('supportSection').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
          <SettingNav
            icon="mail-outline"
            title={t('support')}
            value="support@muslimlife.app"
            onPress={() =>
              Alert.alert(t('support'), undefined, [
                { text: 'Email', onPress: () => Linking.openURL('mailto:support@muslimlife.app') },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
          />
          <Divider color={colors.border} />
          <SettingNav
            icon="information-circle-outline"
            title={t('about')}
            value="Muslim Life"
            onPress={() =>
              Alert.alert(
                'Muslim Life',
                'Quran · Prayer · Hadith · Dua · Tasbih · Qibla\n\nVersion 1.0.0'
              )
            }
          />
        </View>
      </ScreenContainer>

      {/* Pickers */}
      <SettingPicker
        visible={picker === 'language'}
        title={t('language')}
        options={LANGUAGES}
        selected={settings.language}
        onSelect={(language: AppLanguage) => updateSettings({ language })}
        onClose={() => setPicker(null)}
      />
      <SettingPicker
        visible={picker === 'calculation'}
        title={t('calculationMethod')}
        options={CALCULATION_METHODS}
        selected={settings.calculationMethod}
        onSelect={(calculationMethod: CalculationMethodKey) => updateSettings({ calculationMethod })}
        onClose={() => setPicker(null)}
      />
      <SettingPicker
        visible={picker === 'asr'}
        title={t('asrMethod')}
        options={ASR_METHODS}
        selected={settings.asrMethod}
        onSelect={(asrMethod: AsrMethodKey) => updateSettings({ asrMethod })}
        onClose={() => setPicker(null)}
      />
      <SettingPicker
        visible={picker === 'tahajjudOffset'}
        title="Tahajjud Alarm Time"
        options={TAHAJJUD_OFFSETS}
        selected={String(settings.tahajjudOffsetMinutes ?? 45)}
        onSelect={(val: string) => updateSettings({ tahajjudOffsetMinutes: parseInt(val, 10) })}
        onClose={() => setPicker(null)}
      />

      {/* Quran Appearance Sheet */}
      <QuranSettingsSheet
        visible={showQuranSettings}
        onClose={() => setShowQuranSettings(false)}
      />

      {/* Prayer Alarms Sheet */}
      <PrayerAlarmModal
        visible={showPrayerAlarms}
        onClose={() => setShowPrayerAlarms(false)}
      />
    </View>
  );
}

function cardShadow(colors: { cardShadow: string }) {
  return shadowStyle({ color: colors.cardShadow, offset: { width: 0, height: 2 }, radius: 8, elevation: 2 });
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

function SettingToggle({
  icon,
  title,
  description,
  value,
  onChange,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + '14' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={colors.surface}
      />
    </View>
  );
}

function SettingNav({
  icon,
  title,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + '14' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowValue, { color: colors.primary }]} numberOfLines={2}>
          {value}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    gap: Theme.spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: { flex: 1 },
  profileName: { fontSize: Theme.fontSize.lg, fontWeight: '700' },
  profileSub: { fontSize: Theme.fontSize.sm, marginTop: 2 },
  sectionLabel: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Theme.spacing.sm,
    marginLeft: 4,
  },
  offlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    gap: Theme.spacing.md,
  },
  group: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    marginBottom: Theme.spacing.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  disabled: { opacity: 0.5 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  rowTitle: { fontSize: Theme.fontSize.md, fontWeight: '600' },
  rowDesc: { fontSize: Theme.fontSize.xs, marginTop: 3, lineHeight: 17 },
  rowValue: { fontSize: Theme.fontSize.sm, marginTop: 4, fontWeight: '500' },
  divider: { height: 1, marginLeft: 68 },
  progressTrack: {
    height: 6,
    borderRadius: Theme.borderRadius.full,
    marginTop: Theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: Theme.borderRadius.full },
  percent: { fontSize: Theme.fontSize.sm, fontWeight: '700' },
  errorText: { fontSize: Theme.fontSize.xs, marginTop: 6 },
  autoOfflineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  autoOfflineText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
});
