import { useState, useEffect } from 'react';

interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
}

export function usePropertyGallery(propertyId: string) {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyImages();
  }, [propertyId]);

  const fetchPropertyImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/properties/${propertyId}/images`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch property images');
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching property images:', error);
      setError('Failed to load property images');
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const newImage = await response.json();
      setImages(prev => [...prev, newImage]);
      return newImage;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const updateImageCaption = async (imageId: string, caption: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption }),
      });

      if (!response.ok) {
        throw new Error('Failed to update image caption');
      }

      const updatedImage = await response.json();
      setImages(prev =>
        prev.map(img => (img.id === imageId ? updatedImage : img))
      );
    } catch (error) {
      console.error('Error updating image caption:', error);
      throw error;
    }
  };

  return {
    images,
    isLoading,
    error,
    addImage,
    removeImage,
    updateImageCaption,
  };
}
