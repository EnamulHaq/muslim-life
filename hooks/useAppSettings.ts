import { useCallback, useEffect, useState } from 'react';
import { isStorageAvailable, safeGetItem, safeSetItem } from '@/utils/storage';

export type AppLanguage = 'bn' | 'en';
export type CalculationMethodKey =
  | 'MuslimWorldLeague'
  | 'Karachi'
  | 'Egyptian'
  | 'UmmAlQura'
  | 'NorthAmerica';
export type AsrMethodKey = 'Hanafi' | 'Shafi';

export type PrayerAlertMode = 'alarm' | 'adhan' | 'silent' | 'off';

export type AppSettings = {
  language: AppLanguage;
  calculationMethod: CalculationMethodKey;
  asrMethod: AsrMethodKey;
  prayerNotifications: boolean;
  adhanSound: boolean;
  fajrAlarm: boolean;
  tahajjudAlarm: boolean;
  tahajjudOffsetMinutes: number; // e.g., 45 minutes before Fajr
  prayerAlerts: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    tahajjud: boolean;
    sunrise: boolean;
  };
  prayerAlertModes?: {
    fajr?: PrayerAlertMode;
    sunrise?: PrayerAlertMode;
    dhuhr?: PrayerAlertMode;
    asr?: PrayerAlertMode;
    maghrib?: PrayerAlertMode;
    isha?: PrayerAlertMode;
    tahajjud?: PrayerAlertMode;
  };
  prayerAlertOffsets?: {
    fajr?: number; // minutes before
    sunrise?: number;
    dhuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
    tahajjud?: number;
  };
  darkMode: boolean;
};

const STORAGE_KEY = '@muslim-life/settings';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'bn',
  calculationMethod: 'MuslimWorldLeague',
  asrMethod: 'Hanafi',
  prayerNotifications: true,
  adhanSound: true,
  fajrAlarm: true,
  tahajjudAlarm: true,
  tahajjudOffsetMinutes: 45,
  prayerAlerts: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    tahajjud: true,
    sunrise: false,
  },
  prayerAlertModes: {
    fajr: 'alarm',
    sunrise: 'off',
    dhuhr: 'adhan',
    asr: 'adhan',
    maghrib: 'adhan',
    isha: 'adhan',
    tahajjud: 'alarm',
  },
  prayerAlertOffsets: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
    tahajjud: 45,
  },
  darkMode: false,
};

export const CALCULATION_METHODS: Record<CalculationMethodKey, string> = {
  MuslimWorldLeague: 'Muslim World League',
  Karachi: 'University of Islamic Sciences, Karachi',
  Egyptian: 'Egyptian General Authority',
  UmmAlQura: 'Umm Al-Qura, Makkah',
  NorthAmerica: 'ISNA (North America)',
};

export const ASR_METHODS: Record<AsrMethodKey, string> = {
  Hanafi: 'Hanafi',
  Shafi: "Shafi'i / Standard",
};

export const LANGUAGES: Record<AppLanguage, string> = {
  bn: 'বাংলা',
  en: 'English',
};

let cachedSettings = DEFAULT_SETTINGS;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(cachedSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setSettings({ ...cachedSettings });
    listeners.add(sync);

    if (!isStorageAvailable()) {
      setLoaded(true);
      return () => {
        listeners.delete(sync);
      };
    }

    safeGetItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          cachedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
          setSettings(cachedSettings);
        }
      })
      .finally(() => setLoaded(true));

    return () => {
      listeners.delete(sync);
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    cachedSettings = { ...cachedSettings, ...patch };
    setSettings(cachedSettings);
    notifyListeners();
    if (isStorageAvailable()) {
      await safeSetItem(STORAGE_KEY, JSON.stringify(cachedSettings));
    }
  }, []);

  return { settings, loaded, updateSettings };
}
