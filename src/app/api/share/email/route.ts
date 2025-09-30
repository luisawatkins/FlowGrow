import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock property data (replace with actual database integration)
const mockProperties = new Map([
  ['1', {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: 'Downtown',
  }],
  ['2', {
    id: '2',
    title: 'Suburban Family Home',
    price: 750000,
    location: 'Suburbs',
  }],
]);

export async function POST(request: NextRequest) {
  try {
    const { propertyId, email } = await request.json();

    if (!propertyId || !email) {
      return NextResponse.json(
        { error: 'Property ID and email are required' },
        { status: 400 }
      );
    }

    const property = mockProperties.get(propertyId);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // In a real application, you would:
    // 1. Validate the email address
    // 2. Use an email service (e.g., SendGrid, AWS SES) to send the email
    // 3. Handle email template rendering
    // 4. Track email sending status
    // 5. Implement rate limiting

    // Mock email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful email sending
    return NextResponse.json({
      success: true,
      message: `Property "${property.title}" shared with ${email}`,
    });
  } catch (error) {
    console.error('Error sharing via email:', error);
    return NextResponse.json(
      { error: 'Failed to share property via email' },
      { status: 500 }
    );
  }
}
