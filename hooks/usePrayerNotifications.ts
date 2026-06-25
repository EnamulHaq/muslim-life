import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import {
  cancelPrayerNotifications,
  schedulePrayerNotifications,
} from '@/services/prayerNotifications';

export function usePrayerNotifications() {
  const { settings } = useAppSettings();
  const { location } = useLocation();
  const { prayers } = usePrayerTimes(location.latitude, location.longitude);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (!settings.prayerNotifications) {
      cancelPrayerNotifications().catch(() => undefined);
      return;
    }

    if (prayers.length === 0) return;

    schedulePrayerNotifications(prayers, { playSound: settings.adhanSound }).catch(
      () => undefined
    );
  }, [
    settings.prayerNotifications,
    settings.adhanSound,
    settings.calculationMethod,
    settings.asrMethod,
    prayers,
    location.latitude,
    location.longitude,
  ]);
}
