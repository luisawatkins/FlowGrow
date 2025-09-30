import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock documents storage (replace with actual database/storage integration)
const mockDocuments = new Map([
  ['1', [
    {
      id: '1',
      name: 'Floor Plan.pdf',
      type: 'pdf',
      size: 1024 * 1024, // 1MB
      url: '/documents/floor-plan.pdf',
      uploadedAt: '2024-01-01T10:00:00Z',
      uploadedBy: 'user1',
    },
    {
      id: '2',
      name: 'Property Photos.zip',
      type: 'zip',
      size: 5 * 1024 * 1024, // 5MB
      url: '/documents/photos.zip',
      uploadedAt: '2024-01-01T11:00:00Z',
      uploadedBy: 'user1',
    },
  ]],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const documents = mockDocuments.get(params.propertyId) || [];
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
