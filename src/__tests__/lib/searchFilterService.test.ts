import { searchFilterService } from '@/lib/searchFilterService';
import { PropertySearchFilters } from '@/types/search';

describe('SearchFilterService', () => {
  describe('getDefaultFilters', () => {
    it('should return default filter values', () => {
      const defaultFilters = searchFilterService.getDefaultFilters();
      
      expect(defaultFilters).toHaveProperty('priceRange');
      expect(defaultFilters).toHaveProperty('squareFootageRange');
      expect(defaultFilters).toHaveProperty('yearBuilt');
      expect(defaultFilters).toHaveProperty('sortBy', 'relevance');
      expect(defaultFilters).toHaveProperty('page', 1);
      expect(defaultFilters).toHaveProperty('limit', 20);
    });
  });

  describe('getFilterCategories', () => {
    it('should return filter categories', () => {
      const categories = searchFilterService.getFilterCategories();
      
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      
      // Check that each category has required properties
      categories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('type');
      });
    });
  });

  describe('getFilterPresets', () => {
    it('should return filter presets', () => {
      const presets = searchFilterService.getFilterPresets();
      
      expect(presets).toBeInstanceOf(Array);
      expect(presets.length).toBeGreaterThan(0);
      
      // Check that each preset has required properties
      presets.forEach(preset => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('filters');
      });
    });
  });

  describe('createFilterChips', () => {
    it('should create chips for active filters', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 100000, max: 500000 },
        bedrooms: 2,
        propertyType: 'house',
        petFriendly: true,
      };
      
      const chips = searchFilterService.createFilterChips(filters);
      
      expect(chips).toBeInstanceOf(Array);
      expect(chips.length).toBeGreaterThan(0);
      
      // Check that chips have required properties
      chips.forEach(chip => {
        expect(chip).toHaveProperty('id');
        expect(chip).toHaveProperty('label');
        expect(chip).toHaveProperty('value');
        expect(chip).toHaveProperty('category');
        expect(chip).toHaveProperty('removable');
      });
    });

    it('should not create chips for default values', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 0, max: 2000000 },
        squareFootageRange: { min: 0, max: 10000 },
      };
      
      const chips = searchFilterService.createFilterChips(filters);
      
      // Should not create chips for default values
      expect(chips.length).toBe(0);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return true for filters with non-default values', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 100000, max: 500000 },
        bedrooms: 2,
      };
      
      const hasActive = searchFilterService.hasActiveFilters(filters);
      expect(hasActive).toBe(true);
    });

    it('should return false for default filter values', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 0, max: 2000000 },
        squareFootageRange: { min: 0, max: 10000 },
      };
      
      const hasActive = searchFilterService.hasActiveFilters(filters);
      expect(hasActive).toBe(false);
    });
  });

  describe('validateFilters', () => {
    it('should validate price range correctly', () => {
      const validFilters: PropertySearchFilters = {
        priceRange: { min: 100000, max: 500000 },
      };
      
      const validation = searchFilterService.validateFilters(validFilters);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid price range', () => {
      const invalidFilters: PropertySearchFilters = {
        priceRange: { min: 500000, max: 100000 }, // max < min
      };
      
      const validation = searchFilterService.validateFilters(invalidFilters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should detect negative prices', () => {
      const invalidFilters: PropertySearchFilters = {
        priceRange: { min: -1000, max: 500000 },
      };
      
      const validation = searchFilterService.validateFilters(invalidFilters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Minimum price cannot be negative');
    });

    it('should validate square footage range', () => {
      const validFilters: PropertySearchFilters = {
        squareFootageRange: { min: 1000, max: 3000 },
      };
      
      const validation = searchFilterService.validateFilters(validFilters);
      expect(validation.isValid).toBe(true);
    });

    it('should detect invalid square footage range', () => {
      const invalidFilters: PropertySearchFilters = {
        squareFootageRange: { min: 3000, max: 1000 }, // max < min
      };
      
      const validation = searchFilterService.validateFilters(invalidFilters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Maximum square footage must be greater than minimum');
    });

    it('should validate year built range', () => {
      const currentYear = new Date().getFullYear();
      const validFilters: PropertySearchFilters = {
        yearBuilt: { min: 2000, max: currentYear },
      };
      
      const validation = searchFilterService.validateFilters(validFilters);
      expect(validation.isValid).toBe(true);
    });

    it('should detect future year built', () => {
      const currentYear = new Date().getFullYear();
      const invalidFilters: PropertySearchFilters = {
        yearBuilt: { min: 2000, max: currentYear + 1 },
      };
      
      const validation = searchFilterService.validateFilters(invalidFilters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Maximum year cannot be in the future');
    });

    it('should validate bedrooms and bathrooms', () => {
      const validFilters: PropertySearchFilters = {
        bedrooms: 2,
        bathrooms: 1,
      };
      
      const validation = searchFilterService.validateFilters(validFilters);
      expect(validation.isValid).toBe(true);
    });

    it('should detect negative bedrooms', () => {
      const invalidFilters: PropertySearchFilters = {
        bedrooms: -1,
      };
      
      const validation = searchFilterService.validateFilters(invalidFilters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Number of bedrooms cannot be negative');
    });

    it('should detect negative bathrooms', () => {
      const invalidFilters: PropertySearchFilters = {
        bathrooms: -1,
      };
      
      const validation = searchFilterService.validateFilters(invalidFilters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Number of bathrooms cannot be negative');
    });
  });

  describe('generateAnalytics', () => {
    it('should generate analytics for filters', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 100000, max: 500000 },
        bedrooms: 2,
        propertyType: 'house',
      };
      
      const analytics = searchFilterService.generateAnalytics(filters, 1000);
      
      expect(analytics).toHaveProperty('totalResults', 1000);
      expect(analytics).toHaveProperty('filteredResults');
      expect(analytics).toHaveProperty('filterCounts');
      expect(analytics).toHaveProperty('popularFilters');
      expect(analytics).toHaveProperty('suggestedFilters');
    });
  });

  describe('applyPreset', () => {
    it('should apply preset filters', () => {
      const presets = searchFilterService.getFilterPresets();
      const firstPreset = presets[0];
      
      const appliedFilters = searchFilterService.applyPreset(firstPreset);
      
      expect(appliedFilters).toMatchObject(firstPreset.filters);
    });
  });

  describe('clearFilter', () => {
    it('should clear specific filter', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 100000, max: 500000 },
        bedrooms: 2,
        propertyType: 'house',
      };
      
      const clearedFilters = searchFilterService.clearFilter(filters, 'bedrooms');
      
      expect(clearedFilters).not.toHaveProperty('bedrooms');
      expect(clearedFilters).toHaveProperty('priceRange');
      expect(clearedFilters).toHaveProperty('propertyType');
    });
  });

  describe('clearAllFilters', () => {
    it('should return default filters', () => {
      const clearedFilters = searchFilterService.clearAllFilters();
      const defaultFilters = searchFilterService.getDefaultFilters();
      
      expect(clearedFilters).toEqual(defaultFilters);
    });
  });

  describe('exportToUrl', () => {
    it('should export filters to URL string', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 100000, max: 500000 },
        bedrooms: 2,
        propertyType: 'house',
      };
      
      const urlString = searchFilterService.exportToUrl(filters);
      
      expect(urlString).toContain('priceRange');
      expect(urlString).toContain('bedrooms');
      expect(urlString).toContain('propertyType');
    });
  });

  describe('importFromUrl', () => {
    it('should import filters from URL string', () => {
      const urlString = 'priceRange=%7B%22min%22%3A100000%2C%22max%22%3A500000%7D&bedrooms=2&propertyType=house';
      
      const importedFilters = searchFilterService.importFromUrl(urlString);
      
      expect(importedFilters).toHaveProperty('priceRange');
      expect(importedFilters).toHaveProperty('bedrooms', 2);
      expect(importedFilters).toHaveProperty('propertyType', 'house');
    });
  });

  describe('getFilterSuggestions', () => {
    it('should provide filter suggestions', () => {
      const filters: PropertySearchFilters = {
        priceRange: { min: 0, max: 1500000 },
        bedrooms: 3,
        propertyType: 'apartment',
      };
      
      const suggestions = searchFilterService.getFilterSuggestions(filters);
      
      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});
