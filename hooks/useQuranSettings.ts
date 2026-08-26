import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_RECITER_ID,
  QURAN_RECITERS,
  type Reciter,
} from '@/constants/audio';
import { isStorageAvailable, safeGetItem, safeSetItem } from '@/utils/storage';

export type QuranScriptType = 'uthmani' | 'indopak' | 'tajweed';

export type QuranFontStyle =
  | 'King Fahad Complex'
  | 'Madani'
  | 'IndoPak'
  | 'Amiri'
  | 'Scheherazade';

export type IndoPakLines = '16 Lines' | '15 Lines' | '13 Lines';

export type QuranSettings = {
  scriptType: QuranScriptType;
  fontStyle: QuranFontStyle;
  indopakLines: IndoPakLines;
  showTajweedRules: boolean;
  copyAsGlyphs: boolean;
  fontSize: number; // 1 - 7 (default 4)
  selectedReciterId: number;
};

const STORAGE_KEY = '@muslim-life/quran-settings';

export const DEFAULT_QURAN_SETTINGS: QuranSettings = {
  scriptType: 'tajweed',
  fontStyle: 'King Fahad Complex',
  indopakLines: '16 Lines',
  showTajweedRules: true,
  copyAsGlyphs: false,
  fontSize: 4,
  selectedReciterId: DEFAULT_RECITER_ID,
};

export const FONT_STYLES: QuranFontStyle[] = [
  'King Fahad Complex',
  'Madani',
  'IndoPak',
  'Amiri',
  'Scheherazade',
];

export const INDOPAK_LINES: IndoPakLines[] = ['16 Lines', '15 Lines', '13 Lines'];

let cachedQuranSettings = DEFAULT_QURAN_SETTINGS;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function useQuranSettings() {
  const [settings, setSettings] = useState<QuranSettings>(cachedQuranSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setSettings({ ...cachedQuranSettings });
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
          cachedQuranSettings = { ...DEFAULT_QURAN_SETTINGS, ...JSON.parse(raw) };
          setSettings(cachedQuranSettings);
        }
      })
      .finally(() => setLoaded(true));

    return () => {
      listeners.delete(sync);
    };
  }, []);

  const updateQuranSettings = useCallback(async (patch: Partial<QuranSettings>) => {
    cachedQuranSettings = { ...cachedQuranSettings, ...patch };
    setSettings(cachedQuranSettings);
    notifyListeners();
    if (isStorageAvailable()) {
      await safeSetItem(STORAGE_KEY, JSON.stringify(cachedQuranSettings));
    }
  }, []);

  const activeReciter: Reciter =
    QURAN_RECITERS.find((r) => r.id === settings.selectedReciterId) ?? QURAN_RECITERS[0];

  return {
    quranSettings: settings,
    activeReciter,
    loaded,
    updateQuranSettings,
  };
}
