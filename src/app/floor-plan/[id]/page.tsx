import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { FloorPlanViewer } from '@/components/FloorPlan/FloorPlanViewer';

interface FloorPlanPageProps {
  params: {
    id: string;
  };
}

export default function FloorPlanPage({
  params,
}: FloorPlanPageProps) {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={1}>
          <Heading size="lg">Floor Plan</Heading>
          <Text color="gray.600">
            Interactive floor plan viewer with measurement tools
          </Text>
        </VStack>

        <FloorPlanViewer propertyId={params.id} />
      </VStack>
    </Container>
  );
}
