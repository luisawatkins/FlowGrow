import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock database for property images
const propertyImages = new Map<string, string[]>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(
      file => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
        },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Upload files to cloud storage (e.g., S3)
    // 2. Generate thumbnails
    // 3. Store metadata in database
    // 4. Return CDN URLs

    // Mock successful upload
    const uploadedUrls = files.map((file, index) => ({
      url: `/images/properties/${params.id}/${file.name}`,
      thumbnail: `/images/properties/${params.id}/thumbnails/${file.name}`,
      id: `${params.id}-${index}`,
    }));

    // Store in mock database
    const existingImages = propertyImages.get(params.id) || [];
    propertyImages.set(
      params.id,
      [...existingImages, ...uploadedUrls.map(img => img.url)]
    );

    return NextResponse.json({
      message: 'Images uploaded successfully',
      images: uploadedUrls,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const images = propertyImages.get(params.id) || [];

    // Mock image data
    const imageData = images.map((url, index) => ({
      url,
      thumbnail: url.replace('/properties/', '/properties/thumbnails/'),
      id: `${params.id}-${index}`,
    }));

    return NextResponse.json({ images: imageData });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { imageId } = await request.json();
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Delete file from cloud storage
    // 2. Remove metadata from database
    // 3. Delete thumbnails

    // Mock deletion from database
    const images = propertyImages.get(params.id) || [];
    const updatedImages = images.filter(
      (_, index) => `${params.id}-${index}` !== imageId
    );
    propertyImages.set(params.id, updatedImages);

    return NextResponse.json({
      message: 'Image deleted successfully',
      imageId,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}