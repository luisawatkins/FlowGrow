import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
} from '@chakra-ui/react';
import { MortgageCalculator } from '@/components/Calculator/MortgageCalculator';

interface MortgageCalculatorPageProps {
  searchParams?: {
    price?: string;
  };
}

export default function MortgageCalculatorPage({
  searchParams,
}: MortgageCalculatorPageProps) {
  const propertyPrice = searchParams?.price
    ? parseInt(searchParams.price, 10)
    : undefined;

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Mortgage Calculator</Heading>
          <Text color="gray.600">
            Calculate your estimated monthly mortgage payments and see a detailed breakdown of costs.
          </Text>
        </Box>

        <MortgageCalculator propertyPrice={propertyPrice} />
      </VStack>
    </Container>
  );
}
