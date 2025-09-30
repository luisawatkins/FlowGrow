import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export interface Document {
  id: string;
  propertyId?: string;
  userId: string;
  name: string;
  type: 'contract' | 'inspection' | 'appraisal' | 'mortgage' | 'other';
  status: 'draft' | 'pending' | 'signed' | 'expired';
  url: string;
  size: number;
  sharedWith: {
    userId: string;
    email: string;
    role: 'viewer' | 'signer';
    status: 'pending' | 'viewed' | 'signed';
  }[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// Mock database for documents
const documents = new Map<string, Document[]>();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const userId = (session.user as any).id;
    let userDocuments = documents.get(userId) || [];

    // Apply filters
    if (propertyId) {
      userDocuments = userDocuments.filter((doc) => doc.propertyId === propertyId);
    }
    if (type) {
      userDocuments = userDocuments.filter((doc) => doc.type === type);
    }
    if (status) {
      userDocuments = userDocuments.filter((doc) => doc.status === status);
    }

    // Also include documents shared with the user
    const sharedDocuments = Array.from(documents.values())
      .flat()
      .filter((doc) =>
        doc.sharedWith.some(
          (share) =>
            share.userId === userId ||
            share.email === session.user?.email
        )
      );

    return NextResponse.json({
      documents: [...userDocuments, ...sharedDocuments],
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    const type = formData.get('type') as Document['type'];
    const sharedWithJson = formData.get('sharedWith') as string;
    const expiresAt = formData.get('expiresAt') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Upload file to cloud storage
    // 2. Generate secure URL
    // 3. Process document for e-signatures if needed
    // 4. Send notifications to shared users

    const document: Document = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId,
      userId: (session.user as any).id,
      name: file.name,
      type: type || 'other',
      status: 'draft',
      url: `/documents/${file.name}`, // Mock URL
      size: file.size,
      sharedWith: sharedWithJson ? JSON.parse(sharedWithJson) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: expiresAt || undefined,
    };

    const userDocuments = documents.get(document.userId) || [];
    userDocuments.push(document);
    documents.set(document.userId, userDocuments);

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { documentId, action, data } = await request.json();

    if (!documentId || !action) {
      return NextResponse.json(
        { error: 'Document ID and action are required' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;
    const userDocuments = documents.get(userId) || [];
    const documentIndex = userDocuments.findIndex((doc) => doc.id === documentId);

    if (documentIndex === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = userDocuments[documentIndex];

    switch (action) {
      case 'sign':
        document.status = 'signed';
        document.sharedWith = document.sharedWith.map((share) =>
          share.userId === userId || share.email === session.user?.email
            ? { ...share, status: 'signed' }
            : share
        );
        break;

      case 'share':
        if (!data.sharedWith) {
          return NextResponse.json(
            { error: 'Shared users are required' },
            { status: 400 }
          );
        }
        document.sharedWith = [...document.sharedWith, ...data.sharedWith];
        break;

      case 'update':
        Object.assign(document, data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    document.updatedAt = new Date().toISOString();
    userDocuments[documentIndex] = document;
    documents.set(userId, userDocuments);

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}
