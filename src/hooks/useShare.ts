import { useState } from 'react';

export function useShare() {
  const [isLoading, setIsLoading] = useState(false);

  const shareViaEmail = async (propertyId: string, email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/share/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to share via email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sharing via email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getShareLink = (propertyId: string) => {
    // In a real application, you might want to use environment variables
    // or a configuration service to get the base URL
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://your-domain.com';
    
    return `${baseUrl}/properties/${propertyId}`;
  };

  return {
    isLoading,
    shareViaEmail,
    getShareLink,
  };
}
