import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockDocuments: Map<string, any[]>;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find document
    let document = null;
    mockDocuments.forEach((documents) => {
      const found = documents.find(doc => doc.id === params.id);
      if (found) document = found;
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // In a real application, you would:
    // 1. Verify user permissions
    // 2. Generate download URL
    // 3. Track download analytics
    // 4. Handle large files
    // 5. Support resumable downloads
    // 6. Apply bandwidth limits

    // Mock file download
    // In reality, you would stream the file from storage
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set(
      'Content-Disposition',
      `attachment; filename="${document.name}"`
    );

    // Return mock file content
    return new NextResponse(
      `Mock content for ${document.name}`,
      { headers }
    );
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
