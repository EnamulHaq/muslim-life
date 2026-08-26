import { useEffect, useState } from 'react';
import {
  checkForAppUpdate,
  openAppUpdate,
  type AppUpdateInfo,
} from '@/services/appUpdateService';

export function useAppUpdate() {
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    try {
      const info = await checkForAppUpdate();
      if (info && info.hasUpdate) {
        setUpdateInfo(info);
        setShowModal(true);
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Check for updates on startup
    check();
  }, []);

  const handleUpdate = () => {
    if (updateInfo) {
      openAppUpdate(updateInfo);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  return {
    updateInfo,
    showModal,
    checking,
    checkUpdate: check,
    handleUpdate,
    handleDismiss,
  };
}
