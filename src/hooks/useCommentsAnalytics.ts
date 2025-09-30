// Property Comments Analytics Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  CommentsAnalytics, 
  UseCommentsAnalyticsReturn,
  NotesError 
} from '@/types/notes';
import { notesService } from '@/lib/notesService';

export const useCommentsAnalytics = (propertyId?: string): UseCommentsAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<CommentsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NotesError | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAnalytics = await notesService.getCommentsAnalytics(propertyId);
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
