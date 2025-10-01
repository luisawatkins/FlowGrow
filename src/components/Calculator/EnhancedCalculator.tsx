import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { CalculatorInputs, CalculatorResults } from '@/types/calculator';
import { useEnhancedCalculator } from '@/hooks/useEnhancedCalculator';
import { CalculatorInputsForm } from './CalculatorInputsForm';
import { CalculatorResultsDisplay } from './CalculatorResultsDisplay';
import { CalculatorPresets } from './CalculatorPresets';
import { CalculatorComparison } from './CalculatorComparison';

interface EnhancedCalculatorProps {
  initialInputs?: Partial<CalculatorInputs>;
  onResultsChange?: (results: CalculatorResults) => void;
  className?: string;
}

export const EnhancedCalculator: React.FC<EnhancedCalculatorProps> = ({
  initialInputs = {},
  onResultsChange,
  className = '',
}) => {
  const { 
    results, 
    presets, 
    isLoading, 
    error, 
    calculate, 
    getPresets 
  } = useEnhancedCalculator();
  
  const toast = useToast();
  const { isOpen: isPresetsOpen, onOpen: onPresetsOpen, onClose: onPresetsClose } = useDisclosure();
  const { isOpen: isComparisonOpen, onOpen: onComparisonOpen, onClose: onComparisonClose } = useDisclosure();
  
  const [inputs, setInputs] = useState<CalculatorInputs>({
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
    ...initialInputs,
  });

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadPresets();
  }, []);

  useEffect(() => {
    if (results) {
      onResultsChange?.(results);
    }
  }, [results, onResultsChange]);

  const loadPresets = async () => {
    try {
      await getPresets();
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCalculate = async () => {
    try {
      await calculate(inputs);
      toast({
        title: 'Calculation complete',
        description: 'Your mortgage calculation has been completed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Calculation failed',
        description: 'Failed to calculate mortgage. Please check your inputs.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePresetSelect = (preset: any) => {
    setInputs(prev => ({
      ...prev,
      ...preset.inputs,
    }));
    onPresetsClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error loading calculator!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box className={className}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Enhanced Mortgage Calculator
          </Text>
          <Text color="gray.600">
            Calculate your mortgage payments, affordability, and amortization schedule
          </Text>
        </Box>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">
                Calculator Inputs
              </Text>
              <HStack spacing={2}>
                <Button size="sm" variant="outline" onClick={onPresetsOpen}>
                  Load Preset
                </Button>
                <Button size="sm" variant="outline" onClick={onComparisonOpen}>
                  Compare Scenarios
                </Button>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <CalculatorInputsForm
              inputs={inputs}
              onInputChange={handleInputChange}
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </CardBody>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <Text fontSize="lg" fontWeight="semibold">
                Calculation Results
              </Text>
            </CardHeader>
            <CardBody>
              <CalculatorResultsDisplay results={results} />
            </CardBody>
          </Card>
        )}

        {/* Detailed Results Tabs */}
        {results && (
          <Card>
            <CardHeader>
              <Text fontSize="lg" fontWeight="semibold">
                Detailed Analysis
              </Text>
            </CardHeader>
            <CardBody>
              <Tabs index={activeTab} onChange={setActiveTab}>
                <TabList>
                  <Tab>Mortgage Details</Tab>
                  <Tab>Affordability</Tab>
                  <Tab>Amortization</Tab>
                  <Tab>Summary</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Stat>
                          <StatLabel>Monthly Payment</StatLabel>
                          <StatNumber color="blue.500">
                            {formatCurrency(results.mortgage.totalMonthlyPayment)}
                          </StatNumber>
                          <StatHelpText>
                            Principal & Interest: {formatCurrency(results.mortgage.principalAndInterest)}
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Total Interest</StatLabel>
                          <StatNumber color="red.500">
                            {formatCurrency(results.mortgage.totalInterest)}
                          </StatNumber>
                          <StatHelpText>
                            Over {results.mortgage.loanTerm} years
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Loan Amount</StatLabel>
                          <StatNumber>
                            {formatCurrency(results.mortgage.loanAmount)}
                          </StatNumber>
                          <StatHelpText>
                            LTV: {formatPercent(results.mortgage.loanToValue)}
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Down Payment</StatLabel>
                          <StatNumber>
                            {formatCurrency(inputs.downPayment)}
                          </StatNumber>
                          <StatHelpText>
                            {formatPercent(results.mortgage.downPaymentPercent)} of purchase price
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>

                  <TabPanel px={0}>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Stat>
                          <StatLabel>Max Affordable Price</StatLabel>
                          <StatNumber color="green.500">
                            {formatCurrency(results.affordability.maxAffordablePrice)}
                          </StatNumber>
                          <StatHelpText>
                            Based on your income
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Affordability Score</StatLabel>
                          <StatNumber color={results.affordability.affordabilityScore > 70 ? 'green.500' : 'orange.500'}>
                            {results.affordability.affordabilityScore.toFixed(0)}/100
                          </StatNumber>
                          <StatHelpText>
                            {results.affordability.isAffordable ? 'Affordable' : 'May be challenging'}
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Debt-to-Income Ratio</StatLabel>
                          <StatNumber color={results.affordability.debtToIncomeRatio <= 43 ? 'green.500' : 'red.500'}>
                            {formatPercent(results.affordability.debtToIncomeRatio)}
                          </StatNumber>
                          <StatHelpText>
                            Target: ≤43%
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Payment-to-Income Ratio</StatLabel>
                          <StatNumber color={results.affordability.paymentToIncomeRatio <= 28 ? 'green.500' : 'red.500'}>
                            {formatPercent(results.affordability.paymentToIncomeRatio)}
                          </StatNumber>
                          <StatHelpText>
                            Target: ≤28%
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>

                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={2}>
                          Affordability Status
                        </Text>
                        <Badge 
                          colorScheme={results.affordability.isAffordable ? 'green' : 'red'}
                          size="lg"
                        >
                          {results.affordability.isAffordable ? 'Affordable' : 'May be challenging'}
                        </Badge>
                      </Box>
                    </VStack>
                  </TabPanel>

                  <TabPanel px={0}>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={4}>
                        First 12 months of your amortization schedule
                      </Text>
                      <Box maxH="400px" overflowY="auto">
                        <SimpleGrid columns={6} spacing={2} fontSize="sm">
                          <Text fontWeight="bold">Month</Text>
                          <Text fontWeight="bold">Payment</Text>
                          <Text fontWeight="bold">Principal</Text>
                          <Text fontWeight="bold">Interest</Text>
                          <Text fontWeight="bold">Balance</Text>
                          <Text fontWeight="bold">Cum. Interest</Text>
                          
                          {results.amortizationSchedule.slice(0, 12).map((row) => (
                            <React.Fragment key={row.month}>
                              <Text>{row.month}</Text>
                              <Text>{formatCurrency(row.payment)}</Text>
                              <Text>{formatCurrency(row.principal)}</Text>
                              <Text>{formatCurrency(row.interest)}</Text>
                              <Text>{formatCurrency(row.balance)}</Text>
                              <Text>{formatCurrency(row.cumulativeInterest)}</Text>
                            </React.Fragment>
                          ))}
                        </SimpleGrid>
                      </Box>
                    </Box>
                  </TabPanel>

                  <TabPanel px={0}>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Stat>
                          <StatLabel>Total Payments</StatLabel>
                          <StatNumber>
                            {results.summary.totalPayments}
                          </StatNumber>
                          <StatHelpText>
                            Over {results.mortgage.loanTerm} years
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Total Cost</StatLabel>
                          <StatNumber>
                            {formatCurrency(results.mortgage.totalCost)}
                          </StatNumber>
                          <StatHelpText>
                            Purchase price + interest
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Payoff Date</StatLabel>
                          <StatNumber>
                            {results.summary.payoffDate.toLocaleDateString()}
                          </StatNumber>
                          <StatHelpText>
                            Final payment date
                          </StatHelpText>
                        </Stat>

                        <Stat>
                          <StatLabel>Interest Savings</StatLabel>
                          <StatNumber color="green.500">
                            {formatCurrency(results.summary.interestSavings)}
                          </StatNumber>
                          <StatHelpText>
                            From extra payments
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        )}

        {/* Modals */}
        <CalculatorPresets
          isOpen={isPresetsOpen}
          onClose={onPresetsClose}
          onSelect={handlePresetSelect}
          presets={presets}
        />

        <CalculatorComparison
          isOpen={isComparisonOpen}
          onClose={onComparisonClose}
          currentInputs={inputs}
          currentResults={results}
        />
      </VStack>
    </Box>
  );
};
