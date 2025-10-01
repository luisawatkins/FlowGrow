import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Grid,
  GridItem,
  Text,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import {
  FilterIcon,
  SearchIcon,
  CloseIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { EnhancedFilterPanel } from '@/components/Search/EnhancedFilterPanel';
import { FilterChips } from '@/components/Search/FilterChips';
import { FilterPresets } from '@/components/Search/FilterPresets';
import { FilterAnalytics } from '@/components/Search/FilterAnalytics';
import { SearchBar } from '@/components/Search/SearchBar';
import { SearchResults } from '@/components/Search/SearchResults';
import { searchFilterService } from '@/lib/searchFilterService';

export default function EnhancedSearchPage() {
  const {
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
    removeChip,
    applyPreset,
    getActiveFilters,
  } = useSearchFilters();

  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDisclosure();
  const { isOpen: isPresetsOpen, onOpen: onPresetsOpen, onClose: onPresetsClose } = useDisclosure();

  // Mock search results - in real app, this would come from API
  const [searchResults, setSearchResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results based on filters
      const mockResults = [
        {
          id: '1',
          title: 'Modern Downtown Apartment',
          price: 450000,
          imageUrl: '/images/properties/apartment1.jpg',
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1200,
          propertyType: 'Apartment',
          location: 'Downtown',
        },
        {
          id: '2',
          title: 'Suburban Family Home',
          price: 750000,
          imageUrl: '/images/properties/house1.jpg',
          bedrooms: 4,
          bathrooms: 3,
          squareFeet: 2500,
          propertyType: 'House',
          location: 'Suburbs',
        },
        // Add more mock results based on filters
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: typeof filters) => {
    // Update filters and trigger search
    Object.keys(newFilters).forEach(key => {
      updateFilter(key as keyof typeof filters, newFilters[key as keyof typeof filters]);
    });
    
    // Trigger search with new filters
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  // Handle preset application
  const handleApplyPreset = (preset: any) => {
    applyPreset(preset);
    // Trigger search with preset filters
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  // Get filter presets
  const presets = searchFilterService.getFilterPresets();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Enhanced Property Search
          </Text>
          <Text color="gray.600">
            Find your perfect property with advanced filtering options
          </Text>
        </Box>

        {/* Search Bar */}
        <Box>
          <SearchBar onSearch={handleSearch} />
        </Box>

        {/* Filter Controls */}
        <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
          <HStack spacing={4}>
            <Button
              leftIcon={<FilterIcon />}
              onClick={onFilterDrawerOpen}
              variant="outline"
              size="sm"
            >
              Filters
              {hasActiveFilters && (
                <Badge colorScheme="blue" variant="solid" ml={2}>
                  {chips.length}
                </Badge>
              )}
            </Button>
            
            <Button
              leftIcon={<SettingsIcon />}
              onClick={onPresetsOpen}
              variant="ghost"
              size="sm"
            >
              Quick Filters
            </Button>
          </HStack>

          <HStack>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Filter Chips */}
        {chips.length > 0 && (
          <FilterChips
            chips={chips}
            onRemoveChip={removeChip}
            onClearAll={clearAllFilters}
            maxVisible={5}
            showClearAll={true}
          />
        )}

        {/* Validation Messages */}
        {validation && !validation.isValid && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>
              {validation.errors.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
          {/* Desktop Filter Panel */}
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <VStack spacing={4} align="stretch">
              <EnhancedFilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                chips={chips}
                onRemoveChip={removeChip}
                onClearAllChips={clearAllFilters}
                analytics={analytics}
                validation={validation}
                presets={presets}
                onApplyPreset={handleApplyPreset}
              />
              
              {analytics && (
                <FilterAnalytics
                  analytics={analytics}
                  onFilterClick={(filter) => {
                    // Handle filter click - could open specific filter
                    console.log('Filter clicked:', filter);
                  }}
                />
              )}
            </VStack>
          </GridItem>

          {/* Search Results */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              {/* Results Header */}
              <HStack justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="semibold">
                  Search Results
                  {searchResults.length > 0 && (
                    <Badge colorScheme="blue" variant="subtle" ml={2}>
                      {searchResults.length} properties
                    </Badge>
                  )}
                </Text>
                
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    {hasActiveFilters ? 'Filtered' : 'All'} results
                  </Text>
                </HStack>
              </HStack>

              {/* Search Results */}
              <SearchResults results={searchResults} isLoading={isLoading} />
            </VStack>
          </GridItem>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer isOpen={isFilterDrawerOpen} onClose={onFilterDrawerClose} size="full">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <HStack justify="space-between" align="center">
                <Text>Filter Properties</Text>
                <IconButton
                  aria-label="Close filters"
                  icon={<CloseIcon />}
                  onClick={onFilterDrawerClose}
                  variant="ghost"
                />
              </HStack>
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <EnhancedFilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  chips={chips}
                  onRemoveChip={removeChip}
                  onClearAllChips={clearAllFilters}
                  analytics={analytics}
                  validation={validation}
                  presets={presets}
                  onApplyPreset={handleApplyPreset}
                />
                
                {analytics && (
                  <FilterAnalytics
                    analytics={analytics}
                    onFilterClick={(filter) => {
                      console.log('Filter clicked:', filter);
                    }}
                  />
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Presets Drawer */}
        <Drawer isOpen={isPresetsOpen} onClose={onPresetsClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <HStack justify="space-between" align="center">
                <Text>Quick Filter Presets</Text>
                <IconButton
                  aria-label="Close presets"
                  icon={<CloseIcon />}
                  onClick={onPresetsClose}
                  variant="ghost"
                />
              </HStack>
            </DrawerHeader>
            <DrawerBody>
              <FilterPresets
                presets={presets}
                onApplyPreset={handleApplyPreset}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </VStack>
    </Container>
  );
}
