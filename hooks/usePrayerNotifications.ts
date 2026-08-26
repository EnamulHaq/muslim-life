import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useLocation } from '@/hooks/useLocation';
import {
  cancelPrayerNotifications,
  scheduleOfflinePrayerAlarms,
} from '@/services/prayerNotifications';

export function usePrayerNotifications() {
  const { settings } = useAppSettings();
  const { location } = useLocation();

  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (!settings.prayerNotifications) {
      cancelPrayerNotifications().catch(() => undefined);
      return;
    }

    if (!location.latitude || !location.longitude) return;

    // Automatically calculate and schedule 30 days of offline prayer times,
    // Fajr alarms, and Tahajjud alarms in the background without any manual download.
    scheduleOfflinePrayerAlarms(
      location.latitude,
      location.longitude,
      settings,
      30
    ).catch(() => undefined);
  }, [
    settings.prayerNotifications,
    settings.adhanSound,
    settings.fajrAlarm,
    settings.tahajjudAlarm,
    settings.tahajjudOffsetMinutes,
    settings.calculationMethod,
    settings.asrMethod,
    settings.prayerAlerts,
    location.latitude,
    location.longitude,
  ]);
}
