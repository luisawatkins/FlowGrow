import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user profile data (replace with actual database integration)
let mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  avatarUrl: 'https://example.com/avatar.jpg',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update mock profile (replace with actual database update)
    mockProfile = {
      ...mockProfile,
      ...updates,
    };
    
    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
