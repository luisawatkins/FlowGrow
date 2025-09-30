import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { PriceAlertsList } from '@/components/Alerts/PriceAlertsList';

export default function PriceAlertsPage() {
  const handleEdit = (alertId: string) => {
    // In a real application, this would open a modal to edit the alert
    // or navigate to an edit page
    console.log('Edit alert:', alertId);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={1}>
          <Heading size="lg">Price Alerts</Heading>
          <Text color="gray.600">
            Get notified when property prices change according to your criteria
          </Text>
        </VStack>

        <PriceAlertsList onEdit={handleEdit} />
      </VStack>
    </Container>
  );
}
