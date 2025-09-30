import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { NeighborhoodInfo } from '@/components/Neighborhood/NeighborhoodInfo';

interface NeighborhoodPageProps {
  params: {
    propertyId: string;
  };
}

export default function NeighborhoodPage({
  params,
}: NeighborhoodPageProps) {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={1}>
          <Heading size="lg">Neighborhood Information</Heading>
          <Text color="gray.600">
            Explore detailed information about the neighborhood, including schools,
            transportation, amenities, and more.
          </Text>
        </VStack>

        <NeighborhoodInfo propertyId={params.propertyId} />
      </VStack>
    </Container>
  );
}
