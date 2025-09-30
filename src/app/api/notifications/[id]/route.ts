import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock notifications from parent route
declare const mockNotifications: any[];

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationIndex = mockNotifications.findIndex(
      n => n.id === params.id
    );

    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Remove notification from mock data
    mockNotifications.splice(notificationIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notification = mockNotifications.find(n => n.id === params.id);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Mark notification as read
    notification.isRead = true;

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
