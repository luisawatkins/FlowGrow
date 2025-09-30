import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Text,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

interface MortgageCalculatorProps {
  propertyPrice?: number;
}

interface MortgagePayment {
  principal: number;
  interest: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoa: number;
  total: number;
}

interface AmortizationSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface CalculationResult {
  payment: MortgagePayment;
  schedule: AmortizationSchedule[];
  summary: {
    totalPayments: number;
    totalInterest: number;
    totalCost: number;
  };
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice = 0,
}) => {
  const toast = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const [formData, setFormData] = useState({
    propertyPrice,
    downPayment: propertyPrice * 0.2, // 20% down payment
    interestRate: 3.5,
    loanTerm: 30,
    propertyTax: propertyPrice * 0.01, // 1% property tax
    homeInsurance: 1200, // $1,200/year
    pmi: 0,
    hoa: 0,
  });

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Update dependent fields
      if (field === 'propertyPrice') {
        newData.downPayment = value * 0.2;
        newData.propertyTax = value * 0.01;
      }

      // Calculate PMI if down payment is less than 20%
      const downPaymentPercent = (newData.downPayment / newData.propertyPrice) * 100;
      newData.pmi = downPaymentPercent < 20 ? (newData.propertyPrice - newData.downPayment) * 0.005 : 0;

      return newData;
    });
  };

  const calculateMortgage = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/mortgage-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate mortgage');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to calculate mortgage. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel>Property Price</FormLabel>
              <NumberInput
                value={formData.propertyPrice}
                onChange={(_, value) => handleInputChange('propertyPrice', value)}
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
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Down Payment</FormLabel>
              <NumberInput
                value={formData.downPayment}
                onChange={(_, value) => handleInputChange('downPayment', value)}
                min={0}
                max={formData.propertyPrice}
                step={1000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text fontSize="sm" color="gray.600">
                {((formData.downPayment / formData.propertyPrice) * 100).toFixed(1)}% of property price
              </Text>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Interest Rate (%)</FormLabel>
              <NumberInput
                value={formData.interestRate}
                onChange={(_, value) => handleInputChange('interestRate', value)}
                min={0}
                max={20}
                step={0.125}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Loan Term (years)</FormLabel>
              <NumberInput
                value={formData.loanTerm}
                onChange={(_, value) => handleInputChange('loanTerm', value)}
                min={1}
                max={30}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Property Tax (yearly)</FormLabel>
              <NumberInput
                value={formData.propertyTax}
                onChange={(_, value) => handleInputChange('propertyTax', value)}
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
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Home Insurance (yearly)</FormLabel>
              <NumberInput
                value={formData.homeInsurance}
                onChange={(_, value) => handleInputChange('homeInsurance', value)}
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
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>PMI (yearly)</FormLabel>
              <NumberInput
                value={formData.pmi}
                onChange={(_, value) => handleInputChange('pmi', value)}
                min={0}
                step={100}
                isReadOnly
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>HOA Fees (monthly)</FormLabel>
              <NumberInput
                value={formData.hoa}
                onChange={(_, value) => handleInputChange('hoa', value)}
                min={0}
                step={10}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={calculateMortgage}
          isLoading={isCalculating}
        >
          Calculate Mortgage
        </Button>

        {result && (
          <Tabs>
            <TabList>
              <Tab>Monthly Payment</Tab>
              <Tab>Amortization Schedule</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <StatGroup>
                    <Stat>
                      <StatLabel>Monthly Payment</StatLabel>
                      <StatNumber>{formatCurrency(result.payment.total)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Total Cost</StatLabel>
                      <StatNumber>{formatCurrency(result.summary.totalCost)}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Total Interest</StatLabel>
                      <StatNumber>{formatCurrency(result.summary.totalInterest)}</StatNumber>
                    </Stat>
                  </StatGroup>

                  <Box>
                    <Heading size="sm" mb={4}>Payment Breakdown</Heading>
                    <Table size="sm">
                      <Tbody>
                        <Tr>
                          <Td>Principal & Interest</Td>
                          <Td isNumeric>
                            {formatCurrency(result.payment.principal + result.payment.interest)}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Property Tax</Td>
                          <Td isNumeric>{formatCurrency(result.payment.propertyTax)}</Td>
                        </Tr>
                        <Tr>
                          <Td>Home Insurance</Td>
                          <Td isNumeric>{formatCurrency(result.payment.homeInsurance)}</Td>
                        </Tr>
                        {result.payment.pmi > 0 && (
                          <Tr>
                            <Td>PMI</Td>
                            <Td isNumeric>{formatCurrency(result.payment.pmi)}</Td>
                          </Tr>
                        )}
                        {result.payment.hoa > 0 && (
                          <Tr>
                            <Td>HOA Fees</Td>
                            <Td isNumeric>{formatCurrency(result.payment.hoa)}</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel>
                <Box overflowX="auto">
                  <Table size="sm">
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
                      {result.schedule.map((month) => (
                        <Tr key={month.month}>
                          <Td>{month.month}</Td>
                          <Td isNumeric>{formatCurrency(month.payment)}</Td>
                          <Td isNumeric>{formatCurrency(month.principal)}</Td>
                          <Td isNumeric>{formatCurrency(month.interest)}</Td>
                          <Td isNumeric>{formatCurrency(month.balance)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
    </Box>
  );
};