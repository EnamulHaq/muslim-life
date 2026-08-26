import AsyncStorage from '@react-native-async-storage/async-storage';

export function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' || typeof globalThis !== 'undefined';
}

/**
 * Safely writes to AsyncStorage. If quota is exceeded (e.g. on web localStorage),
 * it prunes large cached items (keys starting with `reading:`) to free up quota.
 */
export async function safeSetItem(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    // QuotaExceededError handling
    if (
      err?.name === 'QuotaExceededError' ||
      err?.message?.includes('quota') ||
      err?.message?.includes('exceeded')
    ) {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const cacheKeys = allKeys.filter((k) => k.startsWith('reading:'));
        if (cacheKeys.length > 0) {
          // Remove cache items to make room for critical settings
          await AsyncStorage.multiRemove(cacheKeys.slice(0, Math.min(cacheKeys.length, 20)));
          await AsyncStorage.setItem(key, value);
          return true;
        }
      } catch {
        // ignore secondary error
      }
    }
    console.warn(`[Storage] Failed to save key "${key}":`, err?.message || err);
    return false;
  }
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to read key "${key}":`, err);
    return null;
  }
}
