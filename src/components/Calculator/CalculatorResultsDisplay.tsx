import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Progress,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { CalculatorResults } from '@/types/calculator';

interface CalculatorResultsDisplayProps {
  results: CalculatorResults;
}

export const CalculatorResultsDisplay: React.FC<CalculatorResultsDisplayProps> = ({
  results,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const { mortgage, affordability, summary } = results;

  return (
    <VStack spacing={6} align="stretch">
      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Stat>
          <StatLabel>Monthly Payment</StatLabel>
          <StatNumber color="blue.500" fontSize="2xl">
            {formatCurrency(mortgage.totalMonthlyPayment)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            Total monthly cost
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Total Interest</StatLabel>
          <StatNumber color="red.500" fontSize="2xl">
            {formatCurrency(mortgage.totalInterest)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            Over {mortgage.loanTerm} years
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Affordability Score</StatLabel>
          <StatNumber 
            color={affordability.affordabilityScore > 70 ? 'green.500' : 'orange.500'} 
            fontSize="2xl"
          >
            {affordability.affordabilityScore.toFixed(0)}/100
          </StatNumber>
          <StatHelpText>
            <StatArrow type={affordability.affordabilityScore > 70 ? 'increase' : 'decrease'} />
            {affordability.isAffordable ? 'Affordable' : 'May be challenging'}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Total Cost</StatLabel>
          <StatNumber fontSize="2xl">
            {formatCurrency(mortgage.totalCost)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            Purchase price + interest
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Payment Breakdown */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Monthly Payment Breakdown
          </Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text>Principal & Interest:</Text>
              <Text fontWeight="bold">{formatCurrency(mortgage.principalAndInterest)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Property Tax:</Text>
              <Text>{formatCurrency(mortgage.propertyTax)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Home Insurance:</Text>
              <Text>{formatCurrency(mortgage.homeInsurance)}</Text>
            </HStack>
            {mortgage.pmi > 0 && (
              <HStack justify="space-between">
                <Text>PMI:</Text>
                <Text>{formatCurrency(mortgage.pmi)}</Text>
              </HStack>
            )}
            {mortgage.hoa > 0 && (
              <HStack justify="space-between">
                <Text>HOA Fees:</Text>
                <Text>{formatCurrency(mortgage.hoa)}</Text>
              </HStack>
            )}
            <Divider />
            <HStack justify="space-between" fontSize="lg" fontWeight="bold">
              <Text>Total Monthly Payment:</Text>
              <Text color="blue.500">{formatCurrency(mortgage.totalMonthlyPayment)}</Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Affordability Analysis */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Affordability Analysis
          </Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Debt-to-Income Ratio
                </Text>
                <Progress
                  value={affordability.debtToIncomeRatio}
                  max={50}
                  colorScheme={affordability.debtToIncomeRatio <= 43 ? 'green' : 'red'}
                  size="lg"
                  borderRadius="md"
                />
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="sm">{formatPercent(affordability.debtToIncomeRatio)}</Text>
                  <Text fontSize="sm" color="gray.600">Target: ≤43%</Text>
                </HStack>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Payment-to-Income Ratio
                </Text>
                <Progress
                  value={affordability.paymentToIncomeRatio}
                  max={35}
                  colorScheme={affordability.paymentToIncomeRatio <= 28 ? 'green' : 'red'}
                  size="lg"
                  borderRadius="md"
                />
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="sm">{formatPercent(affordability.paymentToIncomeRatio)}</Text>
                  <Text fontSize="sm" color="gray.600">Target: ≤28%</Text>
                </HStack>
              </Box>
            </SimpleGrid>

            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="medium">Max Affordable Price:</Text>
                <Text fontWeight="bold" color="green.500">
                  {formatCurrency(affordability.maxAffordablePrice)}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Recommended Down Payment:</Text>
                <Text fontWeight="bold">
                  {formatCurrency(affordability.recommendedDownPayment)}
                </Text>
              </HStack>
            </Box>

            {!affordability.isAffordable && (
              <Alert status="warning">
                <AlertIcon />
                <AlertDescription>
                  This mortgage may be challenging based on your income and debt levels. 
                  Consider a lower purchase price or higher down payment.
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Loan Summary
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text>Loan Amount:</Text>
                <Text fontWeight="bold">{formatCurrency(mortgage.loanAmount)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Down Payment:</Text>
                <Text fontWeight="bold">{formatCurrency(mortgage.downPaymentPercent * mortgage.loanAmount / 100)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Loan-to-Value:</Text>
                <Badge colorScheme={mortgage.loanToValue <= 80 ? 'green' : 'orange'}>
                  {formatPercent(mortgage.loanToValue)}
                </Badge>
              </HStack>
            </VStack>

            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text>Interest Rate:</Text>
                <Text fontWeight="bold">{formatPercent(mortgage.interestRate)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Loan Term:</Text>
                <Text fontWeight="bold">{mortgage.loanTerm} years</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Total Payments:</Text>
                <Text fontWeight="bold">{summary.totalPayments}</Text>
              </HStack>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Amortization Preview */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Amortization Schedule (First 12 Months)
          </Text>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Month</Th>
                  <Th isNumeric>Payment</Th>
                  <Th isNumeric>Principal</Th>
                  <Th isNumeric>Interest</Th>
                  <Th isNumeric>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {results.amortizationSchedule.slice(0, 12).map((row) => (
                  <Tr key={row.month}>
                    <Td>{row.month}</Td>
                    <Td isNumeric>{formatCurrency(row.payment)}</Td>
                    <Td isNumeric>{formatCurrency(row.principal)}</Td>
                    <Td isNumeric>{formatCurrency(row.interest)}</Td>
                    <Td isNumeric>{formatCurrency(row.balance)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
};
