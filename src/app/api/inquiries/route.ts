import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export interface PropertyInquiry {
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredContactMethod: 'email' | 'phone';
  preferredViewingTime?: string;
  isPreApproved?: boolean;
}

// Mock database for inquiries
const inquiries = new Map<string, PropertyInquiry[]>();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const inquiry: PropertyInquiry = await request.json();

    // Validate required fields
    const requiredFields = ['propertyId', 'name', 'email', 'message', 'preferredContactMethod'];
    for (const field of requiredFields) {
      if (!inquiry[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiry.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (inquiry.phone) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(inquiry.phone)) {
        return NextResponse.json(
          { error: 'Invalid phone format' },
          { status: 400 }
        );
      }
    }

    // Store the inquiry
    const propertyInquiries = inquiries.get(inquiry.propertyId) || [];
    propertyInquiries.push({
      ...inquiry,
      // Add user info if available
      ...(session?.user && {
        userId: (session.user as any).id,
        userEmail: session.user.email,
      }),
    });
    inquiries.set(inquiry.propertyId, propertyInquiries);

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Create notification for property owner
    // 4. Schedule viewing if requested

    return NextResponse.json({
      message: 'Inquiry submitted successfully',
      inquiryId: Math.random().toString(36).substr(2, 9),
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}