export interface PropertyNotification {
  id: string;
  userId: string;
  propertyId?: string;
  type: 'price_change' | 'new_listing' | 'status_update' | 'viewing_reminder' | 'market_alert' | 'favorite_update';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  priceAlerts: boolean;
  newListings: boolean;
  statusUpdates: boolean;
  viewingReminders: boolean;
  marketAlerts: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationFilter {
  userId?: string;
  type?: string;
  isRead?: boolean;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationAnalytics {
  totalNotifications: number;
  unreadCount: number;
  notificationsByType: Record<string, number>;
  notificationsByPriority: Record<string, number>;
  readRate: number;
  averageReadTime: number;
  userEngagement: Array<{ date: string; notifications: number }>;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  title: string;
  message: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
