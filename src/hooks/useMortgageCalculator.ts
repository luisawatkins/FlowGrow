import { useState } from 'react';

interface MortgageParams {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
}

interface AmortizationSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function useMortgageCalculator() {
  const [isLoading, setIsLoading] = useState(false);

  const calculateMortgage = async (params: MortgageParams) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/mortgage-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate mortgage');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating mortgage:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAmortization = async (params: MortgageParams) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/mortgage-calculator/amortization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate amortization schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating amortization:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    calculateMortgage,
    calculateAmortization,
    isLoading,
  };
}
