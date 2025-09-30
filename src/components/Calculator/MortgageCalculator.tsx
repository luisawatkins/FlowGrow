import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Button,
  Select,
  Divider,
} from '@chakra-ui/react';
import { useMortgageCalculator } from '@/hooks/useMortgageCalculator';

interface MortgageCalculatorProps {
  propertyPrice?: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice = 300000,
}) => {
  const {
    calculateMortgage,
    calculateAmortization,
    isLoading,
  } = useMortgageCalculator();

  const [inputs, setInputs] = useState({
    price: propertyPrice,
    downPayment: propertyPrice * 0.2, // 20% default down payment
    interestRate: 3.5,
    loanTerm: 30,
    propertyTax: 2400,
    insurance: 1200,
    pmi: 0,
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    principalAndInterest: 0,
    monthlyTax: 0,
    monthlyInsurance: 0,
    monthlyPMI: 0,
  });

  useEffect(() => {
    handleCalculate();
  }, []);

  const handleInputChange = (
    field: keyof typeof inputs,
    value: string | number
  ) => {
    let newValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Handle special cases
    if (field === 'downPayment') {
      newValue = Math.min(newValue, inputs.price);
    }
    
    setInputs(prev => ({
      ...prev,
      [field]: newValue,
      // Recalculate PMI if down payment is less than 20%
      pmi: field === 'downPayment' && (newValue / inputs.price) < 0.2
        ? (inputs.price - newValue) * 0.01 / 12 // Rough PMI calculation
        : prev.pmi,
    }));
  };

  const handleCalculate = async () => {
    try {
      const mortgageResults = await calculateMortgage({
        loanAmount: inputs.price - inputs.downPayment,
        interestRate: inputs.interestRate,
        loanTerm: inputs.loanTerm,
        propertyTax: inputs.propertyTax,
        insurance: inputs.insurance,
        pmi: inputs.pmi,
      });

      setResults(mortgageResults);
    } catch (error) {
      console.error('Error calculating mortgage:', error);
    }
  };

  const downPaymentPercentage = (inputs.downPayment / inputs.price) * 100;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg="white"
      shadow="sm"
    >
      <VStack spacing={6} align="stretch">
        {/* Property Price */}
        <FormControl>
          <FormLabel>Property Price</FormLabel>
          <InputGroup>
            <InputLeftElement color="gray.500">$</InputLeftElement>
            <Input
              type="number"
              value={inputs.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
          </InputGroup>
        </FormControl>

        {/* Down Payment */}
        <FormControl>
          <FormLabel>Down Payment</FormLabel>
          <VStack spacing={2} align="stretch">
            <InputGroup>
              <InputLeftElement color="gray.500">$</InputLeftElement>
              <Input
                type="number"
                value={inputs.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Text fontSize="sm" color="gray.500">
                  {downPaymentPercentage.toFixed(1)}%
                </Text>
              </InputRightElement>
            </InputGroup>
            <Slider
              value={downPaymentPercentage}
              min={0}
              max={100}
              step={1}
              onChange={(value) =>
                handleInputChange('downPayment', (inputs.price * value) / 100)
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </VStack>
        </FormControl>

        {/* Interest Rate */}
        <FormControl>
          <FormLabel>Interest Rate</FormLabel>
          <InputGroup>
            <Input
              type="number"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              step={0.1}
            />
            <InputRightElement>%</InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Loan Term */}
        <FormControl>
          <FormLabel>Loan Term</FormLabel>
          <Select
            value={inputs.loanTerm}
            onChange={(e) => handleInputChange('loanTerm', e.target.value)}
          >
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
            <option value={30}>30 years</option>
          </Select>
        </FormControl>

        {/* Property Tax */}
        <FormControl>
          <FormLabel>Annual Property Tax</FormLabel>
          <InputGroup>
            <InputLeftElement color="gray.500">$</InputLeftElement>
            <Input
              type="number"
              value={inputs.propertyTax}
              onChange={(e) => handleInputChange('propertyTax', e.target.value)}
            />
          </InputGroup>
        </FormControl>

        {/* Insurance */}
        <FormControl>
          <FormLabel>Annual Insurance</FormLabel>
          <InputGroup>
            <InputLeftElement color="gray.500">$</InputLeftElement>
            <Input
              type="number"
              value={inputs.insurance}
              onChange={(e) => handleInputChange('insurance', e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleCalculate}
          isLoading={isLoading}
        >
          Calculate
        </Button>

        <Divider />

        {/* Results */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <Stat>
              <StatLabel>Monthly Payment</StatLabel>
              <StatNumber>${results.monthlyPayment.toFixed(2)}</StatNumber>
              <StatHelpText>Principal, Interest, Tax & Insurance</StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Principal & Interest</StatLabel>
              <StatNumber>${results.principalAndInterest.toFixed(2)}</StatNumber>
              <StatHelpText>Monthly</StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Property Tax</StatLabel>
              <StatNumber>${results.monthlyTax.toFixed(2)}</StatNumber>
              <StatHelpText>Monthly</StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Insurance</StatLabel>
              <StatNumber>${results.monthlyInsurance.toFixed(2)}</StatNumber>
              <StatHelpText>Monthly</StatHelpText>
            </Stat>
          </GridItem>

          {results.monthlyPMI > 0 && (
            <GridItem>
              <Stat>
                <StatLabel>PMI</StatLabel>
                <StatNumber>${results.monthlyPMI.toFixed(2)}</StatNumber>
                <StatHelpText>Monthly</StatHelpText>
              </Stat>
            </GridItem>
          )}

          <GridItem colSpan={2}>
            <Stat>
              <StatLabel>Total Payment</StatLabel>
              <StatNumber>${results.totalPayment.toFixed(2)}</StatNumber>
              <StatHelpText>Over {inputs.loanTerm} years</StatHelpText>
            </Stat>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};
