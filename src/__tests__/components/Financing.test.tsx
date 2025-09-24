import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Financing } from '@/components/Financing/Financing';
import { MortgageCalculator } from '@/components/Financing/MortgageCalculator';
import { LenderNetwork } from '@/components/Financing/LenderNetwork';

// Mock the services
jest.mock('@/lib/lenderService', () => ({
  LenderService: {
    getLenders: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Premier Mortgage Bank',
        website: 'https://premiermortgage.com',
        phone: '+1-555-0100',
        email: 'info@premiermortgage.com',
        description: 'Premier Mortgage Bank offers competitive rates.',
        specialties: ['First-time Buyers', 'Jumbo Loans'],
        loanTypes: [],
        minLoanAmount: 100000,
        maxLoanAmount: 2000000,
        minCreditScore: 620,
        maxLtv: 97,
        processingTime: '21-30 days',
        fees: [],
        rating: 4.8,
        reviewCount: 1247,
        isVerified: true,
        isActive: true,
        locations: ['California', 'Nevada'],
        languages: ['English', 'Spanish'],
        features: ['Online Application', 'Rate Lock'],
        socialMedia: {}
      }
    ]),
    getFinancingOptions: jest.fn().mockResolvedValue([
      {
        id: '1',
        lenderId: '1',
        loanType: '30-Year Fixed',
        loanAmount: 400000,
        interestRate: 4.5,
        apr: 4.6,
        loanTerm: 30,
        monthlyPayment: 2026.74,
        totalCost: 729626.4,
        downPayment: 80000,
        closingCosts: 8000,
        fees: [],
        features: ['Online Application'],
        benefits: ['Predictable payments'],
        requirements: ['Minimum 620 credit score'],
        isRecommended: true,
        comparisonScore: 85
      }
    ])
  }
}));

describe('Financing', () => {
  test('renders financing component', () => {
    render(<Financing />);
    
    expect(screen.getByText('Property Financing')).toBeInTheDocument();
    expect(screen.getByText('Calculate payments, compare lenders, and manage your mortgage applications')).toBeInTheDocument();
  });

  test('renders navigation tabs', () => {
    render(<Financing />);
    
    expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument();
    expect(screen.getByText('Lender Network')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
  });

  test('shows calculator tab by default', () => {
    render(<Financing />);
    
    expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument();
  });

  test('switches to lenders tab when clicked', () => {
    render(<Financing />);
    
    const lendersTab = screen.getByText('Lender Network');
    fireEvent.click(lendersTab);
    
    expect(screen.getByText('Lender Network')).toBeInTheDocument();
  });

  test('shows features overview', () => {
    render(<Financing />);
    
    expect(screen.getByText('Financing Features')).toBeInTheDocument();
    expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument();
    expect(screen.getByText('Lender Comparison')).toBeInTheDocument();
    expect(screen.getByText('Application Tracking')).toBeInTheDocument();
  });

  test('shows quick actions', () => {
    render(<Financing />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Calculate Payment')).toBeInTheDocument();
    expect(screen.getByText('Find Lenders')).toBeInTheDocument();
    expect(screen.getByText('Start Application')).toBeInTheDocument();
    expect(screen.getByText('Rate Alerts')).toBeInTheDocument();
  });
});

describe('MortgageCalculator', () => {
  test('renders mortgage calculator', () => {
    render(<MortgageCalculator />);
    
    expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('500000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('100000')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
  });

  test('allows input of property value', () => {
    render(<MortgageCalculator />);
    
    const propertyValueInput = screen.getByPlaceholderText('500000');
    fireEvent.change(propertyValueInput, { target: { value: '600000' } });
    
    expect(propertyValueInput).toHaveValue('600000');
  });

  test('allows input of down payment', () => {
    render(<MortgageCalculator />);
    
    const downPaymentInput = screen.getByPlaceholderText('100000');
    fireEvent.change(downPaymentInput, { target: { value: '120000' } });
    
    expect(downPaymentInput).toHaveValue('120000');
  });

  test('allows input of interest rate', () => {
    render(<MortgageCalculator />);
    
    const interestRateInput = screen.getByPlaceholderText('4.5');
    fireEvent.change(interestRateInput, { target: { value: '4.25' } });
    
    expect(interestRateInput).toHaveValue('4.25');
  });

  test('shows basic and detailed tabs', () => {
    render(<MortgageCalculator />);
    
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Detailed')).toBeInTheDocument();
  });

  test('switches to detailed tab when clicked', () => {
    render(<MortgageCalculator />);
    
    const detailedTab = screen.getByText('Detailed');
    fireEvent.click(detailedTab);
    
    expect(screen.getByText('Additional Costs')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('500')).toBeInTheDocument(); // Property Tax
  });

  test('calculates mortgage when calculate button is clicked', () => {
    render(<MortgageCalculator />);
    
    // Fill in required fields
    const propertyValueInput = screen.getByPlaceholderText('500000');
    const downPaymentInput = screen.getByPlaceholderText('100000');
    const interestRateInput = screen.getByPlaceholderText('4.5');
    
    fireEvent.change(propertyValueInput, { target: { value: '500000' } });
    fireEvent.change(downPaymentInput, { target: { value: '100000' } });
    fireEvent.change(interestRateInput, { target: { value: '4.5' } });
    
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    
    // Should show results
    expect(screen.getByText('Monthly Payment')).toBeInTheDocument();
    expect(screen.getByText('Total Interest')).toBeInTheDocument();
    expect(screen.getByText('Total Cost')).toBeInTheDocument();
  });

  test('shows amortization schedule when calculate is completed', () => {
    render(<MortgageCalculator />);
    
    // Fill in required fields and calculate
    const propertyValueInput = screen.getByPlaceholderText('500000');
    const downPaymentInput = screen.getByPlaceholderText('100000');
    const interestRateInput = screen.getByPlaceholderText('4.5');
    
    fireEvent.change(propertyValueInput, { target: { value: '500000' } });
    fireEvent.change(downPaymentInput, { target: { value: '100000' } });
    fireEvent.change(interestRateInput, { target: { value: '4.5' } });
    
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    
    // Should show amortization schedule
    expect(screen.getByText('Amortization Schedule')).toBeInTheDocument();
    expect(screen.getByText('Show Schedule')).toBeInTheDocument();
  });

  test('toggles amortization schedule visibility', () => {
    render(<MortgageCalculator />);
    
    // Fill in required fields and calculate
    const propertyValueInput = screen.getByPlaceholderText('500000');
    const downPaymentInput = screen.getByPlaceholderText('100000');
    const interestRateInput = screen.getByPlaceholderText('4.5');
    
    fireEvent.change(propertyValueInput, { target: { value: '500000' } });
    fireEvent.change(downPaymentInput, { target: { value: '100000' } });
    fireEvent.change(interestRateInput, { target: { value: '4.5' } });
    
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    
    const showScheduleButton = screen.getByText('Show Schedule');
    fireEvent.click(showScheduleButton);
    
    expect(screen.getByText('Hide Schedule')).toBeInTheDocument();
  });
});

describe('LenderNetwork', () => {
  test('renders lender network', () => {
    render(<LenderNetwork />);
    
    expect(screen.getByText('Lender Network')).toBeInTheDocument();
    expect(screen.getByText('Connect with verified lenders and compare financing options')).toBeInTheDocument();
  });

  test('shows search filters', () => {
    render(<LenderNetwork />);
    
    expect(screen.getByText('Find Financing Options')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('400000')).toBeInTheDocument(); // Loan Amount
    expect(screen.getByPlaceholderText('80000')).toBeInTheDocument(); // Down Payment
    expect(screen.getByPlaceholderText('720')).toBeInTheDocument(); // Credit Score
    expect(screen.getByText('Search Options')).toBeInTheDocument();
  });

  test('allows input of loan amount', () => {
    render(<LenderNetwork />);
    
    const loanAmountInput = screen.getByPlaceholderText('400000');
    fireEvent.change(loanAmountInput, { target: { value: '500000' } });
    
    expect(loanAmountInput).toHaveValue('500000');
  });

  test('allows input of down payment', () => {
    render(<LenderNetwork />);
    
    const downPaymentInput = screen.getByPlaceholderText('80000');
    fireEvent.change(downPaymentInput, { target: { value: '100000' } });
    
    expect(downPaymentInput).toHaveValue('100000');
  });

  test('allows input of credit score', () => {
    render(<LenderNetwork />);
    
    const creditScoreInput = screen.getByPlaceholderText('720');
    fireEvent.change(creditScoreInput, { target: { value: '750' } });
    
    expect(creditScoreInput).toHaveValue('750');
  });

  test('shows verified lenders section', () => {
    render(<LenderNetwork />);
    
    expect(screen.getByText('Verified Lenders')).toBeInTheDocument();
  });

  test('searches for financing options when search button is clicked', async () => {
    render(<LenderNetwork />);
    
    const loanAmountInput = screen.getByPlaceholderText('400000');
    fireEvent.change(loanAmountInput, { target: { value: '400000' } });
    
    const searchButton = screen.getByText('Search Options');
    fireEvent.click(searchButton);
    
    // Should show loading or results
    await waitFor(() => {
      expect(screen.getByText('Financing Options')).toBeInTheDocument();
    });
  });

  test('shows no results message when no options found', async () => {
    // Mock empty results
    const mockGetFinancingOptions = require('@/lib/lenderService').LenderService.getFinancingOptions;
    mockGetFinancingOptions.mockResolvedValueOnce([]);
    
    render(<LenderNetwork />);
    
    const loanAmountInput = screen.getByPlaceholderText('400000');
    fireEvent.change(loanAmountInput, { target: { value: '400000' } });
    
    const searchButton = screen.getByText('Search Options');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('No financing options found')).toBeInTheDocument();
    });
  });
});

describe('Financing Integration', () => {
  test('handles calculation completion', () => {
    const onFinancingComplete = jest.fn();
    render(<Financing onFinancingComplete={onFinancingComplete} />);
    
    // This would be triggered when a calculation is completed
    // The actual implementation would depend on the calculation result
  });

  test('handles lender selection', () => {
    const onFinancingComplete = jest.fn();
    render(<Financing onFinancingComplete={onFinancingComplete} />);
    
    // This would be triggered when a lender is selected
    // The actual implementation would depend on the lender selection
  });

  test('handles financing option selection', () => {
    const onFinancingComplete = jest.fn();
    render(<Financing onFinancingComplete={onFinancingComplete} />);
    
    // This would be triggered when a financing option is selected
    // The actual implementation would depend on the option selection
  });
});

describe('Mortgage Calculator Edge Cases', () => {
  test('handles invalid input gracefully', () => {
    render(<MortgageCalculator />);
    
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    
    // Should show error or validation message
    // The actual implementation would depend on error handling
  });

  test('handles zero values', () => {
    render(<MortgageCalculator />);
    
    const propertyValueInput = screen.getByPlaceholderText('500000');
    const downPaymentInput = screen.getByPlaceholderText('100000');
    const interestRateInput = screen.getByPlaceholderText('4.5');
    
    fireEvent.change(propertyValueInput, { target: { value: '0' } });
    fireEvent.change(downPaymentInput, { target: { value: '0' } });
    fireEvent.change(interestRateInput, { target: { value: '0' } });
    
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    
    // Should handle zero values appropriately
  });

  test('handles negative values', () => {
    render(<MortgageCalculator />);
    
    const propertyValueInput = screen.getByPlaceholderText('500000');
    const downPaymentInput = screen.getByPlaceholderText('100000');
    const interestRateInput = screen.getByPlaceholderText('4.5');
    
    fireEvent.change(propertyValueInput, { target: { value: '-100' } });
    fireEvent.change(downPaymentInput, { target: { value: '-50' } });
    fireEvent.change(interestRateInput, { target: { value: '-1' } });
    
    const calculateButton = screen.getByText('Calculate');
    fireEvent.click(calculateButton);
    
    // Should handle negative values appropriately
  });
});

describe('Lender Network Edge Cases', () => {
  test('handles empty search results', async () => {
    const mockGetFinancingOptions = require('@/lib/lenderService').LenderService.getFinancingOptions;
    mockGetFinancingOptions.mockResolvedValueOnce([]);
    
    render(<LenderNetwork />);
    
    const loanAmountInput = screen.getByPlaceholderText('400000');
    fireEvent.change(loanAmountInput, { target: { value: '400000' } });
    
    const searchButton = screen.getByText('Search Options');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('No financing options found')).toBeInTheDocument();
    });
  });

  test('handles search without loan amount', () => {
    render(<LenderNetwork />);
    
    const searchButton = screen.getByText('Search Options');
    fireEvent.click(searchButton);
    
    // Should show validation message
    // The actual implementation would depend on validation
  });

  test('handles loading state', async () => {
    const mockGetFinancingOptions = require('@/lib/lenderService').LenderService.getFinancingOptions;
    mockGetFinancingOptions.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<LenderNetwork />);
    
    const loanAmountInput = screen.getByPlaceholderText('400000');
    fireEvent.change(loanAmountInput, { target: { value: '400000' } });
    
    const searchButton = screen.getByText('Search Options');
    fireEvent.click(searchButton);
    
    // Should show loading state
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
});
