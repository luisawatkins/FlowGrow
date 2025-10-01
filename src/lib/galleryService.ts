import { PropertyImage, ImageGallery, ImageFilter, ImageAnalytics, ImageUpload } from '@/types/gallery';

// Mock database
const images = new Map<string, PropertyImage>();
const galleries = new Map<string, ImageGallery>();

// Initialize with some mock data
const mockImages: PropertyImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    alt: 'Modern living room',
    caption: 'Spacious living room with modern furniture',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop',
    width: 800,
    height: 600,
    fileSize: 245760,
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'user-1',
    tags: ['living-room', 'modern', 'interior'],
    isPrimary: true,
    order: 1,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    alt: 'Kitchen with island',
    caption: 'Modern kitchen with granite countertops',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
    width: 800,
    height: 600,
    fileSize: 198432,
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'user-1',
    tags: ['kitchen', 'modern', 'interior'],
    isPrimary: false,
    order: 2,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1571508601933-0b9b5a0a4b8c?w=800&h=600&fit=crop',
    alt: 'Master bedroom',
    caption: 'Elegant master bedroom with walk-in closet',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571508601933-0b9b5a0a4b8c?w=200&h=150&fit=crop',
    width: 800,
    height: 600,
    fileSize: 312456,
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2024-01-16'),
    uploadedBy: 'user-1',
    tags: ['bedroom', 'master', 'interior'],
    isPrimary: false,
    order: 3,
  },
];

const mockGalleries: ImageGallery[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    name: 'Main Property Gallery',
    description: 'All images for the main property',
    images: mockImages,
    isPublic: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'user-1',
  },
];

// Initialize mock data
mockImages.forEach(image => images.set(image.id, image));
mockGalleries.forEach(gallery => galleries.set(gallery.id, gallery));

export class GalleryService {
  // Image CRUD operations
  static async createImage(imageData: Omit<PropertyImage, 'id' | 'uploadedAt'>): Promise<PropertyImage> {
    const image: PropertyImage = {
      ...imageData,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date(),
    };
    
    images.set(image.id, image);
    return image;
  }

  static async getImage(id: string): Promise<PropertyImage | null> {
    return images.get(id) || null;
  }

  static async getImagesByProperty(propertyId: string): Promise<PropertyImage[]> {
    return Array.from(images.values()).filter(image => 
      image.uploadedBy && image.uploadedBy.includes(propertyId)
    );
  }

  static async updateImage(id: string, updates: Partial<PropertyImage>): Promise<PropertyImage | null> {
    const image = images.get(id);
    if (!image) return null;

    const updatedImage = {
      ...image,
      ...updates,
    };
    
    images.set(id, updatedImage);
    return updatedImage;
  }

  static async deleteImage(id: string): Promise<boolean> {
    return images.delete(id);
  }

  static async getImages(filters?: ImageFilter): Promise<PropertyImage[]> {
    let results = Array.from(images.values());

    if (filters) {
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(image => 
          image.tags && filters.tags!.some(tag => image.tags!.includes(tag))
        );
      }

      if (filters.dateRange) {
        results = results.filter(image => 
          image.uploadedAt >= filters.dateRange!.start && 
          image.uploadedAt <= filters.dateRange!.end
        );
      }

      if (filters.uploadedBy) {
        results = results.filter(image => image.uploadedBy === filters.uploadedBy);
      }

      if (filters.isPrimary !== undefined) {
        results = results.filter(image => image.isPrimary === filters.isPrimary);
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        results = results.filter(image =>
          image.alt?.toLowerCase().includes(searchLower) ||
          image.caption?.toLowerCase().includes(searchLower) ||
          image.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
    }

    return results.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // Gallery CRUD operations
  static async createGallery(galleryData: Omit<ImageGallery, 'id' | 'createdAt' | 'updatedAt'>): Promise<ImageGallery> {
    const gallery: ImageGallery = {
      ...galleryData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    galleries.set(gallery.id, gallery);
    return gallery;
  }

  static async getGallery(id: string): Promise<ImageGallery | null> {
    return galleries.get(id) || null;
  }

  static async getGalleriesByProperty(propertyId: string): Promise<ImageGallery[]> {
    return Array.from(galleries.values()).filter(gallery => gallery.propertyId === propertyId);
  }

  static async updateGallery(id: string, updates: Partial<ImageGallery>): Promise<ImageGallery | null> {
    const gallery = galleries.get(id);
    if (!gallery) return null;

    const updatedGallery = {
      ...gallery,
      ...updates,
      updatedAt: new Date(),
    };
    
    galleries.set(id, updatedGallery);
    return updatedGallery;
  }

  static async deleteGallery(id: string): Promise<boolean> {
    return galleries.delete(id);
  }

  // Image upload handling
  static async uploadImages(propertyId: string, uploads: ImageUpload[]): Promise<PropertyImage[]> {
    const uploadedImages: PropertyImage[] = [];

    for (const upload of uploads) {
      // In a real application, you would upload the file to a storage service
      // For now, we'll create a mock image with the file data
      const image: PropertyImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(upload.file),
        alt: upload.caption || upload.file.name,
        caption: upload.caption,
        thumbnailUrl: URL.createObjectURL(upload.file),
        width: 800, // Mock dimensions
        height: 600,
        fileSize: upload.file.size,
        mimeType: upload.file.type,
        uploadedAt: new Date(),
        uploadedBy: propertyId,
        tags: upload.tags || [],
        isPrimary: upload.isPrimary || false,
        order: upload.order || 0,
      };

      images.set(image.id, image);
      uploadedImages.push(image);
    }

    return uploadedImages;
  }

  // Analytics
  static async getAnalytics(): Promise<ImageAnalytics> {
    const allImages = Array.from(images.values());
    const totalImages = allImages.length;
    const totalSize = allImages.reduce((sum, image) => sum + (image.fileSize || 0), 0);
    
    const imagesByMonth = this.getImagesByMonth(allImages);
    const topTags = this.getTopTags(allImages);
    
    const uploadStats = {
      totalUploads: allImages.length,
      averageSize: totalImages > 0 ? totalSize / totalImages : 0,
      mostActiveUser: this.getMostActiveUser(allImages),
    };

    return {
      totalImages,
      totalSize,
      imagesByMonth,
      topTags,
      uploadStats,
    };
  }

  private static getImagesByMonth(images: PropertyImage[]): Array<{ month: string; count: number; size: number }> {
    const monthData = new Map<string, { count: number; size: number }>();
    
    images.forEach(image => {
      const month = image.uploadedAt.toISOString().substring(0, 7); // YYYY-MM
      const existing = monthData.get(month) || { count: 0, size: 0 };
      monthData.set(month, {
        count: existing.count + 1,
        size: existing.size + (image.fileSize || 0),
      });
    });

    return Array.from(monthData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private static getTopTags(images: PropertyImage[]): Array<{ tag: string; count: number }> {
    const tagCounts = new Map<string, number>();
    
    images.forEach(image => {
      if (image.tags) {
        image.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private static getMostActiveUser(images: PropertyImage[]): string {
    const userCounts = new Map<string, number>();
    
    images.forEach(image => {
      if (image.uploadedBy) {
        userCounts.set(image.uploadedBy, (userCounts.get(image.uploadedBy) || 0) + 1);
      }
    });

    let mostActiveUser = '';
    let maxCount = 0;
    
    userCounts.forEach((count, user) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveUser = user;
      }
    });

    return mostActiveUser;
  }
}
