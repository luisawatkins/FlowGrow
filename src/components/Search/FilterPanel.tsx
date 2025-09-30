import React from 'react';
import {
  Box,
  VStack,
  Heading,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  Select,
  Text,
} from '@chakra-ui/react';

interface FilterPanelProps {
  onFilterChange: (filters: PropertyFilters) => void;
}

export interface PropertyFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  squareFeet?: {
    min: number;
    max: number;
  };
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'size-desc';
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<PropertyFilters>({
    priceRange: {
      min: 0,
      max: 1000000
    },
    propertyType: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    location: undefined,
    squareFeet: {
      min: 0,
      max: 5000
    },
    sortBy: undefined
  });

  const handlePriceRangeChange = (range: [number, number]) => {
    const newFilters = {
      ...filters,
      priceRange: {
        min: range[0],
        max: range[1]
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePropertyTypeChange = (type: string) => {
    const newFilters = { ...filters, propertyType: type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBedroomsChange = (value: string) => {
    const newFilters = { ...filters, bedrooms: value ? parseInt(value) : undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBathroomsChange = (value: string) => {
    const newFilters = { ...filters, bathrooms: value ? parseInt(value) : undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (value: string) => {
    const newFilters = { ...filters, location: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSquareFeetChange = (range: [number, number]) => {
    const newFilters = {
      ...filters,
      squareFeet: {
        min: range[0],
        max: range[1]
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value as PropertyFilters['sortBy'] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="sm">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="sm" mb={3}>Sort By</Heading>
          <Select
            placeholder="Default"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="size-desc">Largest First</option>
          </Select>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Price Range</Heading>
          <RangeSlider
            defaultValue={[filters.priceRange?.min || 0, filters.priceRange?.max || 1000000]}
            min={0}
            max={1000000}
            step={10000}
            onChange={handlePriceRangeChange}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text fontSize="sm" color="gray.600">
            ${(filters.priceRange?.min || 0).toLocaleString()} - ${(filters.priceRange?.max || 1000000).toLocaleString()}
          </Text>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Square Feet</Heading>
          <RangeSlider
            defaultValue={[filters.squareFeet?.min || 0, filters.squareFeet?.max || 5000]}
            min={0}
            max={5000}
            step={100}
            onChange={handleSquareFeetChange}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Text fontSize="sm" color="gray.600">
            {(filters.squareFeet?.min || 0).toLocaleString()} - {(filters.squareFeet?.max || 5000).toLocaleString()} sq ft
          </Text>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Property Type</Heading>
          <Select
            placeholder="Any"
            value={filters.propertyType}
            onChange={(e) => handlePropertyTypeChange(e.target.value)}
          >
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Studio">Studio</option>
            <option value="Villa">Villa</option>
          </Select>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Location</Heading>
          <Select
            placeholder="Any"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            <option value="Downtown">Downtown</option>
            <option value="Suburbs">Suburbs</option>
            <option value="Beachfront">Beachfront</option>
            <option value="City Center">City Center</option>
            <option value="Mountain Area">Mountain Area</option>
          </Select>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Bedrooms</Heading>
          <Select
            placeholder="Any"
            value={filters.bedrooms}
            onChange={(e) => handleBedroomsChange(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}+ Bedrooms</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Bathrooms</Heading>
          <Select
            placeholder="Any"
            value={filters.bathrooms}
            onChange={(e) => handleBathroomsChange(e.target.value)}
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num}+ Bathrooms</option>
            ))}
          </Select>
        </Box>
      </VStack>
    </Box>
  );
};
