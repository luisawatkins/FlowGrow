import { useState, useEffect } from 'react';

interface NotificationSettings {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  notifications: NotificationSettings;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    try {
      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      const data = await response.json();
      setProfile(prev => prev ? { ...prev, notifications: data } : null);
      return data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  return {
    profile,
    isLoading,
    updateProfile,
    updateNotificationSettings,
  };
}
