import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { SavedSearchesList } from '@/components/Search/SavedSearchesList';

export default function SavedSearchesPage() {
  const handleEdit = (searchId: string) => {
    // In a real application, this would navigate to the search page
    // with the saved search criteria pre-filled
    window.location.href = `/search?saved=${searchId}`;
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={1}>
          <Heading size="lg">Saved Searches</Heading>
          <Text color="gray.600">
            View and manage your saved property searches
          </Text>
        </VStack>

        <SavedSearchesList onEdit={handleEdit} />
      </VStack>
    </Container>
  );
}
