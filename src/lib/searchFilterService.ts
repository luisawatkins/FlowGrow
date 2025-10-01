import { PropertySearchFilters, SearchFilterChip, SearchFilterCategory, SearchFilterPreset, SearchFilterAnalytics, SearchFilterValidation } from '@/types/search';

class SearchFilterService {
  // Default filter values
  private defaultFilters: PropertySearchFilters = {
    priceRange: { min: 0, max: 2000000 },
    squareFootageRange: { min: 0, max: 10000 },
    yearBuilt: { min: 1900, max: new Date().getFullYear() },
    lotSize: { min: 0, max: 50000 },
    sortBy: 'relevance',
    page: 1,
    limit: 20,
  };

  // Filter categories configuration
  private filterCategories: SearchFilterCategory[] = [
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'range',
      min: 0,
      max: 2000000,
      step: 10000,
      unit: '$',
    },
    {
      id: 'squareFootageRange',
      label: 'Square Footage',
      type: 'range',
      min: 0,
      max: 10000,
      step: 100,
      unit: 'sq ft',
    },
    {
      id: 'bedrooms',
      label: 'Bedrooms',
      type: 'select',
      options: [
        { value: '1', label: '1+', count: 0 },
        { value: '2', label: '2+', count: 0 },
        { value: '3', label: '3+', count: 0 },
        { value: '4', label: '4+', count: 0 },
        { value: '5', label: '5+', count: 0 },
      ],
    },
    {
      id: 'bathrooms',
      label: 'Bathrooms',
      type: 'select',
      options: [
        { value: '1', label: '1+', count: 0 },
        { value: '2', label: '2+', count: 0 },
        { value: '3', label: '3+', count: 0 },
        { value: '4', label: '4+', count: 0 },
      ],
    },
    {
      id: 'propertyType',
      label: 'Property Type',
      type: 'select',
      options: [
        { value: 'house', label: 'House', count: 0 },
        { value: 'apartment', label: 'Apartment', count: 0 },
        { value: 'condo', label: 'Condo', count: 0 },
        { value: 'townhouse', label: 'Townhouse', count: 0 },
        { value: 'studio', label: 'Studio', count: 0 },
        { value: 'villa', label: 'Villa', count: 0 },
      ],
    },
    {
      id: 'amenities',
      label: 'Amenities',
      type: 'multiselect',
      options: [
        { value: 'pool', label: 'Pool', count: 0 },
        { value: 'garage', label: 'Garage', count: 0 },
        { value: 'garden', label: 'Garden', count: 0 },
        { value: 'fireplace', label: 'Fireplace', count: 0 },
        { value: 'security', label: 'Security', count: 0 },
        { value: 'gym', label: 'Gym', count: 0 },
        { value: 'parking', label: 'Parking', count: 0 },
        { value: 'balcony', label: 'Balcony', count: 0 },
      ],
    },
    {
      id: 'yearBuilt',
      label: 'Year Built',
      type: 'range',
      min: 1900,
      max: new Date().getFullYear(),
      step: 1,
      unit: '',
    },
    {
      id: 'lotSize',
      label: 'Lot Size',
      type: 'range',
      min: 0,
      max: 50000,
      step: 100,
      unit: 'sq ft',
    },
    {
      id: 'parkingSpaces',
      label: 'Parking Spaces',
      type: 'select',
      options: [
        { value: '0', label: 'No Parking', count: 0 },
        { value: '1', label: '1+', count: 0 },
        { value: '2', label: '2+', count: 0 },
        { value: '3', label: '3+', count: 0 },
        { value: '4', label: '4+', count: 0 },
      ],
    },
    {
      id: 'petFriendly',
      label: 'Pet Friendly',
      type: 'checkbox',
    },
    {
      id: 'furnished',
      label: 'Furnished',
      type: 'checkbox',
    },
    {
      id: 'hasPool',
      label: 'Has Pool',
      type: 'checkbox',
    },
    {
      id: 'hasGarden',
      label: 'Has Garden',
      type: 'checkbox',
    },
    {
      id: 'hasGarage',
      label: 'Has Garage',
      type: 'checkbox',
    },
    {
      id: 'hasFireplace',
      label: 'Has Fireplace',
      type: 'checkbox',
    },
    {
      id: 'hasSecurity',
      label: 'Has Security',
      type: 'checkbox',
    },
  ];

  // Predefined filter presets
  private filterPresets: SearchFilterPreset[] = [
    {
      id: 'first-time-buyer',
      name: 'First Time Buyer',
      description: 'Affordable options for first-time home buyers',
      filters: {
        priceRange: { min: 0, max: 500000 },
        bedrooms: 2,
        bathrooms: 1,
        propertyType: 'house',
      },
      icon: '🏠',
    },
    {
      id: 'luxury-homes',
      name: 'Luxury Homes',
      description: 'High-end properties with premium amenities',
      filters: {
        priceRange: { min: 1000000, max: 2000000 },
        bedrooms: 4,
        bathrooms: 3,
        hasPool: true,
        hasGarage: true,
        hasSecurity: true,
      },
      icon: '🏰',
    },
    {
      id: 'investment-properties',
      name: 'Investment Properties',
      description: 'Properties suitable for rental investment',
      filters: {
        priceRange: { min: 200000, max: 800000 },
        bedrooms: 2,
        bathrooms: 2,
        propertyType: 'apartment',
        furnished: false,
      },
      icon: '💰',
    },
    {
      id: 'family-homes',
      name: 'Family Homes',
      description: 'Spacious properties perfect for families',
      filters: {
        bedrooms: 3,
        bathrooms: 2,
        squareFootageRange: { min: 1500, max: 10000 },
        hasGarden: true,
        petFriendly: true,
      },
      icon: '👨‍👩‍👧‍👦',
    },
    {
      id: 'studio-apartments',
      name: 'Studio Apartments',
      description: 'Compact living spaces in urban areas',
      filters: {
        propertyType: 'studio',
        squareFootageRange: { min: 300, max: 800 },
        priceRange: { min: 0, max: 400000 },
        furnished: true,
      },
      icon: '🏢',
    },
  ];

  // Get default filters
  getDefaultFilters(): PropertySearchFilters {
    return { ...this.defaultFilters };
  }

  // Get filter categories
  getFilterCategories(): SearchFilterCategory[] {
    return [...this.filterCategories];
  }

  // Get filter presets
  getFilterPresets(): SearchFilterPreset[] {
    return [...this.filterPresets];
  }

  // Create filter chips from current filters
  createFilterChips(filters: PropertySearchFilters): SearchFilterChip[] {
    const chips: SearchFilterChip[] = [];

    // Price range chip
    if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 2000000)) {
      chips.push({
        id: 'priceRange',
        label: `$${filters.priceRange.min.toLocaleString()} - $${filters.priceRange.max.toLocaleString()}`,
        value: filters.priceRange,
        category: 'Price',
        removable: true,
      });
    }

    // Square footage chip
    if (filters.squareFootageRange && (filters.squareFootageRange.min > 0 || filters.squareFootageRange.max < 10000)) {
      chips.push({
        id: 'squareFootageRange',
        label: `${filters.squareFootageRange.min} - ${filters.squareFootageRange.max} sq ft`,
        value: filters.squareFootageRange,
        category: 'Size',
        removable: true,
      });
    }

    // Bedrooms chip
    if (filters.bedrooms) {
      chips.push({
        id: 'bedrooms',
        label: `${filters.bedrooms}+ bedrooms`,
        value: filters.bedrooms,
        category: 'Rooms',
        removable: true,
      });
    }

    // Bathrooms chip
    if (filters.bathrooms) {
      chips.push({
        id: 'bathrooms',
        label: `${filters.bathrooms}+ bathrooms`,
        value: filters.bathrooms,
        category: 'Rooms',
        removable: true,
      });
    }

    // Property type chip
    if (filters.propertyType) {
      chips.push({
        id: 'propertyType',
        label: filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1),
        value: filters.propertyType,
        category: 'Type',
        removable: true,
      });
    }

    // Location chip
    if (filters.location) {
      chips.push({
        id: 'location',
        label: filters.location,
        value: filters.location,
        category: 'Location',
        removable: true,
      });
    }

    // Amenities chips
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach((amenity, index) => {
        chips.push({
          id: `amenity-${index}`,
          label: amenity.charAt(0).toUpperCase() + amenity.slice(1),
          value: amenity,
          category: 'Amenities',
          removable: true,
        });
      });
    }

    // Boolean feature chips
    const booleanFeatures = [
      { key: 'petFriendly', label: 'Pet Friendly' },
      { key: 'furnished', label: 'Furnished' },
      { key: 'hasPool', label: 'Has Pool' },
      { key: 'hasGarden', label: 'Has Garden' },
      { key: 'hasGarage', label: 'Has Garage' },
      { key: 'hasFireplace', label: 'Has Fireplace' },
      { key: 'hasSecurity', label: 'Has Security' },
    ];

    booleanFeatures.forEach(({ key, label }) => {
      if (filters[key as keyof PropertySearchFilters]) {
        chips.push({
          id: key,
          label,
          value: true,
          category: 'Features',
          removable: true,
        });
      }
    });

    return chips;
  }

  // Check if filters have active values
  hasActiveFilters(filters: PropertySearchFilters): boolean {
    const defaultFilters = this.getDefaultFilters();
    
    return Object.keys(filters).some(key => {
      const filterKey = key as keyof PropertySearchFilters;
      const currentValue = filters[filterKey];
      const defaultValue = defaultFilters[filterKey];
      
      if (currentValue === undefined || currentValue === null) return false;
      
      // Special handling for range objects
      if (typeof currentValue === 'object' && currentValue !== null && 'min' in currentValue && 'max' in currentValue) {
        const rangeValue = currentValue as { min: number; max: number };
        const defaultRange = defaultValue as { min: number; max: number };
        return rangeValue.min !== defaultRange.min || rangeValue.max !== defaultRange.max;
      }
      
      // Special handling for arrays
      if (Array.isArray(currentValue)) {
        return currentValue.length > 0;
      }
      
      return currentValue !== defaultValue;
    });
  }

  // Validate filters
  validateFilters(filters: PropertySearchFilters): SearchFilterValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Price range validation
    if (filters.priceRange) {
      if (filters.priceRange.min < 0) {
        errors.push('Minimum price cannot be negative');
      }
      if (filters.priceRange.max < filters.priceRange.min) {
        errors.push('Maximum price must be greater than minimum price');
      }
      if (filters.priceRange.min > 10000000) {
        warnings.push('Very high minimum price may limit results');
      }
    }

    // Square footage validation
    if (filters.squareFootageRange) {
      if (filters.squareFootageRange.min < 0) {
        errors.push('Minimum square footage cannot be negative');
      }
      if (filters.squareFootageRange.max < filters.squareFootageRange.min) {
        errors.push('Maximum square footage must be greater than minimum');
      }
    }

    // Year built validation
    if (filters.yearBuilt) {
      const currentYear = new Date().getFullYear();
      if (filters.yearBuilt.min < 1900) {
        warnings.push('Very old minimum year may limit results');
      }
      if (filters.yearBuilt.max > currentYear) {
        errors.push('Maximum year cannot be in the future');
      }
    }

    // Bedrooms and bathrooms validation
    if (filters.bedrooms && filters.bedrooms < 0) {
      errors.push('Number of bedrooms cannot be negative');
    }
    if (filters.bathrooms && filters.bathrooms < 0) {
      errors.push('Number of bathrooms cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Generate analytics for filters
  generateAnalytics(filters: PropertySearchFilters, totalResults: number): SearchFilterAnalytics {
    const activeFilters = Object.keys(filters).filter(key => {
      const value = filters[key as keyof PropertySearchFilters];
      return value !== undefined && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    });

    return {
      totalResults,
      filteredResults: totalResults, // This would be calculated based on actual results
      filterCounts: activeFilters.reduce((acc, key) => {
        acc[key] = 1;
        return acc;
      }, {} as Record<string, number>),
      popularFilters: ['priceRange', 'bedrooms', 'propertyType', 'location'],
      suggestedFilters: ['amenities', 'yearBuilt', 'hasPool'],
    };
  }

  // Apply filter preset
  applyPreset(preset: SearchFilterPreset): PropertySearchFilters {
    return { ...this.defaultFilters, ...preset.filters };
  }

  // Clear specific filter
  clearFilter(filters: PropertySearchFilters, key: keyof PropertySearchFilters): PropertySearchFilters {
    const newFilters = { ...filters };
    delete newFilters[key];
    return newFilters;
  }

  // Clear all filters
  clearAllFilters(): PropertySearchFilters {
    return { ...this.defaultFilters };
  }

  // Export filters to URL
  exportToUrl(filters: PropertySearchFilters): string {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && value !== null) {
          params.set(key, JSON.stringify(value));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    return params.toString();
  }

  // Import filters from URL
  importFromUrl(urlParams: string): PropertySearchFilters {
    const params = new URLSearchParams(urlParams);
    const filters: PropertySearchFilters = { ...this.defaultFilters };
    
    params.forEach((value, key) => {
      try {
        // Try to parse as JSON for complex objects
        const parsedValue = JSON.parse(value);
        (filters as any)[key] = parsedValue;
      } catch {
        // Fall back to string value
        (filters as any)[key] = value;
      }
    });
    
    return filters;
  }

  // Get filter suggestions based on current filters
  getFilterSuggestions(filters: PropertySearchFilters): string[] {
    const suggestions: string[] = [];
    
    if (filters.priceRange && filters.priceRange.max > 1000000) {
      suggestions.push('Consider adding luxury amenities like pool or security');
    }
    
    if (filters.bedrooms && filters.bedrooms >= 3) {
      suggestions.push('Family-friendly features like garden or pet-friendly options');
    }
    
    if (filters.propertyType === 'apartment') {
      suggestions.push('Check for building amenities like gym or parking');
    }
    
    return suggestions;
  }
}

export const searchFilterService = new SearchFilterService();
