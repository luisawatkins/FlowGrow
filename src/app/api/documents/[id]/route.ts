import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockDocuments: Map<string, any[]>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Find and update document
    let updatedDocument = null;
    mockDocuments.forEach((documents, propertyId) => {
      const documentIndex = documents.findIndex(doc => doc.id === params.id);
      if (documentIndex !== -1) {
        documents[documentIndex] = {
          ...documents[documentIndex],
          name,
        };
        updatedDocument = documents[documentIndex];
      }
    });

    if (!updatedDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find and remove document
    let documentRemoved = false;
    mockDocuments.forEach((documents, propertyId) => {
      const documentIndex = documents.findIndex(doc => doc.id === params.id);
      if (documentIndex !== -1) {
        documents.splice(documentIndex, 1);
        documentRemoved = true;
      }
    });

    if (!documentRemoved) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
