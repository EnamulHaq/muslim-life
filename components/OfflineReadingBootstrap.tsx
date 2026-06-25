import { useEffect } from 'react';
import { isOfflineReady, readSyncMeta } from '@/utils/offlineStore';
import { syncAllReadingContent } from '@/services/offlineSync';

export function OfflineReadingBootstrap() {
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const meta = await readSyncMeta();
      if (cancelled || isOfflineReady(meta)) return;

      syncAllReadingContent().catch(() => {
        // Silent background sync; user can retry from Settings
      });
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
