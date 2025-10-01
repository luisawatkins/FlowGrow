import { useState, useCallback } from 'react';
import { PropertyImage, ImageGallery, ImageFilter, ImageAnalytics, ImageUpload } from '@/types/gallery';
import { GalleryService } from '@/lib/galleryService';

export function useEnhancedGallery() {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [galleries, setGalleries] = useState<ImageGallery[]>([]);
  const [analytics, setAnalytics] = useState<ImageAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image operations
  const createImage = useCallback(async (imageData: Omit<PropertyImage, 'id' | 'uploadedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const image = await GalleryService.createImage(imageData);
      setImages(prev => [...prev, image]);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getImages = useCallback(async (filters?: ImageFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      const images = await GalleryService.getImages(filters);
      setImages(images);
      return images;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getImagesByProperty = useCallback(async (propertyId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const images = await GalleryService.getImagesByProperty(propertyId);
      return images;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateImage = useCallback(async (id: string, updates: Partial<PropertyImage>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedImage = await GalleryService.updateImage(id, updates);
      if (updatedImage) {
        setImages(prev => prev.map(image => 
          image.id === id ? updatedImage : image
        ));
      }
      return updatedImage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await GalleryService.deleteImage(id);
      if (success) {
        setImages(prev => prev.filter(image => image.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadImages = useCallback(async (propertyId: string, uploads: ImageUpload[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const uploadedImages = await GalleryService.uploadImages(propertyId, uploads);
      setImages(prev => [...prev, ...uploadedImages]);
      return uploadedImages;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gallery operations
  const createGallery = useCallback(async (galleryData: Omit<ImageGallery, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const gallery = await GalleryService.createGallery(galleryData);
      setGalleries(prev => [...prev, gallery]);
      return gallery;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gallery');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGalleries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const galleries = Array.from(await GalleryService.getGalleriesByProperty(''));
      setGalleries(galleries);
      return galleries;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch galleries');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGalleriesByProperty = useCallback(async (propertyId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const galleries = await GalleryService.getGalleriesByProperty(propertyId);
      return galleries;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property galleries');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGallery = useCallback(async (id: string, updates: Partial<ImageGallery>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedGallery = await GalleryService.updateGallery(id, updates);
      if (updatedGallery) {
        setGalleries(prev => prev.map(gallery => 
          gallery.id === id ? updatedGallery : gallery
        ));
      }
      return updatedGallery;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update gallery');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteGallery = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await GalleryService.deleteGallery(id);
      if (success) {
        setGalleries(prev => prev.filter(gallery => gallery.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete gallery');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analytics
  const getAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const analytics = await GalleryService.getAnalytics();
      setAnalytics(analytics);
      return analytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    images,
    galleries,
    analytics,
    isLoading,
    error,
    
    // Image operations
    createImage,
    getImages,
    getImagesByProperty,
    updateImage,
    deleteImage,
    uploadImages,
    
    // Gallery operations
    createGallery,
    getGalleries,
    getGalleriesByProperty,
    updateGallery,
    deleteGallery,
    
    // Analytics
    getAnalytics,
  };
}
