import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock notifications from parent route
declare const mockNotifications: any[];

export async function PUT(request: NextRequest) {
  try {
    // Mark all notifications as read
    mockNotifications.forEach(notification => {
      notification.isRead = true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}
