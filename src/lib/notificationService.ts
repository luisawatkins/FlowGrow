import {
  Notification,
  NotificationListResponse,
  NotificationResponse,
  NotificationType,
  NotificationPriority,
  PriceAlert,
  Wishlist
} from '@/types/wishlist';

class NotificationService {
  private notifications: Notification[] = [];
  private nextId = 1;

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<NotificationResponse> {
    try {
      const notification: Notification = {
        id: `notification-${this.nextId++}`,
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date(),
        priority
      };

      this.notifications.push(notification);

      // In a real implementation, this would trigger actual notifications
      await this.sendNotification(notification);

      return {
        notification,
        success: true,
        message: 'Notification created successfully'
      };
    } catch (error) {
      return {
        notification: null as any,
        success: false,
        message: 'Failed to create notification'
      };
    }
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20,
    unreadOnly = false
  ): Promise<NotificationListResponse> {
    try {
      let userNotifications = this.notifications.filter(n => n.userId === userId);
      
      if (unreadOnly) {
        userNotifications = userNotifications.filter(n => !n.isRead);
      }

      // Sort by creation date (newest first)
      userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

      const unreadCount = this.notifications.filter(n => n.userId === userId && !n.isRead).length;

      return {
        notifications: paginatedNotifications,
        total: userNotifications.length,
        page,
        limit,
        unreadCount
      };
    } catch (error) {
      return {
        notifications: [],
        total: 0,
        page,
        limit,
        unreadCount: 0
      };
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse> {
    try {
      const notification = this.notifications.find(n => n.id === notificationId && n.userId === userId);
      
      if (!notification) {
        return {
          notification: null as any,
          success: false,
          message: 'Notification not found'
        };
      }

      notification.isRead = true;
      notification.readAt = new Date();

      return {
        notification,
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      return {
        notification: null as any,
        success: false,
        message: 'Failed to mark notification as read'
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const userNotifications = this.notifications.filter(n => n.userId === userId && !n.isRead);
      
      userNotifications.forEach(notification => {
        notification.isRead = true;
        notification.readAt = new Date();
      });

      return {
        success: true,
        message: `${userNotifications.length} notifications marked as read`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to mark notifications as read'
      };
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<NotificationResponse> {
    try {
      const notificationIndex = this.notifications.findIndex(n => n.id === notificationId && n.userId === userId);
      
      if (notificationIndex === -1) {
        return {
          notification: null as any,
          success: false,
          message: 'Notification not found'
        };
      }

      const notification = this.notifications[notificationIndex];
      this.notifications.splice(notificationIndex, 1);

      return {
        notification,
        success: true,
        message: 'Notification deleted successfully'
      };
    } catch (error) {
      return {
        notification: null as any,
        success: false,
        message: 'Failed to delete notification'
      };
    }
  }

  /**
   * Create price alert notification
   */
  async createPriceAlertNotification(
    userId: string,
    alert: PriceAlert,
    propertyTitle: string,
    priceChange: { oldPrice: number; newPrice: number; changePercentage: number }
  ): Promise<NotificationResponse> {
    const title = `Price Alert: ${propertyTitle}`;
    const changeType = priceChange.changePercentage > 0 ? 'increased' : 'decreased';
    const changeAmount = Math.abs(priceChange.changePercentage).toFixed(1);
    
    let message = `The price of ${propertyTitle} has ${changeType} by ${changeAmount}% `;
    message += `from ${this.formatCurrency(priceChange.oldPrice)} to ${this.formatCurrency(priceChange.newPrice)}.`;

    return this.createNotification(
      userId,
      NotificationType.PRICE_ALERT,
      title,
      message,
      {
        alertId: alert.id,
        propertyId: alert.propertyId,
        priceChange,
        alertType: alert.type
      },
      NotificationPriority.HIGH
    );
  }

  /**
   * Create wishlist update notification
   */
  async createWishlistUpdateNotification(
    userId: string,
    wishlist: Wishlist,
    updateType: 'property_added' | 'property_removed' | 'wishlist_updated',
    propertyTitle?: string
  ): Promise<NotificationResponse> {
    let title = `Wishlist Update: ${wishlist.name}`;
    let message = '';

    switch (updateType) {
      case 'property_added':
        message = `${propertyTitle} has been added to your wishlist.`;
        break;
      case 'property_removed':
        message = `${propertyTitle} has been removed from your wishlist.`;
        break;
      case 'wishlist_updated':
        message = 'Your wishlist has been updated.';
        break;
    }

    return this.createNotification(
      userId,
      NotificationType.WISHLIST_UPDATE,
      title,
      message,
      {
        wishlistId: wishlist.id,
        updateType,
        propertyTitle
      },
      NotificationPriority.MEDIUM
    );
  }

  /**
   * Create property status change notification
   */
  async createPropertyStatusChangeNotification(
    userId: string,
    propertyTitle: string,
    oldStatus: string,
    newStatus: string,
    propertyId: string
  ): Promise<NotificationResponse> {
    const title = `Property Status Update: ${propertyTitle}`;
    const message = `The status of ${propertyTitle} has changed from ${oldStatus} to ${newStatus}.`;

    return this.createNotification(
      userId,
      NotificationType.PROPERTY_STATUS_CHANGE,
      title,
      message,
      {
        propertyId,
        oldStatus,
        newStatus
      },
      NotificationPriority.HIGH
    );
  }

  /**
   * Create market update notification
   */
  async createMarketUpdateNotification(
    userId: string,
    marketData: {
      location: string;
      averagePriceChange: number;
      marketTrend: 'up' | 'down' | 'stable';
      newListings: number;
    }
  ): Promise<NotificationResponse> {
    const title = `Market Update: ${marketData.location}`;
    const trendText = marketData.marketTrend === 'up' ? 'increased' : 
                     marketData.marketTrend === 'down' ? 'decreased' : 'remained stable';
    const message = `The average property price in ${marketData.location} has ${trendText} by ${Math.abs(marketData.averagePriceChange).toFixed(1)}%. ${marketData.newListings} new listings were added.`;

    return this.createNotification(
      userId,
      NotificationType.MARKET_UPDATE,
      title,
      message,
      marketData,
      NotificationPriority.LOW
    );
  }

  /**
   * Send notification through various channels
   */
  private async sendNotification(notification: Notification): Promise<void> {
    try {
      // In a real implementation, this would send notifications through:
      // - Email service (SendGrid, AWS SES, etc.)
      // - Push notification service (Firebase, OneSignal, etc.)
      // - SMS service (Twilio, AWS SNS, etc.)
      // - In-app notification system
      // - WebSocket for real-time updates

      console.log('Sending notification:', {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority
      });

      // Mock sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  /**
   * Check for price alerts and trigger notifications
   */
  async checkPriceAlerts(alerts: PriceAlert[], properties: any[]): Promise<void> {
    for (const alert of alerts) {
      if (!alert.isActive) continue;

      const property = properties.find(p => p.id === alert.propertyId);
      if (!property) continue;

      const currentPrice = property.price;
      const shouldTrigger = this.shouldTriggerAlert(alert, currentPrice);

      if (shouldTrigger) {
        const priceChange = {
          oldPrice: alert.currentPrice,
          newPrice: currentPrice,
          changePercentage: ((currentPrice - alert.currentPrice) / alert.currentPrice) * 100
        };

        await this.createPriceAlertNotification(
          alert.userId,
          alert,
          property.title,
          priceChange
        );

        // Update alert
        alert.currentPrice = currentPrice;
        alert.triggeredAt = new Date();
      }
    }
  }

  /**
   * Determine if an alert should be triggered
   */
  private shouldTriggerAlert(alert: PriceAlert, currentPrice: number): boolean {
    const priceChange = ((currentPrice - alert.currentPrice) / alert.currentPrice) * 100;
    const absoluteChange = Math.abs(currentPrice - alert.currentPrice);

    switch (alert.type) {
      case 'price_drop':
        return priceChange < 0 && Math.abs(priceChange) >= (alert.conditions.percentageThreshold || 5);
      
      case 'price_increase':
        return priceChange > 0 && priceChange >= (alert.conditions.percentageThreshold || 5);
      
      case 'price_target':
        return currentPrice <= alert.targetPrice;
      
      case 'any_change':
        return Math.abs(priceChange) >= (alert.conditions.percentageThreshold || 1);
      
      default:
        return false;
    }
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: { [key: string]: number };
    byPriority: { [key: string]: number };
  }> {
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    
    const byType: { [key: string]: number } = {};
    const byPriority: { [key: string]: number } = {};
    
    userNotifications.forEach(notification => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byPriority[notification.priority] = (byPriority[notification.priority] || 0) + 1;
    });

    return {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.isRead).length,
      byType,
      byPriority
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
