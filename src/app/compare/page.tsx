import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { ComparisonTable } from '@/components/Compare/ComparisonTable';
import { useComparison } from '@/hooks/useComparison';

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison, isLoading } = useComparison();
  const toast = useToast();

  const handleRemove = async (propertyId: string) => {
    try {
      await removeFromComparison(propertyId);
      toast({
        title: 'Property removed from comparison',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to remove property',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleClear = async () => {
    try {
      await clearComparison();
      toast({
        title: 'Comparison list cleared',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to clear comparison list',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (comparisonList.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Heading size="lg">No Properties to Compare</Heading>
          <Text color="gray.600">
            Add properties to your comparison list to see how they stack up.
          </Text>
          <Button
            colorScheme="blue"
            as="a"
            href="/search"
          >
            Browse Properties
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Compare Properties</Heading>
          <Button
            colorScheme="red"
            variant="ghost"
            onClick={handleClear}
            isDisabled={comparisonList.length === 0}
          >
            Clear All
          </Button>
        </HStack>

        <ComparisonTable
          properties={comparisonList}
          onRemove={handleRemove}
        />
      </VStack>
    </Container>
  );
}
