'use client';

import { useState, useEffect } from 'react';
import { offlineManager } from '@/lib/offlineManager';
import { pushNotificationService } from '@/lib/pushNotificationService';

interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  hasNotificationPermission: boolean;
  isServiceWorkerReady: boolean;
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isOnline: true,
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    hasNotificationPermission: false,
    isServiceWorkerReady: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Initialize PWA features
    const initializePWA = async () => {
      try {
        // Check online status
        const isOnline = navigator.onLine;
        
        // Check if app is installed/standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
        const isInstalled = isStandalone || isInStandaloneMode;

        // Check service worker status
        let isServiceWorkerReady = false;
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            isServiceWorkerReady = !!registration;
          } catch (error) {
            console.error('Service worker not ready:', error);
          }
        }

        // Check notification permission
        const notificationPermission = await pushNotificationService.getPermission();
        const hasNotificationPermission = notificationPermission === 'granted';

        // Initialize offline manager
        await offlineManager.init();

        setStatus({
          isOnline,
          isInstalled,
          isStandalone: isStandalone || isInStandaloneMode,
          canInstall: false, // Will be updated by beforeinstallprompt
          hasNotificationPermission,
          isServiceWorkerReady,
        });
      } catch (error) {
        console.error('Failed to initialize PWA:', error);
      }
    };

    initializePWA();

    // Listen for online/offline events
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus(prev => ({ ...prev, canInstall: true }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setStatus(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false 
      }));
      setDeferredPrompt(null);
    };

    // Listen for display mode changes
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setStatus(prev => ({ 
        ...prev, 
        isStandalone: e.matches,
        isInstalled: e.matches 
      }));
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    displayModeQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      displayModeQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setStatus(prev => ({ ...prev, canInstall: false }));
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      setStatus(prev => ({ 
        ...prev, 
        hasNotificationPermission: permission === 'granted' 
      }));
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const subscription = await pushNotificationService.subscribe();
      return !!subscription;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return false;
    }
  };

  const registerBackgroundSync = async () => {
    try {
      await offlineManager.registerBackgroundSync('property-sync');
      await offlineManager.registerBackgroundSync('favorites-sync');
      return true;
    } catch (error) {
      console.error('Error registering background sync:', error);
      return false;
    }
  };

  const getStorageInfo = async () => {
    try {
      return await offlineManager.getStorageUsage();
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0 };
    }
  };

  const clearOfflineData = async () => {
    try {
      await offlineManager.clearAllData();
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  };

  return {
    status,
    installApp,
    requestNotificationPermission,
    subscribeToNotifications,
    registerBackgroundSync,
    getStorageInfo,
    clearOfflineData,
    isOnline: status.isOnline,
    isInstalled: status.isInstalled,
    isStandalone: status.isStandalone,
    canInstall: status.canInstall,
    hasNotificationPermission: status.hasNotificationPermission,
    isServiceWorkerReady: status.isServiceWorkerReady,
  };
};

export default usePWA;
