import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock notification settings (replace with actual database integration)
let mockNotificationSettings = {
  email: true,
  push: true,
  sms: false,
};

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update mock settings (replace with actual database update)
    mockNotificationSettings = {
      ...mockNotificationSettings,
      ...updates,
    };
    
    return NextResponse.json(mockNotificationSettings);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    );
  }
}
