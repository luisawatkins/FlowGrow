import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';
import { ViewingScheduler } from '@/components/Scheduling/ViewingScheduler';

interface ScheduleViewingPageProps {
  params: {
    propertyId: string;
  };
  searchParams?: {
    agentId?: string;
  };
}

export default function ScheduleViewingPage({
  params,
  searchParams,
}: ScheduleViewingPageProps) {
  // In a real application, you might want to:
  // 1. Fetch property details
  // 2. Verify property availability
  // 3. Check user authentication
  // 4. Handle agent preferences

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <HStack spacing={2} mb={2}>
            <Icon as={FaCalendarAlt} color="blue.500" />
            <Heading size="lg">Schedule a Viewing</Heading>
          </HStack>
          <Text color="gray.600">
            Select your preferred date and time for viewing this property.
            Our agent will confirm your appointment shortly.
          </Text>
        </Box>

        <ViewingScheduler
          propertyId={params.propertyId}
          agentId={searchParams?.agentId || 'agent1'} {/* Default agent ID */}
        />
      </VStack>
    </Container>
  );
}
