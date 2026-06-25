import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PrayerTime, formatTime } from '@/utils/prayerTimes';

const PRAYER_NOTIFICATION_IDS = [
  'prayer-fajr',
  'prayer-dhuhr',
  'prayer-asr',
  'prayer-maghrib',
  'prayer-isha',
] as const;

const PRAYER_LABELS: Record<string, { en: string; bn: string }> = {
  fajr: { en: 'Fajr', bn: 'ফজর' },
  dhuhr: { en: 'Dhuhr', bn: 'যোহর' },
  asr: { en: 'Asr', bn: 'আসর' },
  maghrib: { en: 'Maghrib', bn: 'মাগরিব' },
  isha: { en: 'Isha', bn: 'এশা' },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelPrayerNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function schedulePrayerNotifications(
  prayers: PrayerTime[],
  options?: { playSound?: boolean }
): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-times', {
      name: 'Prayer Times',
      importance: Notifications.AndroidImportance.HIGH,
      sound: options?.playSound ? 'default' : undefined,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  await cancelPrayerNotifications();

  const fardPrayers = prayers.filter((p) =>
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(p.name)
  );

  const now = new Date();

  for (const prayer of fardPrayers) {
    const labels = PRAYER_LABELS[prayer.name];
    if (!labels) continue;

    let triggerDate = new Date(prayer.time);
    if (triggerDate <= now) {
      triggerDate = new Date(triggerDate);
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      identifier: `prayer-${prayer.name}`,
      content: {
        title: `${labels.en} Prayer Time`,
        body: `${labels.bn} নামাজের সময় হয়েছে · ${formatTime(prayer.time)}`,
        sound: options?.playSound ?? true,
        ...(Platform.OS === 'android' ? { channelId: 'prayer-times' } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  }
}
