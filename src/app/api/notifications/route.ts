import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock notifications data (replace with actual database integration)
let mockNotifications = [
  {
    id: '1',
    title: 'New Property Match',
    message: 'A new property matching your search criteria is now available.',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '2',
    title: 'Price Drop Alert',
    message: 'A property in your favorites list has reduced its price.',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    title: 'Viewing Scheduled',
    message: 'Your property viewing has been confirmed for tomorrow.',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Sort notifications by date (newest first) and read status
    const sortedNotifications = [...mockNotifications].sort((a, b) => {
      if (a.isRead === b.isRead) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isRead ? 1 : -1;
    });

    return NextResponse.json(sortedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
