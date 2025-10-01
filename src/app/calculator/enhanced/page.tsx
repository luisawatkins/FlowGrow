import React from 'react';
import {
  Box,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { EnhancedCalculator } from '@/components/Calculator/EnhancedCalculator';

export default function EnhancedCalculatorPage() {
  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="3xl" fontWeight="bold" mb={2}>
            Enhanced Mortgage Calculator
          </Text>
          <Text color="gray.600" fontSize="lg">
            Calculate your mortgage payments, affordability, and amortization schedule with advanced features
          </Text>
        </Box>

        {/* Calculator Component */}
        <EnhancedCalculator
          initialInputs={{
            propertyPrice: 500000,
            downPayment: 100000,
            interestRate: 6.5,
            loanTerm: 30,
            propertyTax: 5000,
            homeInsurance: 1200,
            pmi: 0,
            hoa: 0,
            monthlyIncome: 8000,
            monthlyDebts: 500,
            creditScore: 750,
          }}
          onResultsChange={(results) => {
            console.log('Calculation results:', results);
          }}
        />
      </VStack>
    </Box>
  );
}
