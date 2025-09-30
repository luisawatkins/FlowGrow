import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
} from '@chakra-ui/react';
import { SearchBar } from '@/components/Search/SearchBar';
import { FilterPanel, PropertyFilters } from '@/components/Search/FilterPanel';
import { SearchResults } from '@/components/Search/SearchResults';
import { useSearch } from '@/hooks/useSearch';

export default function SearchPage() {
  const { results, isLoading, search, applyFilters } = useSearch();

  const handleSearch = (query: string) => {
    search(query);
  };

  const handleFilterChange = (filters: PropertyFilters) => {
    applyFilters(filters);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <SearchBar onSearch={handleSearch} />
        
        <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
          <GridItem>
            <Box position="sticky" top="4">
              <FilterPanel onFilterChange={handleFilterChange} />
            </Box>
          </GridItem>
          
          <GridItem>
            <SearchResults results={results} isLoading={isLoading} />
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
}
