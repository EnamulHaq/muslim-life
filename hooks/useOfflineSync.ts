import { useCallback, useEffect, useState } from 'react';
import {
  getSyncState,
  subscribeSync,
  syncAllReadingContent,
  type SyncState,
} from '@/services/offlineSync';
import { isOfflineReady, readSyncMeta, type OfflineSyncMeta } from '@/utils/offlineStore';

export function useOfflineSync() {
  const [syncState, setSyncState] = useState<SyncState>(getSyncState);
  const [meta, setMeta] = useState<OfflineSyncMeta | null>(null);

  const refreshMeta = useCallback(async () => {
    const next = await readSyncMeta();
    setMeta(next);
    return next;
  }, []);

  useEffect(() => {
    refreshMeta();
    return subscribeSync(() => setSyncState({ ...getSyncState() }));
  }, [refreshMeta]);

  const startSync = useCallback(async () => {
    try {
      await syncAllReadingContent();
      await refreshMeta();
    } catch {
      await refreshMeta();
    }
  }, [refreshMeta]);

  return {
    syncState,
    meta,
    ready: meta ? isOfflineReady(meta) : false,
    startSync,
    refreshMeta,
  };
}
