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
  priceRange: [number, number];
  propertyTypes: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<PropertyFilters>({
    priceRange: [0, 1000000],
    propertyTypes: [],
    bedrooms: null,
    bathrooms: null,
    amenities: [],
  });

  const handlePriceRangeChange = (range: [number, number]) => {
    const newFilters = { ...filters, priceRange: range };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.propertyTypes, type]
      : filters.propertyTypes.filter(t => t !== type);
    const newFilters = { ...filters, propertyTypes: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBedroomsChange = (value: string) => {
    const newFilters = { ...filters, bedrooms: value ? parseInt(value) : null };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBathroomsChange = (value: string) => {
    const newFilters = { ...filters, bathrooms: value ? parseInt(value) : null };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="sm">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="sm" mb={3}>Price Range</Heading>
          <RangeSlider
            defaultValue={filters.priceRange}
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
            ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
          </Text>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Property Type</Heading>
          <VStack align="start">
            {['House', 'Apartment', 'Condo', 'Townhouse'].map(type => (
              <Checkbox
                key={type}
                onChange={(e) => handlePropertyTypeChange(type, e.target.checked)}
              >
                {type}
              </Checkbox>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Bedrooms</Heading>
          <Select
            placeholder="Any"
            onChange={(e) => handleBedroomsChange(e.target.value)}
          >
            {[1, 2, 3, 4, '5+'].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Bathrooms</Heading>
          <Select
            placeholder="Any"
            onChange={(e) => handleBathroomsChange(e.target.value)}
          >
            {[1, 1.5, 2, 2.5, 3, '3+'].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Heading size="sm" mb={3}>Amenities</Heading>
          <VStack align="start">
            {[
              'Parking',
              'Pool',
              'Garden',
              'Gym',
              'Security System',
              'Air Conditioning'
            ].map(amenity => (
              <Checkbox
                key={amenity}
                onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
              >
                {amenity}
              </Checkbox>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
