import { Ionicons } from '@expo/vector-icons';
import { Alert, Linking, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SettingPicker } from '@/components/ui/SettingPicker';
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
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { requestNotificationPermission } from '@/services/prayerNotifications';
import { useLabels } from '@/utils/labels';
import { shadowStyle } from '@/utils/shadow';
import { useState } from 'react';

type PickerKey = 'language' | 'calculation' | 'asr' | null;

export default function SettingsScreen() {
  const { settings, updateSettings } = useAppSettings();
  const { syncState, meta, ready, startSync } = useOfflineSync();
  const { colors } = useAppTheme();
  const { t } = useLabels();
  const [picker, setPicker] = useState<PickerKey>(null);

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

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('prayerSection').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
          <SettingToggle
            icon="notifications-outline"
            title={t('prayerNotifications')}
            description={t('prayerNotificationsDesc')}
            value={settings.prayerNotifications}
            onChange={handlePrayerNotifications}
          />
          <Divider color={colors.border} />
          <SettingToggle
            icon="volume-high-outline"
            title={t('adhanSound')}
            description={t('adhanSoundDesc')}
            value={settings.adhanSound}
            onChange={(v) => updateSettings({ adhanSound: v })}
            disabled={!settings.prayerNotifications}
          />
          <Divider color={colors.border} />
          <SettingNav
            icon="calculator-outline"
            title={t('calculationMethod')}
            value={CALCULATION_METHODS[settings.calculationMethod]}
            onPress={() => setPicker('calculation')}
          />
          <Divider color={colors.border} />
          <SettingNav
            icon="compass-outline"
            title={t('asrMethod')}
            value={ASR_METHODS[settings.asrMethod]}
            onPress={() => setPicker('asr')}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('appSection').toUpperCase()}</Text>
        <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors)]}>
          <SettingNav
            icon="language-outline"
            title={t('language')}
            value={LANGUAGES[settings.language]}
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
});
