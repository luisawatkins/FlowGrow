'use client';

import { useEffect } from 'react';
import { offlineManager } from '@/lib/offlineManager';
import { pushNotificationService } from '@/lib/pushNotificationService';

const PWAInitializer: React.FC = () => {
  useEffect(() => {
    const initializePWA = async () => {
      try {
        // Register service worker
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });
          
          console.log('Service Worker registered successfully:', registration);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  console.log('New content is available, please refresh.');
                }
              });
            }
          });
        }

        // Initialize offline manager
        await offlineManager.init();
        console.log('Offline manager initialized');

        // Initialize push notification service
        await pushNotificationService.init();
        console.log('Push notification service initialized');

        // Request notification permission on first visit
        const hasRequestedPermission = localStorage.getItem('notification-permission-requested');
        if (!hasRequestedPermission) {
          const permission = await pushNotificationService.requestPermission();
          localStorage.setItem('notification-permission-requested', 'true');
          
          if (permission === 'granted') {
            await pushNotificationService.subscribe();
            console.log('User subscribed to push notifications');
          }
        }

        // Register background sync
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          await offlineManager.registerBackgroundSync('property-sync');
          await offlineManager.registerBackgroundSync('favorites-sync');
          console.log('Background sync registered');
        }

        // Handle online/offline events
        const handleOnline = () => {
          console.log('App is back online');
          // Trigger sync when back online
          offlineManager.triggerBackgroundSync();
        };

        const handleOffline = () => {
          console.log('App is offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };

      } catch (error) {
        console.error('Failed to initialize PWA:', error);
      }
    };

    initializePWA();
  }, []);

  // This component doesn't render anything
  return null;
};

export default PWAInitializer;
