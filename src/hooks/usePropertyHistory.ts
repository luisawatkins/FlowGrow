import { useState, useEffect, useCallback } from 'react';
import {
  PropertyHistory,
  PropertyTimeline,
  CreateHistoryEventRequest,
  UpdateHistoryEventRequest,
  GetTimelineRequest,
  HistoryError,
  UsePropertyHistoryOptions,
  UsePropertyHistoryReturn,
  HistorySearchQuery,
  HistorySearchResponse,
  HistoryAnalytics,
  TimelineExportOptions
} from '@/types/history';
import { historyService } from '@/lib/historyService';

export function usePropertyHistory(
  propertyId: string,
  options: UsePropertyHistoryOptions = {}
): UsePropertyHistoryReturn {
  const {
    autoRefresh = true,
    refreshInterval = 5, // 5 minutes
    enableFilters = true,
    enablePagination = true
  } = options;

  // State management
  const [history, setHistory] = useState<PropertyHistory | null>(null);
  const [timeline, setTimeline] = useState<PropertyTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<HistoryError | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create history event
  const createEvent = useCallback(async (data: CreateHistoryEventRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await historyService.createEvent(data);
      
      if (response.success && response.event) {
        // Refresh history and timeline
        await loadHistory(propertyId);
        await loadTimeline({ propertyId });
        return response.event;
      } else {
        throw new Error(response.message || 'Failed to create history event');
      }
    } catch (err) {
      const error: HistoryError = {
        code: 'CREATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to create history event',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  // Update history event
  const updateEvent = useCallback(async (id: string, updates: UpdateHistoryEventRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await historyService.updateEvent(id, updates);
      
      if (response.success && response.event) {
        // Refresh timeline
        await loadTimeline({ propertyId });
        return response.event;
      } else {
        throw new Error(response.message || 'Failed to update history event');
      }
    } catch (err) {
      const error: HistoryError = {
        code: 'UPDATE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to update history event',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  // Delete history event
  const deleteEvent = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await historyService.deleteEvent(id);
      
      if (response.success) {
        // Refresh history and timeline
        await loadHistory(propertyId);
        await loadTimeline({ propertyId });
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete history event');
      }
    } catch (err) {
      const error: HistoryError = {
        code: 'DELETE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to delete history event',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  // Load property history
  const loadHistory = useCallback(async (propertyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const historyData = await historyService.getPropertyHistory(propertyId);
      setHistory(historyData);
      return historyData;
    } catch (err) {
      const error: HistoryError = {
        code: 'LOAD_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load property history',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load property timeline
  const loadTimeline = useCallback(async (request: GetTimelineRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await historyService.getPropertyTimeline(request);
      
      if (response.success && response.timeline) {
        setTimeline(response.timeline);
        return response.timeline;
      } else {
        throw new Error(response.message || 'Failed to load property timeline');
      }
    } catch (err) {
      const error: HistoryError = {
        code: 'LOAD_TIMELINE_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load property timeline',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters to timeline
  const applyFilters = useCallback(async (filters: Partial<GetTimelineRequest['filters']>) => {
    if (!timeline) return;

    try {
      const request: GetTimelineRequest = {
        propertyId,
        filters: {
          ...timeline.filters,
          ...filters
        },
        page: 1,
        limit: timeline.pagination.limit
      };

      await loadTimeline(request);
    } catch (err) {
      const error: HistoryError = {
        code: 'FILTER_FAILED',
        message: err instanceof Error ? err.message : 'Failed to apply filters',
        details: err
      };
      setError(error);
      throw error;
    }
  }, [propertyId, timeline, loadTimeline]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && propertyId) {
      const interval = setInterval(() => {
        loadHistory(propertyId).catch(console.error);
        loadTimeline({ propertyId }).catch(console.error);
      }, refreshInterval * 60 * 1000); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, propertyId, refreshInterval, loadHistory, loadTimeline]);

  // Load data on mount
  useEffect(() => {
    if (propertyId) {
      loadHistory(propertyId).catch(console.error);
      loadTimeline({ propertyId }).catch(console.error);
    }
  }, [propertyId, loadHistory, loadTimeline]);

  return {
    history,
    timeline,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    loadHistory,
    loadTimeline,
    applyFilters,
    clearError
  };
}

// Additional hook for search functionality
export function useHistorySearch() {
  const [searchResults, setSearchResults] = useState<HistorySearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<HistoryError | null>(null);

  const searchEvents = useCallback(async (query: HistorySearchQuery, page = 1, limit = 20) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await historyService.searchEvents(query, page, limit);
      setSearchResults(results);
      return results;
    } catch (err) {
      const error: HistoryError = {
        code: 'SEARCH_FAILED',
        message: err instanceof Error ? err.message : 'Failed to search events',
        details: err
      };
      setSearchError(error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchEvents,
    clearSearch
  };
}

// Hook for analytics
export function useHistoryAnalytics(propertyId: string) {
  const [analytics, setAnalytics] = useState<HistoryAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<HistoryError | null>(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const analyticsData = await historyService.getHistoryAnalytics(propertyId);
      setAnalytics(analyticsData);
      return analyticsData;
    } catch (err) {
      const error: HistoryError = {
        code: 'ANALYTICS_FAILED',
        message: err instanceof Error ? err.message : 'Failed to load analytics',
        details: err
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  const exportTimeline = useCallback(async (options: TimelineExportOptions) => {
    try {
      const blob = await historyService.exportTimeline(propertyId, options);
      return blob;
    } catch (err) {
      const error: HistoryError = {
        code: 'EXPORT_FAILED',
        message: err instanceof Error ? err.message : 'Failed to export timeline',
        details: err
      };
      setError(error);
      throw error;
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) {
      loadAnalytics().catch(console.error);
    }
  }, [propertyId, loadAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics,
    exportTimeline
  };
}
