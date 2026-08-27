import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  formatTime,
  getPrayerTimes,
  PrayerName,
  PrayerTime,
} from '@/utils/prayerTimes';
import { AppSettings, DEFAULT_SETTINGS, PrayerAlertMode } from '@/hooks/useAppSettings';

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
    bn: 'তাহাজ্জুদ নামাজের ওয়াক্ত (কিয়ামুল লাইল)',
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
    en: 'Dhuhr Prayer Time & Adhan',
    bn: 'যোহর নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Dhuhr prayer has begun.',
    descBn: 'যোহর নামাজের সময় হয়েছে। জামাতের প্রস্তুতি নিন।',
  },
  asr: {
    en: 'Asr Prayer Time & Adhan',
    bn: 'আসর নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Asr prayer has begun.',
    descBn: 'আসর নামাজের সময় হয়েছে।',
  },
  maghrib: {
    en: 'Maghrib Prayer Time & Adhan',
    bn: 'মাগরিব নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Maghrib prayer & Iftar has begun.',
    descBn: 'মাগরিব নামাজের সময় হয়েছে।',
  },
  isha: {
    en: 'Isha Prayer Time & Adhan',
    bn: 'এশা নামাজের ওয়াক্ত ও আজান',
    descEn: 'Time for Isha & Witr prayer has begun.',
    descBn: 'এশা ও বিতর নামাজের সময় হয়েছে।',
  },
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
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
  } catch {
    return false;
  }
}

export async function cancelPrayerNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}

/**
 * Initializes notification channels on Android with highest priority, loud sound, and vibration
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    // 1. Loud Prayer & Tahajjud Alarm Channel
    await Notifications.setNotificationChannelAsync('prayer-alarm', {
      name: 'Prayer & Tahajjud Alarms (Loud)',
      description: 'Loud wakeup alarms with sound and strong vibration for Fajr & Tahajjud',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 800, 400, 800, 400, 800, 400, 800],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableVibrate: true,
      enableLights: true,
      lightColor: '#0B5E3C',
    });

    // 2. Adhan & Prayer Times Notification Channel
    await Notifications.setNotificationChannelAsync('prayer-adhan', {
      name: 'Adhan & Prayer Times',
      description: 'Prayer time notifications with Adhan sound',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 500, 250, 500, 250, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableVibrate: true,
      enableLights: true,
      lightColor: '#D4A017',
    });

    // 3. Silent Notification Channel
    await Notifications.setNotificationChannelAsync('prayer-silent', {
      name: 'Silent Prayer Reminders',
      description: 'Visual prayer reminders without loud alarm audio',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: undefined,
      vibrationPattern: [0, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
  } catch {
    // ignore
  }
}

/**
 * Schedules real-time offline prayer and alarm notifications for up to `daysAhead` days.
 * Pure mathematical calculation via `adhan` ensures 100% offline capability.
 */
export async function scheduleOfflinePrayerAlarms(
  latitude: number,
  longitude: number,
  settings: AppSettings = DEFAULT_SETTINGS,
  daysAhead = 30
): Promise<{ scheduledCount: number }> {
  if (Platform.OS === 'web') return { scheduledCount: 0 };

  const granted = await requestNotificationPermission();
  if (!granted) return { scheduledCount: 0 };

  await setupNotificationChannels();

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
    const tahajjudMode: PrayerAlertMode =
      settings.prayerAlertModes?.tahajjud ??
      (settings.tahajjudAlarm && settings.prayerAlerts?.tahajjud !== false ? 'alarm' : 'off');

    if (tahajjudMode !== 'off' && fajrPrayer) {
      const offsetMinutes = settings.prayerAlertOffsets?.tahajjud ?? settings.tahajjudOffsetMinutes ?? 45;
      const offsetMs = offsetMinutes * 60 * 1000;
      const tahajjudTime = new Date(fajrPrayer.time.getTime() - offsetMs);

      if (tahajjudTime > now) {
        const info = PRAYER_TITLES.tahajjud;
        const channelId =
          tahajjudMode === 'alarm' ? 'prayer-alarm' : tahajjudMode === 'silent' ? 'prayer-silent' : 'prayer-adhan';
        const hasSound = tahajjudMode !== 'silent';

        await Notifications.scheduleNotificationAsync({
          identifier: `tahajjud-day-${dayOffset}`,
          content: {
            title: `🌙 ${info.en}`,
            body: `${info.bn} · ${formatTime(tahajjudTime)} (${offsetMinutes}m before Fajr)`,
            sound: hasSound,
            priority: Notifications.AndroidNotificationPriority.MAX,
            ...(Platform.OS === 'android' ? { channelId } : {}),
            data: { type: 'tahajjud', time: tahajjudTime.toISOString(), offsetMinutes },
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

      // Determine alert mode for this prayer
      let prayerMode: PrayerAlertMode = settings.prayerAlertModes?.[prayer.name as PrayerName] ?? 'adhan';

      // Check legacy boolean overrides if prayerAlertModes is not explicitly set
      if (!settings.prayerAlertModes?.[prayer.name as PrayerName]) {
        const isAlertEnabled = settings.prayerAlerts?.[prayer.name as PrayerName] ?? (isSunrise ? false : true);
        if (!isAlertEnabled) {
          prayerMode = 'off';
        } else if (isFajr && settings.fajrAlarm) {
          prayerMode = 'alarm';
        } else if (isSunrise) {
          prayerMode = 'silent';
        } else if (!settings.adhanSound) {
          prayerMode = 'silent';
        } else {
          prayerMode = 'adhan';
        }
      }

      if (prayerMode === 'off') {
        continue;
      }

      // Calculate custom reminder offset
      const offsetMinutes = settings.prayerAlertOffsets?.[prayer.name as PrayerName] ?? 0;
      const targetTriggerTime = new Date(prayer.time.getTime() - offsetMinutes * 60 * 1000);

      if (targetTriggerTime > now) {
        const info = PRAYER_TITLES[prayer.name] ?? {
          en: `${prayer.label} Prayer Time`,
          bn: `${prayer.labelBn} নামাজের ওয়াক্ত`,
          descEn: `Time for ${prayer.label} prayer`,
          descBn: `${prayer.labelBn} নামাজের সময় হয়েছে`,
        };

        const channelId =
          prayerMode === 'alarm' ? 'prayer-alarm' : prayerMode === 'silent' ? 'prayer-silent' : 'prayer-adhan';
        const hasSound = prayerMode !== 'silent';

        const timingSuffix =
          offsetMinutes > 0
            ? ` (${offsetMinutes}m reminder · Prayer at ${formatTime(prayer.time)})`
            : ` · ${formatTime(prayer.time)}`;

        await Notifications.scheduleNotificationAsync({
          identifier: `prayer-${prayer.name}-day-${dayOffset}`,
          content: {
            title: prayerMode === 'alarm' ? `🕌 ⏰ ${info.en}` : `🕌 ${info.en}`,
            body: `${info.bn}${timingSuffix} — ${info.descBn}`,
            sound: hasSound,
            priority:
              prayerMode === 'alarm'
                ? Notifications.AndroidNotificationPriority.MAX
                : Notifications.AndroidNotificationPriority.HIGH,
            ...(Platform.OS === 'android' ? { channelId } : {}),
            data: {
              prayer: prayer.name,
              time: prayer.time.toISOString(),
              triggerTime: targetTriggerTime.toISOString(),
              offsetMinutes,
              mode: prayerMode,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: targetTriggerTime,
          },
        });
        count++;
      }
    }
  }

  return { scheduledCount: count };
}

/**
 * Triggers an instant test alarm in `seconds` (default 5s) to let the user test sound/vibration
 */
export async function scheduleTestAlarm(
  seconds = 5,
  mode: PrayerAlertMode = 'alarm'
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  await setupNotificationChannels();

  const channelId =
    mode === 'alarm' ? 'prayer-alarm' : mode === 'silent' ? 'prayer-silent' : 'prayer-adhan';
  const hasSound = mode !== 'silent';

  return await Notifications.scheduleNotificationAsync({
    identifier: `test-alarm-${Date.now()}`,
    content: {
      title: '⏰ Muslim Life Alarm Test',
      body: `Test alarm triggered successfully with sound & vibration! Mode: ${mode.toUpperCase()}`,
      sound: hasSound,
      priority: Notifications.AndroidNotificationPriority.MAX,
      ...(Platform.OS === 'android' ? { channelId } : {}),
      data: { type: 'test' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  });
}

/**
 * Returns all currently scheduled notification requests
 */
export async function getScheduledPrayerAlarms(): Promise<Notifications.NotificationRequest[]> {
  if (Platform.OS === 'web') return [];
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch {
    return [];
  }
}

// Backward compatibility alias
export async function schedulePrayerNotifications(
  prayers: PrayerTime[],
  options?: { playSound?: boolean }
): Promise<void> {
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
