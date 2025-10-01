import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Divider,
  Text,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
  SimpleGrid,
} from '@chakra-ui/react';
import { CalculatorInputs } from '@/types/calculator';

interface CalculatorInputsFormProps {
  inputs: CalculatorInputs;
  onInputChange: (field: keyof CalculatorInputs, value: number) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

export const CalculatorInputsForm: React.FC<CalculatorInputsFormProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  isLoading,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const downPaymentPercent = (inputs.downPayment / inputs.propertyPrice) * 100;
  const loanAmount = inputs.propertyPrice - inputs.downPayment;
  const loanToValue = (loanAmount / inputs.propertyPrice) * 100;

  return (
    <VStack spacing={6} align="stretch">
      {/* Property Information */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Property Information
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Property Price</FormLabel>
            <NumberInput
              value={inputs.propertyPrice}
              onChange={(valueString) => onInputChange('propertyPrice', parseFloat(valueString) || 0)}
              min={0}
              step={1000}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Down Payment</FormLabel>
            <NumberInput
              value={inputs.downPayment}
              onChange={(valueString) => onInputChange('downPayment', parseFloat(valueString) || 0)}
              min={0}
              step={1000}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {formatPercent(downPaymentPercent)} of purchase price
            </Text>
          </FormControl>
        </SimpleGrid>

        {/* Loan Summary */}
        <Box mt={4} p={4} bg="blue.50" borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="medium">Loan Amount:</Text>
            <Text fontWeight="bold">{formatCurrency(loanAmount)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="medium">Loan-to-Value:</Text>
            <Badge colorScheme={loanToValue <= 80 ? 'green' : 'orange'}>
              {formatPercent(loanToValue)}
            </Badge>
          </HStack>
        </Box>
      </Box>

      <Divider />

      {/* Loan Terms */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Loan Terms
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Interest Rate (%)</FormLabel>
            <NumberInput
              value={inputs.interestRate}
              onChange={(valueString) => onInputChange('interestRate', parseFloat(valueString) || 0)}
              min={0}
              max={20}
              step={0.125}
              precision={3}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Loan Term (years)</FormLabel>
            <NumberInput
              value={inputs.loanTerm}
              onChange={(valueString) => onInputChange('loanTerm', parseInt(valueString) || 0)}
              min={1}
              max={50}
              step={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Additional Costs */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Additional Costs (Annual)
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Property Tax</FormLabel>
            <NumberInput
              value={inputs.propertyTax}
              onChange={(valueString) => onInputChange('propertyTax', parseFloat(valueString) || 0)}
              min={0}
              step={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Home Insurance</FormLabel>
            <NumberInput
              value={inputs.homeInsurance}
              onChange={(valueString) => onInputChange('homeInsurance', parseFloat(valueString) || 0)}
              min={0}
              step={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>PMI (Private Mortgage Insurance)</FormLabel>
            <NumberInput
              value={inputs.pmi}
              onChange={(valueString) => onInputChange('pmi', parseFloat(valueString) || 0)}
              min={0}
              step={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Required if down payment < 20%
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>HOA Fees</FormLabel>
            <NumberInput
              value={inputs.hoa}
              onChange={(valueString) => onInputChange('hoa', parseFloat(valueString) || 0)}
              min={0}
              step={50}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Income Information */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Income Information
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Monthly Income</FormLabel>
            <NumberInput
              value={inputs.monthlyIncome}
              onChange={(valueString) => onInputChange('monthlyIncome', parseFloat(valueString) || 0)}
              min={0}
              step={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Monthly Debts</FormLabel>
            <NumberInput
              value={inputs.monthlyDebts}
              onChange={(valueString) => onInputChange('monthlyDebts', parseFloat(valueString) || 0)}
              min={0}
              step={50}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Credit cards, car loans, etc.
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Credit Score</FormLabel>
            <NumberInput
              value={inputs.creditScore}
              onChange={(valueString) => onInputChange('creditScore', parseInt(valueString) || 0)}
              min={300}
              max={850}
              step={10}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Affects interest rate
            </Text>
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* PMI Warning */}
      {downPaymentPercent < 20 && (
        <Alert status="warning">
          <AlertIcon />
          <AlertDescription>
            Down payment is less than 20%. PMI may be required and will increase your monthly payment.
          </AlertDescription>
        </Alert>
      )}

      {/* Calculate Button */}
      <Button
        colorScheme="blue"
        size="lg"
        onClick={onCalculate}
        isLoading={isLoading}
        loadingText="Calculating..."
      >
        Calculate Mortgage
      </Button>
    </VStack>
  );
};
