import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PropertyLocation {
  coordinates: Coordinates;
  address: string;
  formattedAddress: string;
}

export function usePropertyMap(propertyId: string) {
  const [location, setLocation] = useState<PropertyLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyLocation();
  }, [propertyId]);

  const fetchPropertyLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/properties/${propertyId}/location`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch property location');
      }

      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Error fetching property location:', error);
      setError('Failed to load property location');
    } finally {
      setIsLoading(false);
    }
  };

  const getNearbyProperties = async (radius: number = 1000) => {
    if (!location) return [];

    try {
      const response = await fetch(
        `/api/properties/nearby?lat=${location.coordinates.latitude}&lng=${location.coordinates.longitude}&radius=${radius}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby properties');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
      throw error;
    }
  };

  const getDirections = (destinationAddress: string) => {
    if (!location) return;

    const origin = encodeURIComponent(location.address);
    const destination = encodeURIComponent(destinationAddress);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    
    window.open(url, '_blank');
  };

  return {
    location,
    isLoading,
    error,
    getNearbyProperties,
    getDirections,
  };
}
