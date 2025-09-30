import React, { useState } from 'react';
import {
  Box,
  Input,
  IconButton,
  HStack,
  VStack,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Select,
  Button,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useRouter } from 'next/router';

interface SearchFilters {
  priceRange: [number, number];
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sortBy: string;
}

export const MobileSearchBar: React.FC = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 1000000],
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    sortBy: '',
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('q', searchQuery);
    if (filters.propertyType) queryParams.set('type', filters.propertyType);
    if (filters.bedrooms) queryParams.set('beds', filters.bedrooms);
    if (filters.bathrooms) queryParams.set('baths', filters.bathrooms);
    if (filters.sortBy) queryParams.set('sort', filters.sortBy);
    queryParams.set('minPrice', filters.priceRange[0].toString());
    queryParams.set('maxPrice', filters.priceRange[1].toString());

    router.push(`/search?${queryParams.toString()}`);
    onClose();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <>
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        py={2}
      >
        <HStack spacing={2}>
          <Box position="relative" flex={1}>
            <Input
              placeholder="Search by location, address, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              pr="40px"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <IconButton
              aria-label="Search"
              icon={<FaSearch />}
              position="absolute"
              right={2}
              top="50%"
              transform="translateY(-50%)"
              variant="ghost"
              onClick={handleSearch}
            />
          </Box>
          <IconButton
            aria-label="Filters"
            icon={<FaFilter />}
            onClick={onOpen}
            colorScheme="blue"
          />
        </HStack>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Filters</DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {/* Location Search */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Location
                </Text>
                <Input
                  placeholder="Enter location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<FaMapMarkerAlt />}
                />
              </Box>

              {/* Price Range */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Price Range
                </Text>
                <RangeSlider
                  value={filters.priceRange}
                  min={0}
                  max={1000000}
                  step={10000}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, priceRange: value }))
                  }
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="sm">
                    {formatPrice(filters.priceRange[0])}
                  </Text>
                  <Text fontSize="sm">
                    {formatPrice(filters.priceRange[1])}
                  </Text>
                </HStack>
              </Box>

              {/* Property Type */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Property Type
                </Text>
                <Select
                  placeholder="Any"
                  value={filters.propertyType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                    }))
                  }
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </Select>
              </Box>

              {/* Bedrooms */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Bedrooms
                </Text>
                <Select
                  placeholder="Any"
                  value={filters.bedrooms}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bedrooms: e.target.value,
                    }))
                  }
                >
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <option key={num} value={num}>
                      {num}+ Beds
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Bathrooms */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Bathrooms
                </Text>
                <Select
                  placeholder="Any"
                  value={filters.bathrooms}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bathrooms: e.target.value,
                    }))
                  }
                >
                  {[1, 2, 3, '4+'].map((num) => (
                    <option key={num} value={num}>
                      {num}+ Baths
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Sort By */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Sort By
                </Text>
                <Select
                  placeholder="Default"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  icon={<FaSortAmountDown />}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="size-desc">Size: Largest First</option>
                </Select>
              </Box>

              {/* Apply Filters Button */}
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSearch}
                position="fixed"
                bottom={4}
                left={4}
                right={4}
              >
                Show Results
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};