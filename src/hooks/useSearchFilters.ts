import { useState, useCallback, useEffect, useMemo } from 'react';
import { PropertySearchFilters, SearchFilterChip, SearchFilterPreset, SearchFilterAnalytics, SearchFilterValidation, UseSearchFiltersReturn } from '@/types/search';
import { searchFilterService } from '@/lib/searchFilterService';

export function useSearchFilters(initialFilters?: Partial<PropertySearchFilters>): UseSearchFiltersReturn {
  const [filters, setFilters] = useState<PropertySearchFilters>(() => ({
    ...searchFilterService.getDefaultFilters(),
    ...initialFilters,
  }));
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [analytics, setAnalytics] = useState<SearchFilterAnalytics>({
    totalResults: 0,
    filteredResults: 0,
    filterCounts: {},
    popularFilters: [],
    suggestedFilters: [],
  });

  // Create filter chips from current filters
  const chips = useMemo(() => {
    return searchFilterService.createFilterChips(filters);
  }, [filters]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return searchFilterService.hasActiveFilters(filters);
  }, [filters]);

  // Validate current filters
  const validation = useMemo(() => {
    return searchFilterService.validateFilters(filters);
  }, [filters]);

  // Update a specific filter
  const updateFilter = useCallback((key: keyof PropertySearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Remove a specific filter
  const removeFilter = useCallback((key: keyof PropertySearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(searchFilterService.getDefaultFilters());
  }, []);

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Add a filter chip
  const addChip = useCallback((chip: SearchFilterChip) => {
    updateFilter(chip.id as keyof PropertySearchFilters, chip.value);
  }, [updateFilter]);

  // Remove a filter chip
  const removeChip = useCallback((chipId: string) => {
    // Find the chip and remove the corresponding filter
    const chip = chips.find(c => c.id === chipId);
    if (chip) {
      removeFilter(chip.id as keyof PropertySearchFilters);
    }
  }, [chips, removeFilter]);

  // Apply a filter preset
  const applyPreset = useCallback((preset: SearchFilterPreset) => {
    setFilters(searchFilterService.applyPreset(preset));
  }, []);

  // Export filters
  const exportFilters = useCallback((format: 'json' | 'url') => {
    if (format === 'json') {
      return {
        format: 'json' as const,
        data: filters,
      };
    } else {
      return {
        format: 'url' as const,
        data: searchFilterService.exportToUrl(filters),
      };
    }
  }, [filters]);

  // Import filters
  const importFilters = useCallback((data: any) => {
    if (data.format === 'json') {
      setFilters({ ...searchFilterService.getDefaultFilters(), ...data.data });
    } else if (data.format === 'url') {
      setFilters(searchFilterService.importFromUrl(data.data));
    }
  }, []);

  // Validate filters
  const validateFilters = useCallback(() => {
    return searchFilterService.validateFilters(filters);
  }, [filters]);

  // Get count for a specific filter
  const getFilterCount = useCallback((key: keyof PropertySearchFilters) => {
    const value = filters[key];
    if (Array.isArray(value)) {
      return value.length;
    }
    if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
      const range = value as { min: number; max: number };
      return range.min !== 0 || range.max !== 2000000 ? 1 : 0;
    }
    return value !== undefined && value !== null ? 1 : 0;
  }, [filters]);

  // Get active filters
  const getActiveFilters = useCallback(() => {
    const activeFilters: Partial<PropertySearchFilters> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            activeFilters[key as keyof PropertySearchFilters] = value;
          }
        } else if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
          const range = value as { min: number; max: number };
          if (range.min !== 0 || range.max !== 2000000) {
            activeFilters[key as keyof PropertySearchFilters] = value;
          }
        } else {
          activeFilters[key as keyof PropertySearchFilters] = value;
        }
      }
    });
    
    return activeFilters;
  }, [filters]);

  // Reset to default filters
  const resetToDefaults = useCallback(() => {
    setFilters(searchFilterService.getDefaultFilters());
  }, []);

  // Update analytics when filters change
  useEffect(() => {
    const newAnalytics = searchFilterService.generateAnalytics(filters, 0); // Total results would come from API
    setAnalytics(newAnalytics);
  }, [filters]);

  return {
    filters,
    chips,
    isExpanded,
    hasActiveFilters,
    analytics,
    validation,
    updateFilter,
    removeFilter,
    clearAllFilters,
    toggleExpanded,
    addChip,
    removeChip,
    applyPreset,
    exportFilters,
    importFilters,
    validateFilters,
    getFilterCount,
    getActiveFilters,
    resetToDefaults,
  };
}
