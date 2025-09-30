import { useState, useEffect, useCallback } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  criteria: any;
  notifications: boolean;
  createdAt: string;
}

interface SaveSearchParams {
  name: string;
  criteria: any;
  notifications: boolean;
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedSearches = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/saved-searches');
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved searches');
      }
      
      const data = await response.json();
      setSavedSearches(data);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  const saveSearch = async (params: SaveSearchParams) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to save search');
      }

      const data = await response.json();
      setSavedSearches(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error saving search:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSearch = async (searchId: string, params: Partial<SaveSearchParams>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to update search');
      }

      const data = await response.json();
      setSavedSearches(prev =>
        prev.map(search => (search.id === searchId ? data : search))
      );
      return data;
    } catch (error) {
      console.error('Error updating search:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete search');
      }

      setSavedSearches(prev =>
        prev.filter(search => search.id !== searchId)
      );
    } catch (error) {
      console.error('Error deleting search:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = async (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId);
    if (!search) return;

    try {
      await updateSearch(searchId, {
        notifications: !search.notifications,
      });
    } catch (error) {
      console.error('Error toggling notifications:', error);
      throw error;
    }
  };

  return {
    savedSearches,
    isLoading,
    saveSearch,
    updateSearch,
    deleteSearch,
    toggleNotifications,
  };
}
