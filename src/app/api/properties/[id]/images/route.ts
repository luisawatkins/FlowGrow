import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock image data (replace with actual database integration)
const mockImages = new Map<string, any[]>();

// Initialize some mock data
mockImages.set('1', [
  {
    id: '1',
    url: '/images/properties/property1-1.jpg',
    caption: 'Front view',
  },
  {
    id: '2',
    url: '/images/properties/property1-2.jpg',
    caption: 'Living room',
  },
  {
    id: '3',
    url: '/images/properties/property1-3.jpg',
    caption: 'Kitchen',
  },
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const propertyImages = mockImages.get(params.id) || [];
    return NextResponse.json(propertyImages);
  } catch (error) {
    console.error('Error fetching property images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property images' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Mock image processing and storage
    // In a real application, you would:
    // 1. Process the uploaded file
    // 2. Store it in a file storage service
    // 3. Save the metadata in your database

    const newImage = {
      id: Date.now().toString(),
      url: '/images/properties/new-image.jpg', // This would be the actual uploaded image URL
      caption: '',
    };

    const propertyImages = mockImages.get(params.id) || [];
    propertyImages.push(newImage);
    mockImages.set(params.id, propertyImages);

    return NextResponse.json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = request.nextUrl.pathname.split('/').pop();
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'No image ID provided' },
        { status: 400 }
      );
    }

    const propertyImages = mockImages.get(params.id) || [];
    const updatedImages = propertyImages.filter(img => img.id !== imageId);
    mockImages.set(params.id, updatedImages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = request.nextUrl.pathname.split('/').pop();
    const updates = await request.json();

    if (!imageId) {
      return NextResponse.json(
        { error: 'No image ID provided' },
        { status: 400 }
      );
    }

    const propertyImages = mockImages.get(params.id) || [];
    const imageIndex = propertyImages.findIndex(img => img.id === imageId);

    if (imageIndex === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    propertyImages[imageIndex] = {
      ...propertyImages[imageIndex],
      ...updates,
    };

    mockImages.set(params.id, propertyImages);

    return NextResponse.json(propertyImages[imageIndex]);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}
