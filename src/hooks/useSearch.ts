import { useState, useCallback } from 'react';
import { PropertyFilters } from '@/components/Search/FilterPanel';

interface Property {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  location: string;
}

export function useSearch() {
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<PropertyFilters | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const search = useCallback(async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentFilters),
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters]);

  const applyFilters = useCallback((filters: PropertyFilters) => {
    setCurrentFilters(filters);
    if (searchQuery) {
      search(searchQuery);
    }
  }, [searchQuery, search]);

  return {
    results,
    isLoading,
    search,
    applyFilters,
  };
}
