// Enhanced search types for property search filters
export interface PropertySearchFilters {
  // Basic filters
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  squareFootageRange?: {
    min: number;
    max: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  location?: string;
  
  // Advanced filters
  amenities?: string[];
  yearBuilt?: {
    min: number;
    max: number;
  };
  lotSize?: {
    min: number;
    max: number;
  };
  parkingSpaces?: number;
  petFriendly?: boolean;
  furnished?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasGarage?: boolean;
  hasFireplace?: boolean;
  hasSecurity?: boolean;
  
  // Sorting and pagination
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'size-asc' | 'size-desc' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  
  // Date filters
  availableFrom?: string;
  availableTo?: string;
  
  // Special filters
  featured?: boolean;
  newListing?: boolean;
  priceReduced?: boolean;
  openHouse?: boolean;
}

export interface SearchFilterChip {
  id: string;
  label: string;
  value: any;
  category: string;
  removable: boolean;
}

export interface SearchFilterState {
  filters: PropertySearchFilters;
  chips: SearchFilterChip[];
  isExpanded: boolean;
  hasActiveFilters: boolean;
}

export interface SearchFilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchFilterCategory {
  id: string;
  label: string;
  type: 'range' | 'select' | 'multiselect' | 'checkbox' | 'date';
  options?: SearchFilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface SearchFilterPreset {
  id: string;
  name: string;
  description: string;
  filters: PropertySearchFilters;
  icon?: string;
}

export interface SearchFilterAnalytics {
  totalResults: number;
  filteredResults: number;
  filterCounts: Record<string, number>;
  popularFilters: string[];
  suggestedFilters: string[];
}

export interface SearchFilterValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SearchFilterExport {
  format: 'json' | 'url' | 'share';
  data: any;
}

export interface SearchFilterImport {
  format: 'json' | 'url';
  data: any;
  validation: SearchFilterValidation;
}

// API types
export interface SearchFilterRequest {
  filters: PropertySearchFilters;
  userId?: string;
  sessionId?: string;
}

export interface SearchFilterResponse {
  results: any[];
  totalCount: number;
  filters: PropertySearchFilters;
  analytics: SearchFilterAnalytics;
  suggestions: SearchFilterOption[];
}

export interface SearchFilterError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Hook types
export interface UseSearchFiltersReturn {
  filters: PropertySearchFilters;
  chips: SearchFilterChip[];
  isExpanded: boolean;
  hasActiveFilters: boolean;
  analytics: SearchFilterAnalytics;
  validation: SearchFilterValidation;
  
  // Actions
  updateFilter: (key: keyof PropertySearchFilters, value: any) => void;
  removeFilter: (key: keyof PropertySearchFilters) => void;
  clearAllFilters: () => void;
  toggleExpanded: () => void;
  addChip: (chip: SearchFilterChip) => void;
  removeChip: (chipId: string) => void;
  applyPreset: (preset: SearchFilterPreset) => void;
  exportFilters: (format: 'json' | 'url') => SearchFilterExport;
  importFilters: (data: SearchFilterImport) => void;
  validateFilters: () => SearchFilterValidation;
  getFilterCount: (key: keyof PropertySearchFilters) => number;
  getActiveFilters: () => Partial<PropertySearchFilters>;
  resetToDefaults: () => void;
}

// Component props
export interface SearchFilterPanelProps {
  filters: PropertySearchFilters;
  onFiltersChange: (filters: PropertySearchFilters) => void;
  categories: SearchFilterCategory[];
  presets?: SearchFilterPreset[];
  analytics?: SearchFilterAnalytics;
  validation?: SearchFilterValidation;
  className?: string;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showPresets?: boolean;
  showAnalytics?: boolean;
  showValidation?: boolean;
}

export interface SearchFilterChipsProps {
  chips: SearchFilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAll: () => void;
  className?: string;
  maxVisible?: number;
  showClearAll?: boolean;
}

export interface SearchFilterCategoryProps {
  category: SearchFilterCategory;
  value: any;
  onChange: (value: any) => void;
  options?: SearchFilterOption[];
  analytics?: SearchFilterAnalytics;
  className?: string;
}

export interface SearchFilterPresetsProps {
  presets: SearchFilterPreset[];
  onApplyPreset: (preset: SearchFilterPreset) => void;
  className?: string;
}

export interface SearchFilterAnalyticsProps {
  analytics: SearchFilterAnalytics;
  onFilterClick?: (filter: string) => void;
  className?: string;
}

// Utility types
export type FilterKey = keyof PropertySearchFilters;
export type FilterValue = PropertySearchFilters[FilterKey];
export type FilterCategoryType = SearchFilterCategory['type'];
