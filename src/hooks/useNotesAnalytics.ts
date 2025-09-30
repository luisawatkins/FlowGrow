// Property Notes Analytics Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  NotesAnalytics, 
  UseNotesAnalyticsReturn,
  NotesError 
} from '@/types/notes';
import { notesService } from '@/lib/notesService';

export const useNotesAnalytics = (propertyId?: string): UseNotesAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<NotesAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NotesError | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAnalytics = await notesService.getNotesAnalytics(propertyId);
      setAnalytics(fetchedAnalytics);
    } catch (err) {
      setError(err as NotesError);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  const refreshAnalytics = useCallback(async (): Promise<void> => {
    await loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics
  };
};
