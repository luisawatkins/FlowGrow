import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { CalculatorInputs, CalculatorResults } from '@/types/calculator';
import { useEnhancedCalculator } from '@/hooks/useEnhancedCalculator';

interface CalculatorComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  currentInputs: CalculatorInputs;
  currentResults: CalculatorResults | null;
}

export const CalculatorComparison: React.FC<CalculatorComparisonProps> = ({
  isOpen,
  onClose,
  currentInputs,
  currentResults,
}) => {
  const { createComparison, isLoading } = useEnhancedCalculator();
  const toast = useToast();
  
  const [comparisonName, setComparisonName] = useState('');
  const [scenarios, setScenarios] = useState<Array<{
    name: string;
    inputs: CalculatorInputs;
    results: CalculatorResults | null;
  }>>([
    {
      name: 'Current Scenario',
      inputs: currentInputs,
      results: currentResults,
    },
  ]);

  const addScenario = () => {
    setScenarios(prev => [...prev, {
      name: `Scenario ${prev.length + 1}`,
      inputs: { ...currentInputs },
      results: null,
    }]);
  };

  const removeScenario = (index: number) => {
    setScenarios(prev => prev.filter((_, i) => i !== index));
  };

  const updateScenarioName = (index: number, name: string) => {
    setScenarios(prev => prev.map((scenario, i) => 
      i === index ? { ...scenario, name } : scenario
    ));
  };

  const updateScenarioInputs = (index: number, inputs: CalculatorInputs) => {
    setScenarios(prev => prev.map((scenario, i) => 
      i === index ? { ...scenario, inputs } : scenario
    ));
  };

  const handleSaveComparison = async () => {
    if (!comparisonName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a comparison name.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createComparison({
        name: comparisonName,
        scenarios: scenarios.map(scenario => ({
          name: scenario.name,
          inputs: scenario.inputs,
          results: scenario.results!,
        })),
      });

      toast({
        title: 'Comparison saved',
        description: 'Calculator comparison has been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error saving comparison',
        description: 'Failed to save calculator comparison.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Compare Scenarios</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Comparison Name */}
            <FormControl>
              <FormLabel>Comparison Name</FormLabel>
              <Input
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Enter comparison name..."
              />
            </FormControl>

            {/* Scenarios */}
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  Scenarios ({scenarios.length})
                </Text>
                <Button size="sm" onClick={addScenario}>
                  Add Scenario
                </Button>
              </HStack>

              {scenarios.map((scenario, index) => (
                <Card key={index}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Input
                        value={scenario.name}
                        onChange={(e) => updateScenarioName(index, e.target.value)}
                        fontWeight="medium"
                        border="none"
                        p={0}
                        _focus={{ border: '1px solid', borderColor: 'blue.300' }}
                      />
                      {scenarios.length > 1 && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeScenario(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    {scenario.results ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                        <Stat>
                          <StatLabel>Monthly Payment</StatLabel>
                          <StatNumber fontSize="lg">
                            {formatCurrency(scenario.results.mortgage.totalMonthlyPayment)}
                          </StatNumber>
                        </Stat>

                        <Stat>
                          <StatLabel>Total Interest</StatLabel>
                          <StatNumber fontSize="lg" color="red.500">
                            {formatCurrency(scenario.results.mortgage.totalInterest)}
                          </StatNumber>
                        </Stat>

                        <Stat>
                          <StatLabel>Affordability Score</StatLabel>
                          <StatNumber 
                            fontSize="lg"
                            color={scenario.results.affordability.affordabilityScore > 70 ? 'green.500' : 'orange.500'}
                          >
                            {scenario.results.affordability.affordabilityScore.toFixed(0)}/100
                          </StatNumber>
                        </Stat>

                        <Stat>
                          <StatLabel>Total Cost</StatLabel>
                          <StatNumber fontSize="lg">
                            {formatCurrency(scenario.results.mortgage.totalCost)}
                          </StatNumber>
                        </Stat>
                      </SimpleGrid>
                    ) : (
                      <Alert status="info">
                        <AlertIcon />
                        <AlertDescription>
                          This scenario needs to be calculated first.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              ))}
            </VStack>

            {/* Comparison Table */}
            {scenarios.every(s => s.results) && (
              <Card>
                <CardHeader>
                  <Text fontSize="lg" fontWeight="semibold">
                    Detailed Comparison
                  </Text>
                </CardHeader>
                <CardBody>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Metric</Th>
                          {scenarios.map((scenario, index) => (
                            <Th key={index} textAlign="center">
                              {scenario.name}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td fontWeight="medium">Monthly Payment</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? formatCurrency(scenario.results.mortgage.totalMonthlyPayment) : '-'}
                            </Td>
                          ))}
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">Principal & Interest</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? formatCurrency(scenario.results.mortgage.principalAndInterest) : '-'}
                            </Td>
                          ))}
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">Total Interest</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? formatCurrency(scenario.results.mortgage.totalInterest) : '-'}
                            </Td>
                          ))}
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">Total Cost</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? formatCurrency(scenario.results.mortgage.totalCost) : '-'}
                            </Td>
                          ))}
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">Affordability Score</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? `${scenario.results.affordability.affordabilityScore.toFixed(0)}/100` : '-'}
                            </Td>
                          ))}
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">Debt-to-Income</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? formatPercent(scenario.results.affordability.debtToIncomeRatio) : '-'}
                            </Td>
                          ))}
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">Payment-to-Income</Td>
                          {scenarios.map((scenario, index) => (
                            <Td key={index} textAlign="center">
                              {scenario.results ? formatPercent(scenario.results.affordability.paymentToIncomeRatio) : '-'}
                            </Td>
                          ))}
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            )}

            {/* Actions */}
            <HStack spacing={4} justify="flex-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveComparison}
                isLoading={isLoading}
                loadingText="Saving..."
                isDisabled={!comparisonName.trim() || scenarios.length < 2}
              >
                Save Comparison
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
