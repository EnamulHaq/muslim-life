import { useEffect, useState } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import {
  getNextPrayer,
  getPrayerTimes,
  getTimeUntil,
  PrayerTime,
} from '@/utils/prayerTimes';

export function usePrayerTimes(latitude: number, longitude: number) {
  const { settings } = useAppSettings();
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const times = getPrayerTimes(latitude, longitude, new Date(), {
      calculationMethod: settings.calculationMethod,
      asrMethod: settings.asrMethod,
    });
    setPrayers(times);
    setNextPrayer(getNextPrayer(times));
  }, [latitude, longitude, settings.calculationMethod, settings.asrMethod]);

  useEffect(() => {
    if (!nextPrayer) return;

    const tick = () => {
      setCountdown(getTimeUntil(nextPrayer.time));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  return { prayers, nextPrayer, countdown };
}
