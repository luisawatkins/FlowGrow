import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Collapse,
  Divider,
  Badge,
  IconButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuGroupTitle,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  FilterIcon,
  SettingsIcon,
  DownloadIcon,
  UploadIcon,
  RefreshIcon,
  InfoIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { PropertySearchFilters, SearchFilterChip, SearchFilterPreset, SearchFilterAnalytics, SearchFilterValidation } from '@/types/search';
import { searchFilterService } from '@/lib/searchFilterService';

interface EnhancedFilterPanelProps {
  filters: PropertySearchFilters;
  onFiltersChange: (filters: PropertySearchFilters) => void;
  chips: SearchFilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAllChips: () => void;
  analytics?: SearchFilterAnalytics;
  validation?: SearchFilterValidation;
  presets?: SearchFilterPreset[];
  onApplyPreset?: (preset: SearchFilterPreset) => void;
  className?: string;
}

export const EnhancedFilterPanel: React.FC<EnhancedFilterPanelProps> = ({
  filters,
  onFiltersChange,
  chips,
  onRemoveChip,
  onClearAllChips,
  analytics,
  validation,
  presets = [],
  onApplyPreset,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isOpen: isPresetsOpen, onToggle: onPresetsToggle } = useDisclosure();

  // Handle filter updates
  const handleFilterChange = (key: keyof PropertySearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Handle range changes
  const handleRangeChange = (key: keyof PropertySearchFilters, range: [number, number]) => {
    handleFilterChange(key, { min: range[0], max: range[1] });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key: keyof PropertySearchFilters, checked: boolean) => {
    handleFilterChange(key, checked);
  };

  // Handle multiselect changes
  const handleMultiselectChange = (key: keyof PropertySearchFilters, values: string[]) => {
    handleFilterChange(key, values);
  };

  // Get filter categories
  const categories = searchFilterService.getFilterCategories();

  return (
    <Box className={className} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <HStack justify="space-between" align="center">
          <HStack>
            <FilterIcon />
            <Text fontSize="lg" fontWeight="semibold">
              Filters
            </Text>
            {chips.length > 0 && (
              <Badge colorScheme="blue" variant="subtle">
                {chips.length}
              </Badge>
            )}
          </HStack>
          <HStack>
            <IconButton
              aria-label="Toggle advanced filters"
              icon={<SettingsIcon />}
              size="sm"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
            />
            <IconButton
              aria-label="Toggle filters"
              icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </HStack>
        </HStack>

        {/* Filter Chips */}
        {chips.length > 0 && (
          <Box mt={3}>
            <HStack wrap="wrap" spacing={2}>
              {chips.map((chip) => (
                <Badge
                  key={chip.id}
                  colorScheme="blue"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                  cursor="pointer"
                  _hover={{ bg: 'blue.100' }}
                >
                  <HStack spacing={2}>
                    <Text fontSize="sm">{chip.label}</Text>
                    <CloseIcon
                      boxSize={3}
                      onClick={() => onRemoveChip(chip.id)}
                      cursor="pointer"
                    />
                  </HStack>
                </Badge>
              ))}
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={onClearAllChips}
              >
                Clear All
              </Button>
            </HStack>
          </Box>
        )}

        {/* Validation Messages */}
        {validation && !validation.isValid && (
          <Alert status="error" mt={3} size="sm">
            <AlertIcon />
            <AlertDescription>
              {validation.errors.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {validation && validation.warnings.length > 0 && (
          <Alert status="warning" mt={3} size="sm">
            <WarningIcon />
            <AlertDescription>
              {validation.warnings.join(', ')}
            </AlertDescription>
          </Alert>
        )}
      </Box>

      {/* Filter Content */}
      <Collapse in={isExpanded}>
        <Box p={4}>
          <VStack spacing={6} align="stretch">
            {/* Basic Filters */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="md" fontWeight="semibold" color="gray.700">
                Basic Filters
              </Text>

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

              {/* Square Footage Range */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Square Footage
                </FormLabel>
                <RangeSlider
                  value={[filters.squareFootageRange?.min || 0, filters.squareFootageRange?.max || 10000]}
                  min={0}
                  max={10000}
                  step={100}
                  onChange={(val) => handleRangeChange('squareFootageRange', val)}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="sm" color="gray.600">
                    {(filters.squareFootageRange?.min || 0).toLocaleString()} sq ft
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {(filters.squareFootageRange?.max || 10000).toLocaleString()} sq ft
                  </Text>
                </HStack>
              </FormControl>

              {/* Bedrooms and Bathrooms */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Bedrooms
                  </FormLabel>
                  <Select
                    value={filters.bedrooms || ''}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Any"
                  >
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Bathrooms
                  </FormLabel>
                  <Select
                    value={filters.bathrooms || ''}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Any"
                  >
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Property Type */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Property Type
                </FormLabel>
                <Select
                  value={filters.propertyType || ''}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
                  placeholder="Any"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                </Select>
              </FormControl>

              {/* Location */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Location
                </FormLabel>
                <Input
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  placeholder="Enter city, neighborhood, or address"
                />
              </FormControl>
            </VStack>

            {/* Advanced Filters */}
            {showAdvanced && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <Text fontSize="md" fontWeight="semibold" color="gray.700">
                    Advanced Filters
                  </Text>

                  {/* Amenities */}
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Amenities
                    </FormLabel>
                    <CheckboxGroup
                      value={filters.amenities || []}
                      onChange={(values) => handleMultiselectChange('amenities', values as string[])}
                    >
                      <SimpleGrid columns={2} spacing={2}>
                        <Checkbox value="pool">Pool</Checkbox>
                        <Checkbox value="garage">Garage</Checkbox>
                        <Checkbox value="garden">Garden</Checkbox>
                        <Checkbox value="fireplace">Fireplace</Checkbox>
                        <Checkbox value="security">Security</Checkbox>
                        <Checkbox value="gym">Gym</Checkbox>
                        <Checkbox value="parking">Parking</Checkbox>
                        <Checkbox value="balcony">Balcony</Checkbox>
                      </SimpleGrid>
                    </CheckboxGroup>
                  </FormControl>

                  {/* Year Built */}
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Year Built
                    </FormLabel>
                    <RangeSlider
                      value={[filters.yearBuilt?.min || 1900, filters.yearBuilt?.max || new Date().getFullYear()]}
                      min={1900}
                      max={new Date().getFullYear()}
                      step={1}
                      onChange={(val) => handleRangeChange('yearBuilt', val)}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                    <HStack justify="space-between" mt={2}>
                      <Text fontSize="sm" color="gray.600">
                        {filters.yearBuilt?.min || 1900}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {filters.yearBuilt?.max || new Date().getFullYear()}
                      </Text>
                    </HStack>
                  </FormControl>

                  {/* Special Features */}
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Special Features
                    </FormLabel>
                    <VStack align="stretch" spacing={2}>
                      <Checkbox
                        isChecked={filters.petFriendly || false}
                        onChange={(e) => handleCheckboxChange('petFriendly', e.target.checked)}
                      >
                        Pet Friendly
                      </Checkbox>
                      <Checkbox
                        isChecked={filters.furnished || false}
                        onChange={(e) => handleCheckboxChange('furnished', e.target.checked)}
                      >
                        Furnished
                      </Checkbox>
                      <Checkbox
                        isChecked={filters.hasPool || false}
                        onChange={(e) => handleCheckboxChange('hasPool', e.target.checked)}
                      >
                        Has Pool
                      </Checkbox>
                      <Checkbox
                        isChecked={filters.hasGarden || false}
                        onChange={(e) => handleCheckboxChange('hasGarden', e.target.checked)}
                      >
                        Has Garden
                      </Checkbox>
                      <Checkbox
                        isChecked={filters.hasGarage || false}
                        onChange={(e) => handleCheckboxChange('hasGarage', e.target.checked)}
                      >
                        Has Garage
                      </Checkbox>
                      <Checkbox
                        isChecked={filters.hasFireplace || false}
                        onChange={(e) => handleCheckboxChange('hasFireplace', e.target.checked)}
                      >
                        Has Fireplace
                      </Checkbox>
                      <Checkbox
                        isChecked={filters.hasSecurity || false}
                        onChange={(e) => handleCheckboxChange('hasSecurity', e.target.checked)}
                      >
                        Has Security
                      </Checkbox>
                    </VStack>
                  </FormControl>
                </VStack>
              </>
            )}

            {/* Presets */}
            {presets.length > 0 && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                      Quick Filters
                    </Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onPresetsToggle}
                    >
                      {isPresetsOpen ? 'Hide' : 'Show'} Presets
                    </Button>
                  </HStack>
                  
                  <Collapse in={isPresetsOpen}>
                    <SimpleGrid columns={1} spacing={2}>
                      {presets.map((preset) => (
                        <Button
                          key={preset.id}
                          size="sm"
                          variant="outline"
                          justifyContent="flex-start"
                          onClick={() => onApplyPreset?.(preset)}
                        >
                          <HStack>
                            <Text>{preset.icon}</Text>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium">
                                {preset.name}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {preset.description}
                              </Text>
                            </VStack>
                          </HStack>
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Collapse>
                </VStack>
              </>
            )}

            {/* Analytics */}
            {analytics && (
              <>
                <Divider />
                <VStack spacing={2} align="stretch">
                  <Text fontSize="md" fontWeight="semibold" color="gray.700">
                    Search Results
                  </Text>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Total Results
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {analytics.totalResults.toLocaleString()}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Filtered Results
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {analytics.filteredResults.toLocaleString()}
                    </Text>
                  </HStack>
                </VStack>
              </>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};
