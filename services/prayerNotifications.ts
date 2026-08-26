import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  formatTime,
  getPrayerTimes,
  PrayerName,
  PrayerTime,
} from '@/utils/prayerTimes';
import { AppSettings, DEFAULT_SETTINGS } from '@/hooks/useAppSettings';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const PRAYER_TITLES: Record<string, { en: string; bn: string; descEn: string; descBn: string }> = {
  tahajjud: {
    en: 'Tahajjud (Qiyam al-Layl) Alarm',
    bn: 'তাহাজ্জুদ নামাজের সময় (কিয়ামুল লাইল)',
    descEn: 'Time for Tahajjud prayer before Fajr. Stand before Allah in the quiet hours.',
    descBn: 'তাহাজ্জুদের সময় হয়েছে। ফজরের আগে নফল নামাজের বিশেষ ফজিলত রয়েছে।',
  },
  fajr: {
    en: 'Fajr Prayer Time & Adhan',
    bn: 'ফজর নামাজের ওয়াক্ত ও আজান',
    descEn: 'As-Salatu Khayrum-minan-nawm — Prayer is better than sleep.',
    descBn: 'আস-সালাতু খাইরুম মিনান নাওম — নামাজের ওয়াক্ত হয়েছে।',
  },
  sunrise: {
    en: 'Sunrise / Ishraq Time',
    bn: 'সূর্যোদয় ও ইশরাকের সময়',
    descEn: 'Sunrise time. Prepare for Ishraq and Duha prayer after 15–20 minutes.',
    descBn: 'সূর্যোদয়ের সময়। ১৫-২০ মিনিট পর ইশরাক নামাজের ওয়াক্ত হবে।',
  },
  dhuhr: {
    en: 'Dhuhr Prayer Time',
    bn: 'যোহর নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Dhuhr prayer has begun.',
    descBn: 'যোহর নামাজের সময় হয়েছে। জামাতের প্রস্তুতি নিন।',
  },
  asr: {
    en: 'Asr Prayer Time',
    bn: 'আসর নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Asr prayer has begun.',
    descBn: 'আসর নামাজের সময় হয়েছে।',
  },
  maghrib: {
    en: 'Maghrib Prayer Time',
    bn: 'মাগরিব নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Maghrib prayer & Iftar has begun.',
    descBn: 'মাগরিব নামাজের সময় হয়েছে।',
  },
  isha: {
    en: 'Isha Prayer Time',
    bn: 'এশা নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Isha & Witr prayer has begun.',
    descBn: 'এশা ও বিতর নামাজের সময় হয়েছে।',
  },
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return status === 'granted';
}

export async function cancelPrayerNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Schedules real-time offline prayer and alarm notifications for up to `daysAhead` days.
 * Pure mathematical calculation via `adhan` ensures 100% offline capability.
 */
export async function scheduleOfflinePrayerAlarms(
  latitude: number,
  longitude: number,
  settings: AppSettings = DEFAULT_SETTINGS,
  daysAhead = 14
): Promise<{ scheduledCount: number }> {
  if (Platform.OS === 'web') return { scheduledCount: 0 };

  const granted = await requestNotificationPermission();
  if (!granted) return { scheduledCount: 0 };

  // Setup High Priority Android Channels
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-adhan', {
      name: 'Adhan & Prayer Times',
      importance: Notifications.AndroidImportance.MAX,
      sound: settings.adhanSound ? 'default' : undefined,
      vibrationPattern: [0, 500, 250, 500, 250, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    await Notifications.setNotificationChannelAsync('prayer-alarm', {
      name: 'Fajr & Tahajjud Alarms',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 800, 400, 800, 400, 800],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  // Cancel past notifications to avoid duplicates
  await cancelPrayerNotifications();

  if (!settings.prayerNotifications) {
    return { scheduledCount: 0 };
  }

  const now = new Date();
  let count = 0;

  for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);

    // Calculate prayer times offline using Adhan
    const prayers = getPrayerTimes(latitude, longitude, targetDate, {
      calculationMethod: settings.calculationMethod,
      asrMethod: settings.asrMethod,
    });

    const fajrPrayer = prayers.find((p) => p.name === 'fajr');

    // 1. Schedule Tahajjud Alarm if enabled
    if (settings.tahajjudAlarm && settings.prayerAlerts?.tahajjud !== false && fajrPrayer) {
      const offsetMs = (settings.tahajjudOffsetMinutes ?? 45) * 60 * 1000;
      const tahajjudTime = new Date(fajrPrayer.time.getTime() - offsetMs);

      if (tahajjudTime > now) {
        const info = PRAYER_TITLES.tahajjud;
        await Notifications.scheduleNotificationAsync({
          identifier: `tahajjud-day-${dayOffset}`,
          content: {
            title: `🌙 ${info.en}`,
            body: `${info.bn} · ${formatTime(tahajjudTime)} (${settings.tahajjudOffsetMinutes ?? 45}m before Fajr)`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            ...(Platform.OS === 'android' ? { channelId: 'prayer-alarm' } : {}),
            data: { type: 'tahajjud', time: tahajjudTime.toISOString() },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: tahajjudTime,
          },
        });
        count++;
      }
    }

    // 2. Schedule 5 Daily Prayers + Sunrise
    for (const prayer of prayers) {
      const isFajr = prayer.name === 'fajr';
      const isSunrise = prayer.name === 'sunrise';

      // Check if this prayer alert is active in settings
      const isAlertEnabled = settings.prayerAlerts?.[prayer.name as PrayerName] ?? true;
      if (!isAlertEnabled && (!isFajr || !settings.fajrAlarm)) {
        continue;
      }

      if (prayer.time > now) {
        const info = PRAYER_TITLES[prayer.name] ?? {
          en: `${prayer.label} Prayer Time`,
          bn: `${prayer.labelBn} নামাজের ওয়াক্ত`,
          descEn: `Time for ${prayer.label} prayer`,
          descBn: `${prayer.labelBn} নামাজের সময় হয়েছে`,
        };

        const isAlarmType = isFajr && settings.fajrAlarm;
        const channelId = isAlarmType ? 'prayer-alarm' : 'prayer-adhan';

        await Notifications.scheduleNotificationAsync({
          identifier: `prayer-${prayer.name}-day-${dayOffset}`,
          content: {
            title: isFajr ? `🕌 ⏰ ${info.en}` : `🕌 ${info.en}`,
            body: `${info.bn} · ${formatTime(prayer.time)} — ${info.descBn}`,
            sound: isSunrise ? false : (settings.adhanSound ?? true),
            priority: Notifications.AndroidNotificationPriority.HIGH,
            ...(Platform.OS === 'android' ? { channelId } : {}),
            data: { prayer: prayer.name, time: prayer.time.toISOString() },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: prayer.time,
          },
        });
        count++;
      }
    }
  }

  return { scheduledCount: count };
}

// Backward compatibility alias
export async function schedulePrayerNotifications(
  prayers: PrayerTime[],
  options?: { playSound?: boolean }
): Promise<void> {
  // If called directly with today's prayers, schedule them
  if (Platform.OS === 'web') return;
  const granted = await requestNotificationPermission();
  if (!granted) return;

  const now = new Date();
  for (const prayer of prayers) {
    if (prayer.time > now) {
      const info = PRAYER_TITLES[prayer.name];
      if (!info) continue;
      await Notifications.scheduleNotificationAsync({
        identifier: `prayer-${prayer.name}`,
        content: {
          title: `🕌 ${info.en}`,
          body: `${info.bn} · ${formatTime(prayer.time)}`,
          sound: options?.playSound ?? true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: prayer.time,
        },
      });
    }
  }
}
