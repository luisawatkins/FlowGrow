import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
} from '@chakra-ui/react';
import { TourViewer } from '@/components/VirtualTour/TourViewer';

interface VirtualTourPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    scene?: string;
  };
}

export default function VirtualTourPage({
  params,
  searchParams,
}: VirtualTourPageProps) {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Virtual Tour</Heading>
          <Text color="gray.600">
            Use your mouse or touch to look around. Click on hotspots to navigate or get more information.
          </Text>
        </Box>

        <TourViewer
          tourId={params.id}
          initialScene={searchParams?.scene}
        />
      </VStack>
    </Container>
  );
}
