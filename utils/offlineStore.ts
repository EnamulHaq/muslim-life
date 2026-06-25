import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const CACHE_DIR_NAME = 'reading-cache';
const META_KEY = '@muslim-life/offline-sync-meta';

export type OfflineSyncMeta = {
  completedAt?: string;
  quranReady: boolean;
  duaReady: boolean;
  hadithReady: boolean;
  tafsirReady: boolean;
};

const DEFAULT_META: OfflineSyncMeta = {
  quranReady: false,
  duaReady: false,
  hadithReady: false,
  tafsirReady: false,
};

function getCacheDir(): string | null {
  if (Platform.OS === 'web' || !FileSystem.documentDirectory) return null;
  return `${FileSystem.documentDirectory}${CACHE_DIR_NAME}/`;
}

function cacheFilePath(key: string): string {
  const safe = key.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${getCacheDir()}${safe}.json`;
}

async function ensureCacheDir(): Promise<void> {
  const dir = getCacheDir();
  if (!dir) return;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const dir = getCacheDir();
    if (dir) {
      const path = cacheFilePath(key);
      const info = await FileSystem.getInfoAsync(path);
      if (!info.exists) return null;
      const raw = await FileSystem.readAsStringAsync(path);
      return JSON.parse(raw) as T;
    }
    const raw = await AsyncStorage.getItem(`reading:${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  const raw = JSON.stringify(data);
  const dir = getCacheDir();
  if (dir) {
    await ensureCacheDir();
    await FileSystem.writeAsStringAsync(cacheFilePath(key), raw);
    return;
  }
  await AsyncStorage.setItem(`reading:${key}`, raw);
}

export async function hasCache(key: string): Promise<boolean> {
  try {
    const dir = getCacheDir();
    if (dir) {
      const info = await FileSystem.getInfoAsync(cacheFilePath(key));
      return info.exists;
    }
    return (await AsyncStorage.getItem(`reading:${key}`)) !== null;
  } catch {
    return false;
  }
}

export async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    const fresh = await fetcher();
    await writeCache(key, fresh).catch(() => {});
    return fresh;
  } catch (err) {
    const cached = await readCache<T>(key);
    if (cached !== null) return cached;
    throw err;
  }
}

export async function readSyncMeta(): Promise<OfflineSyncMeta> {
  try {
    const raw = await AsyncStorage.getItem(META_KEY);
    if (raw) return { ...DEFAULT_META, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return { ...DEFAULT_META };
}

export async function writeSyncMeta(meta: OfflineSyncMeta): Promise<void> {
  await AsyncStorage.setItem(META_KEY, JSON.stringify(meta));
}

export function isOfflineReady(meta: OfflineSyncMeta): boolean {
  return meta.quranReady && meta.duaReady && meta.hadithReady;
}
