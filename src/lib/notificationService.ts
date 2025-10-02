import { PropertyNotification, NotificationSettings, NotificationFilter, NotificationAnalytics } from '../types/notifications';

class NotificationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async getNotifications(filter?: NotificationFilter): Promise<PropertyNotification[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.userId) params.append('userId', filter.userId);
      if (filter?.type) params.append('type', filter.type);
      if (filter?.isRead !== undefined) params.append('isRead', filter.isRead.toString());
      if (filter?.priority) params.append('priority', filter.priority);

      const response = await fetch(`${this.baseUrl}/notifications?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markAsRead(id: string): Promise<PropertyNotification> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete notification: ${response.statusText}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/settings/${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch notification settings: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error(`Failed to update notification settings: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  async getNotificationAnalytics(userId: string): Promise<NotificationAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/analytics?userId=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch notification analytics: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notification analytics:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();