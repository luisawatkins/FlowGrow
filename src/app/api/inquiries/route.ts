import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock property data (replace with actual database integration)
const mockProperties = new Map([
  ['1', {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    location: 'Downtown',
    agent: {
      name: 'John Smith',
      email: 'john.smith@example.com',
    },
  }],
  ['2', {
    id: '2',
    title: 'Suburban Family Home',
    price: 750000,
    location: 'Suburbs',
    agent: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
  }],
]);

// Mock inquiries storage
const mockInquiries = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      name,
      email,
      phone,
      message,
    } = await request.json();

    // Validate required fields
    if (!propertyId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create new inquiry
    const inquiry = {
      id: Date.now().toString(),
      propertyId,
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store inquiry
    const propertyInquiries = mockInquiries.get(propertyId) || [];
    propertyInquiries.push(inquiry);
    mockInquiries.set(propertyId, propertyInquiries);

    // In a real application, you would:
    // 1. Save the inquiry to the database
    // 2. Send notification emails to the agent and the inquirer
    // 3. Create a task/ticket in your CRM system
    // 4. Track inquiry analytics
    // 5. Implement spam protection and rate limiting

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      inquiry: {
        ...inquiry,
        property: {
          title: property.title,
          location: property.location,
        },
      },
    });
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
