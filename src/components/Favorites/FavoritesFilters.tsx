import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Input,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  FormHelperText,
  Collapse,
  useDisclosure,
  Badge,
  Wrap,
  WrapItem,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { FavoritesFilter, FavoritesFiltersProps } from '@/types/favorites';

export const FavoritesFilters: React.FC<FavoritesFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
  showAdvanced = false,
}) => {
  const { isOpen: isAdvancedOpen, onToggle: onAdvancedToggle } = useDisclosure();

  // Handle filter changes
  const handleFilterChange = (key: keyof FavoritesFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Handle range changes
  const handleRangeChange = (key: keyof FavoritesFilter, range: [number, number]) => {
    handleFilterChange(key, { min: range[0], max: range[1] });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key: keyof FavoritesFilter, checked: boolean) => {
    handleFilterChange(key, checked);
  };

  // Handle multiselect changes
  const handleMultiselectChange = (key: keyof FavoritesFilter, values: string[]) => {
    handleFilterChange(key, values);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.propertyType) count++;
    if (filters.priceRange) count++;
    if (filters.location) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.priority) count++;
    if (filters.status) count++;
    if (filters.addedDateRange) count++;
    if (filters.hasNotes !== undefined) count++;
    if (filters.hasPriceAlerts !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Box className={className} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <HStack justify="space-between" align="center">
          <HStack>
            <FilterIcon />
            <Text fontSize="lg" fontWeight="semibold">
              Filter Favorites
            </Text>
            {activeFilterCount > 0 && (
              <Badge colorScheme="blue" variant="subtle">
                {activeFilterCount}
              </Badge>
            )}
          </HStack>
          <HStack>
            {activeFilterCount > 0 && (
              <Button size="sm" variant="ghost" colorScheme="red" onClick={onClearFilters}>
                Clear All
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onAdvancedToggle}
              rightIcon={isAdvancedOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {isAdvancedOpen ? 'Hide' : 'Show'} Advanced
            </Button>
          </HStack>
        </HStack>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <Box mt={3}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
              Active Filters:
            </Text>
            <Wrap spacing={2}>
              {filters.searchTerm && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm">Search: {filters.searchTerm}</Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => handleFilterChange('searchTerm', undefined)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              )}
              {filters.propertyType && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm">Type: {filters.propertyType}</Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => handleFilterChange('propertyType', undefined)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              )}
              {filters.priceRange && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm">
                      Price: ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}
                    </Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => handleFilterChange('priceRange', undefined)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              )}
              {filters.location && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm">Location: {filters.location}</Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => handleFilterChange('location', undefined)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              )}
              {filters.tags && filters.tags.length > 0 && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm">Tags: {filters.tags.join(', ')}</Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => handleFilterChange('tags', undefined)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              )}
              {filters.priority && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  <HStack spacing={2}>
                    <Text fontSize="sm">Priority: {filters.priority}</Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => handleFilterChange('priority', undefined)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              )}
            </Wrap>
          </Box>
        )}
      </Box>

      {/* Filter Content */}
      <Box p={4}>
        <VStack spacing={6} align="stretch">
          {/* Basic Filters */}
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" fontWeight="semibold" color="gray.700">
              Basic Filters
            </Text>

            {/* Search Term */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Search
              </FormLabel>
              <Input
                value={filters.searchTerm || ''}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value || undefined)}
                placeholder="Search in titles, locations, notes, and tags..."
              />
            </FormControl>

            {/* Property Type */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Property Type
              </FormLabel>
              <Select
                value={filters.propertyType || ''}
                onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
                placeholder="Any type"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </Select>
            </FormControl>

            {/* Price Range */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Price Range
              </FormLabel>
              <RangeSlider
                value={[filters.priceRange?.min || 0, filters.priceRange?.max || 2000000]}
                min={0}
                max={2000000}
                step={10000}
                onChange={(val) => handleRangeChange('priceRange', val)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.600">
                  ${(filters.priceRange?.min || 0).toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  ${(filters.priceRange?.max || 2000000).toLocaleString()}
                </Text>
              </HStack>
            </FormControl>

            {/* Location */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Location
              </FormLabel>
              <Input
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                placeholder="Enter city, neighborhood, or address..."
              />
            </FormControl>

            {/* Priority */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Priority
              </FormLabel>
              <Select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                placeholder="Any priority"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </Select>
            </FormControl>
          </VStack>

          {/* Advanced Filters */}
          <Collapse in={isAdvancedOpen || showAdvanced}>
            <Divider />
            <VStack spacing={4} align="stretch" pt={4}>
              <Text fontSize="md" fontWeight="semibold" color="gray.700">
                Advanced Filters
              </Text>

              {/* Tags */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Tags
                </FormLabel>
                <CheckboxGroup
                  value={filters.tags || []}
                  onChange={(values) => handleMultiselectChange('tags', values as string[])}
                >
                  <SimpleGrid columns={2} spacing={2}>
                    <Checkbox value="downtown">Downtown</Checkbox>
                    <Checkbox value="modern">Modern</Checkbox>
                    <Checkbox value="family">Family</Checkbox>
                    <Checkbox value="luxury">Luxury</Checkbox>
                    <Checkbox value="investment">Investment</Checkbox>
                    <Checkbox value="work">Work</Checkbox>
                    <Checkbox value="schools">Schools</Checkbox>
                    <Checkbox value="beachfront">Beachfront</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              {/* Status */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Status
                </FormLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  placeholder="Any status"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="removed">Removed</option>
                </Select>
              </FormControl>

              {/* Date Range */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Added Date Range
                </FormLabel>
                <SimpleGrid columns={2} spacing={4}>
                  <Input
                    type="date"
                    value={filters.addedDateRange?.start || ''}
                    onChange={(e) => handleFilterChange('addedDateRange', {
                      ...filters.addedDateRange,
                      start: e.target.value,
                    })}
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    value={filters.addedDateRange?.end || ''}
                    onChange={(e) => handleFilterChange('addedDateRange', {
                      ...filters.addedDateRange,
                      end: e.target.value,
                    })}
                    placeholder="End date"
                  />
                </SimpleGrid>
              </FormControl>

              {/* Special Filters */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Special Filters
                </FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox
                    isChecked={filters.hasNotes || false}
                    onChange={(e) => handleCheckboxChange('hasNotes', e.target.checked)}
                  >
                    Has Notes
                  </Checkbox>
                  <Checkbox
                    isChecked={filters.hasPriceAlerts || false}
                    onChange={(e) => handleCheckboxChange('hasPriceAlerts', e.target.checked)}
                  >
                    Has Price Alerts
                  </Checkbox>
                </VStack>
              </FormControl>
            </VStack>
          </Collapse>

          {/* Sort Options */}
          <Divider />
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" fontWeight="semibold" color="gray.700">
              Sort Options
            </Text>

            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Sort By
                </FormLabel>
                <Select
                  value={filters.sortBy || 'added_date'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="added_date">Date Added</option>
                  <option value="price">Price</option>
                  <option value="property_type">Property Type</option>
                  <option value="location">Location</option>
                  <option value="last_viewed">Last Viewed</option>
                  <option value="priority">Priority</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Sort Order
                </FormLabel>
                <Select
                  value={filters.sortOrder || 'desc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};
