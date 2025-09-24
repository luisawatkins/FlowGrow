/**
 * Push Notification Service for FlowGrow PWA
 * Handles push notification registration, sending, and management
 */

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PushNotificationService {
  private vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
  private isSupported = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  async init(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error('Failed to initialize push notification service:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  async getPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    return Notification.permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.registration) {
      return null;
    }

    try {
      const existingSubscription = await this.registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Existing push subscription found');
        return existingSubscription;
      }

      if (!this.vapidPublicKey) {
        console.warn('VAPID public key not configured');
        return null;
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log('New push subscription created');
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.isSupported || !this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Push subscription removed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.registration) {
      return null;
    }

    try {
      return await this.registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || !this.registration) {
      return;
    }

    try {
      await this.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/badge-72x72.png',
        image: payload.image,
        data: payload.data,
        actions: payload.actions,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        tag: payload.tag,
        vibrate: [200, 100, 200],
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async sendPropertyNotification(property: {
    id: string;
    title: string;
    price: number;
    location: string;
    image?: string;
  }): Promise<void> {
    const payload: NotificationPayload = {
      title: 'New Property Available!',
      body: `${property.title} in ${property.location} - $${property.price.toLocaleString()}`,
      icon: '/icons/icon-192x192.png',
      image: property.image,
      data: {
        type: 'property',
        propertyId: property.id,
        url: `/property/${property.id}`
      },
      actions: [
        {
          action: 'view',
          title: 'View Property',
          icon: '/icons/action-view.png'
        },
        {
          action: 'favorite',
          title: 'Add to Favorites',
          icon: '/icons/action-favorite.png'
        }
      ],
      tag: `property-${property.id}`
    };

    await this.sendNotification(payload);
  }

  async sendAuctionNotification(auction: {
    id: string;
    propertyTitle: string;
    currentBid: number;
    timeRemaining: number;
  }): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Auction Update',
      body: `${auction.propertyTitle} - Current bid: $${auction.currentBid.toLocaleString()}`,
      icon: '/icons/icon-192x192.png',
      data: {
        type: 'auction',
        auctionId: auction.id,
        url: `/auction/${auction.id}`
      },
      actions: [
        {
          action: 'bid',
          title: 'Place Bid',
          icon: '/icons/action-bid.png'
        },
        {
          action: 'view',
          title: 'View Auction',
          icon: '/icons/action-view.png'
        }
      ],
      tag: `auction-${auction.id}`,
      requireInteraction: true
    };

    await this.sendNotification(payload);
  }

  async sendPortfolioNotification(portfolio: {
    id: string;
    name: string;
    performance: number;
  }): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Portfolio Update',
      body: `${portfolio.name} performance: ${portfolio.performance > 0 ? '+' : ''}${portfolio.performance.toFixed(2)}%`,
      icon: '/icons/icon-192x192.png',
      data: {
        type: 'portfolio',
        portfolioId: portfolio.id,
        url: `/portfolio/${portfolio.id}`
      },
      actions: [
        {
          action: 'view',
          title: 'View Portfolio',
          icon: '/icons/action-view.png'
        }
      ],
      tag: `portfolio-${portfolio.id}`
    };

    await this.sendNotification(payload);
  }

  async sendMarketUpdateNotification(): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Market Update',
      body: 'New market trends and insights available',
      icon: '/icons/icon-192x192.png',
      data: {
        type: 'market',
        url: '/market-trends'
      },
      actions: [
        {
          action: 'view',
          title: 'View Trends',
          icon: '/icons/action-trends.png'
        }
      ],
      tag: 'market-update'
    };

    await this.sendNotification(payload);
  }

  // Schedule notifications for future delivery
  async scheduleNotification(payload: NotificationPayload, delay: number): Promise<void> {
    setTimeout(() => {
      this.sendNotification(payload);
    }, delay);
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    if (!this.isSupported || !this.registration) {
      return;
    }

    try {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  // Clear notifications by tag
  async clearNotificationsByTag(tag: string): Promise<void> {
    if (!this.isSupported || !this.registration) {
      return;
    }

    try {
      const notifications = await this.registration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());
    } catch (error) {
      console.error('Failed to clear notifications by tag:', error);
    }
  }

  // Get notification settings from user preferences
  async getNotificationSettings(): Promise<{
    propertyUpdates: boolean;
    auctionUpdates: boolean;
    portfolioUpdates: boolean;
    marketUpdates: boolean;
  }> {
    const settings = {
      propertyUpdates: true,
      auctionUpdates: true,
      portfolioUpdates: true,
      marketUpdates: false
    };

    try {
      const stored = localStorage.getItem('notification-settings');
      if (stored) {
        return { ...settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }

    return settings;
  }

  // Save notification settings
  async saveNotificationSettings(settings: {
    propertyUpdates: boolean;
    auctionUpdates: boolean;
    portfolioUpdates: boolean;
    marketUpdates: boolean;
  }): Promise<void> {
    try {
      localStorage.setItem('notification-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }

  // Utility method to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Get subscription data for server registration
  async getSubscriptionData(): Promise<PushSubscriptionData | null> {
    const subscription = await this.getSubscription();
    if (!subscription) {
      return null;
    }

    const p256dh = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');

    if (!p256dh || !auth) {
      return null;
    }

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(p256dh),
        auth: this.arrayBufferToBase64(auth)
      }
    };
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService();

// Initialize on module load
if (typeof window !== 'undefined') {
  pushNotificationService.init().catch(console.error);
}

export default pushNotificationService;
