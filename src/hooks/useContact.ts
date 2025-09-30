import { useState } from 'react';

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function useContact() {
  const [isLoading, setIsLoading] = useState(false);

  const submitInquiry = async (propertyId: string, data: InquiryData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitInquiry,
  };
}
