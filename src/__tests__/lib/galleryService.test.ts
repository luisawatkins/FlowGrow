import { GalleryService } from '@/lib/galleryService';
import { PropertyImage, ImageGallery, ImageFilter } from '@/types/gallery';

describe('GalleryService', () => {
  beforeEach(() => {
    // Clear any existing data
    jest.clearAllMocks();
  });

  describe('Image CRUD operations', () => {
    it('should create a new image', async () => {
      const imageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        caption: 'Test caption',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        width: 800,
        height: 600,
        fileSize: 245760,
        mimeType: 'image/jpeg',
        uploadedBy: 'user-1',
        tags: ['test', 'image'],
        isPrimary: false,
        order: 1,
      };

      const image = await GalleryService.createImage(imageData);

      expect(image).toBeDefined();
      expect(image.id).toBeDefined();
      expect(image.url).toBe(imageData.url);
      expect(image.alt).toBe(imageData.alt);
      expect(image.uploadedAt).toBeInstanceOf(Date);
    });

    it('should get an image by id', async () => {
      const imageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
        caption: 'Test caption',
        uploadedBy: 'user-1',
        tags: ['test'],
        isPrimary: false,
        order: 1,
      };

      const createdImage = await GalleryService.createImage(imageData);
      const retrievedImage = await GalleryService.getImage(createdImage.id);

      expect(retrievedImage).toBeDefined();
      expect(retrievedImage?.id).toBe(createdImage.id);
      expect(retrievedImage?.url).toBe(imageData.url);
    });

    it('should get images by property', async () => {
      const propertyId = 'prop-1';
      const imageData1 = {
        url: 'https://example.com/image1.jpg',
        alt: 'Image 1',
        uploadedBy: propertyId,
        tags: ['test'],
        isPrimary: false,
        order: 1,
      };
      const imageData2 = {
        url: 'https://example.com/image2.jpg',
        alt: 'Image 2',
        uploadedBy: propertyId,
        tags: ['test'],
        isPrimary: false,
        order: 2,
      };

      await GalleryService.createImage(imageData1);
      await GalleryService.createImage(imageData2);

      const images = await GalleryService.getImagesByProperty(propertyId);

      expect(images).toHaveLength(2);
      expect(images.every(image => image.uploadedBy === propertyId)).toBe(true);
    });

    it('should update an image', async () => {
      const imageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Original alt',
        caption: 'Original caption',
        uploadedBy: 'user-1',
        tags: ['original'],
        isPrimary: false,
        order: 1,
      };

      const createdImage = await GalleryService.createImage(imageData);
      const updates = {
        alt: 'Updated alt',
        caption: 'Updated caption',
        tags: ['updated'],
      };

      const updatedImage = await GalleryService.updateImage(createdImage.id, updates);

      expect(updatedImage).toBeDefined();
      expect(updatedImage?.alt).toBe(updates.alt);
      expect(updatedImage?.caption).toBe(updates.caption);
      expect(updatedImage?.tags).toEqual(updates.tags);
    });

    it('should delete an image', async () => {
      const imageData = {
        url: 'https://example.com/image.jpg',
        alt: 'To delete',
        uploadedBy: 'user-1',
        tags: ['delete'],
        isPrimary: false,
        order: 1,
      };

      const createdImage = await GalleryService.createImage(imageData);
      const deleteResult = await GalleryService.deleteImage(createdImage.id);
      const retrievedImage = await GalleryService.getImage(createdImage.id);

      expect(deleteResult).toBe(true);
      expect(retrievedImage).toBeNull();
    });
  });

  describe('Image filtering', () => {
    beforeEach(async () => {
      // Create test images with different properties
      await GalleryService.createImage({
        url: 'https://example.com/image1.jpg',
        alt: 'Image 1',
        caption: 'Caption 1',
        uploadedBy: 'user-1',
        tags: ['tag1', 'tag2'],
        isPrimary: true,
        order: 1,
      });

      await GalleryService.createImage({
        url: 'https://example.com/image2.jpg',
        alt: 'Image 2',
        caption: 'Caption 2',
        uploadedBy: 'user-2',
        tags: ['tag2', 'tag3'],
        isPrimary: false,
        order: 2,
      });

      await GalleryService.createImage({
        url: 'https://example.com/image3.jpg',
        alt: 'Image 3',
        caption: 'Caption 3',
        uploadedBy: 'user-1',
        tags: ['tag1', 'tag3'],
        isPrimary: false,
        order: 3,
      });
    });

    it('should filter images by tags', async () => {
      const tag1Images = await GalleryService.getImages({ tags: ['tag1'] });
      const tag2Images = await GalleryService.getImages({ tags: ['tag2'] });

      expect(tag1Images.every(image => image.tags?.includes('tag1'))).toBe(true);
      expect(tag2Images.every(image => image.tags?.includes('tag2'))).toBe(true);
    });

    it('should filter images by uploadedBy', async () => {
      const user1Images = await GalleryService.getImages({ uploadedBy: 'user-1' });
      const user2Images = await GalleryService.getImages({ uploadedBy: 'user-2' });

      expect(user1Images.every(image => image.uploadedBy === 'user-1')).toBe(true);
      expect(user2Images.every(image => image.uploadedBy === 'user-2')).toBe(true);
    });

    it('should filter images by isPrimary', async () => {
      const primaryImages = await GalleryService.getImages({ isPrimary: true });
      const nonPrimaryImages = await GalleryService.getImages({ isPrimary: false });

      expect(primaryImages.every(image => image.isPrimary === true)).toBe(true);
      expect(nonPrimaryImages.every(image => image.isPrimary === false)).toBe(true);
    });

    it('should filter images by search term', async () => {
      const captionSearch = await GalleryService.getImages({ searchTerm: 'Caption 1' });
      const altSearch = await GalleryService.getImages({ searchTerm: 'Image 2' });

      expect(captionSearch.every(image => 
        image.caption?.toLowerCase().includes('caption 1') ||
        image.alt?.toLowerCase().includes('caption 1') ||
        image.tags?.some(tag => tag.toLowerCase().includes('caption 1'))
      )).toBe(true);

      expect(altSearch.every(image => 
        image.caption?.toLowerCase().includes('image 2') ||
        image.alt?.toLowerCase().includes('image 2') ||
        image.tags?.some(tag => tag.toLowerCase().includes('image 2'))
      )).toBe(true);
    });
  });

  describe('Gallery operations', () => {
    it('should create a gallery', async () => {
      const galleryData = {
        propertyId: 'prop-1',
        name: 'Test Gallery',
        description: 'Test description',
        images: [],
        isPublic: true,
        createdBy: 'user-1',
      };

      const gallery = await GalleryService.createGallery(galleryData);

      expect(gallery).toBeDefined();
      expect(gallery.id).toBeDefined();
      expect(gallery.name).toBe(galleryData.name);
      expect(gallery.description).toBe(galleryData.description);
      expect(gallery.createdAt).toBeInstanceOf(Date);
      expect(gallery.updatedAt).toBeInstanceOf(Date);
    });

    it('should get a gallery by id', async () => {
      const galleryData = {
        propertyId: 'prop-1',
        name: 'Test Gallery',
        description: 'Test description',
        images: [],
        isPublic: true,
        createdBy: 'user-1',
      };

      const createdGallery = await GalleryService.createGallery(galleryData);
      const retrievedGallery = await GalleryService.getGallery(createdGallery.id);

      expect(retrievedGallery).toBeDefined();
      expect(retrievedGallery?.id).toBe(createdGallery.id);
      expect(retrievedGallery?.name).toBe(galleryData.name);
    });

    it('should get galleries by property', async () => {
      const propertyId = 'prop-1';
      const galleryData1 = {
        propertyId,
        name: 'Gallery 1',
        description: 'Description 1',
        images: [],
        isPublic: true,
        createdBy: 'user-1',
      };
      const galleryData2 = {
        propertyId,
        name: 'Gallery 2',
        description: 'Description 2',
        images: [],
        isPublic: false,
        createdBy: 'user-1',
      };

      await GalleryService.createGallery(galleryData1);
      await GalleryService.createGallery(galleryData2);

      const galleries = await GalleryService.getGalleriesByProperty(propertyId);

      expect(galleries).toHaveLength(2);
      expect(galleries.every(gallery => gallery.propertyId === propertyId)).toBe(true);
    });

    it('should update a gallery', async () => {
      const galleryData = {
        propertyId: 'prop-1',
        name: 'Original Gallery',
        description: 'Original description',
        images: [],
        isPublic: true,
        createdBy: 'user-1',
      };

      const createdGallery = await GalleryService.createGallery(galleryData);
      const updates = {
        name: 'Updated Gallery',
        description: 'Updated description',
        isPublic: false,
      };

      const updatedGallery = await GalleryService.updateGallery(createdGallery.id, updates);

      expect(updatedGallery).toBeDefined();
      expect(updatedGallery?.name).toBe(updates.name);
      expect(updatedGallery?.description).toBe(updates.description);
      expect(updatedGallery?.isPublic).toBe(updates.isPublic);
      expect(updatedGallery?.updatedAt.getTime()).toBeGreaterThan(createdGallery.updatedAt.getTime());
    });

    it('should delete a gallery', async () => {
      const galleryData = {
        propertyId: 'prop-1',
        name: 'To Delete',
        description: 'Delete me',
        images: [],
        isPublic: true,
        createdBy: 'user-1',
      };

      const createdGallery = await GalleryService.createGallery(galleryData);
      const deleteResult = await GalleryService.deleteGallery(createdGallery.id);
      const retrievedGallery = await GalleryService.getGallery(createdGallery.id);

      expect(deleteResult).toBe(true);
      expect(retrievedGallery).toBeNull();
    });
  });

  describe('Image upload', () => {
    it('should upload multiple images', async () => {
      const propertyId = 'prop-1';
      const mockFile1 = new File(['image1'], 'image1.jpg', { type: 'image/jpeg' });
      const mockFile2 = new File(['image2'], 'image2.jpg', { type: 'image/jpeg' });
      
      const uploads = [
        {
          file: mockFile1,
          caption: 'Caption 1',
          tags: ['tag1'],
          isPrimary: true,
          order: 1,
        },
        {
          file: mockFile2,
          caption: 'Caption 2',
          tags: ['tag2'],
          isPrimary: false,
          order: 2,
        },
      ];

      const uploadedImages = await GalleryService.uploadImages(propertyId, uploads);

      expect(uploadedImages).toHaveLength(2);
      expect(uploadedImages[0].uploadedBy).toBe(propertyId);
      expect(uploadedImages[0].isPrimary).toBe(true);
      expect(uploadedImages[1].uploadedBy).toBe(propertyId);
      expect(uploadedImages[1].isPrimary).toBe(false);
    });
  });

  describe('Analytics', () => {
    it('should get gallery analytics', async () => {
      const analytics = await GalleryService.getAnalytics();

      expect(analytics).toBeDefined();
      expect(analytics.totalImages).toBeGreaterThanOrEqual(0);
      expect(analytics.totalSize).toBeGreaterThanOrEqual(0);
      expect(analytics.imagesByMonth).toBeDefined();
      expect(analytics.topTags).toBeDefined();
      expect(analytics.uploadStats).toBeDefined();
      expect(analytics.uploadStats.totalUploads).toBeGreaterThanOrEqual(0);
      expect(analytics.uploadStats.averageSize).toBeGreaterThanOrEqual(0);
    });
  });
});
