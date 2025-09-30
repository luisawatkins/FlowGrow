import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export interface Notification {
  id: string;
  userId: string;
  type: 'property_update' | 'price_change' | 'new_message' | 'inquiry' | 'system';
  title: string;
  message: string;
  propertyId?: string;
  isRead: boolean;
  createdAt: string;
}

// Mock database for notifications
const notifications = new Map<string, Notification[]>();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const userNotifications = notifications.get(userId) || [];

    // Sort notifications by date (newest first)
    const sortedNotifications = [...userNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ notifications: sortedNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { type, title, message, propertyId } = await request.json();

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      title,
      message,
      propertyId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const userNotifications = notifications.get(userId) || [];
    userNotifications.push(notification);
    notifications.set(userId, userNotifications);

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}