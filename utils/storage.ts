export function isStorageAvailable(): boolean {
  return typeof window !== 'undefined';
}
