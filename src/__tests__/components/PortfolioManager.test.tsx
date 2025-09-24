import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortfolioDashboard from '@/components/PortfolioManager/PortfolioDashboard';
import PortfolioList from '@/components/PortfolioManager/PortfolioList';
import FinancialModelingDashboard from '@/components/PortfolioManager/FinancialModelingDashboard';
import { Portfolio, PortfolioProperty } from '@/types/portfolio';

// Mock the usePortfolio hook
jest.mock('@/hooks/usePortfolio', () => ({
  usePortfolio: () => ({
    calculatePerformance: jest.fn(),
    analyzeRisk: jest.fn(),
    calculateModelOutputs: jest.fn()
  })
}));

// Mock data
const mockProperty: PortfolioProperty = {
  propertyId: 'prop-1',
  property: {
    id: 'prop-1',
    title: 'Beautiful House',
    location: 'New York, NY',
    price: 500000,
    images: ['/test-image.jpg'],
    metadata: {}
  },
  purchasePrice: 450000,
  purchaseDate: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
  currentValue: 500000,
  shares: 100000,
  totalShares: 1000000,
  ownershipPercentage: 10,
  monthlyRent: 3000,
  annualExpenses: 12000,
  annualIncome: 36000,
  netOperatingIncome: 24000,
  capRate: 4.8,
  cashOnCashReturn: 5.3,
  totalReturn: 50000,
  totalReturnPercentage: 11.1,
  riskScore: 0.3,
  lastValuation: Date.now(),
  notes: 'Great investment property',
  tags: ['residential', 'rental']
};

const mockPortfolio: Portfolio = {
  id: 'portfolio-1',
  name: 'My Investment Portfolio',
  description: 'A diversified real estate portfolio',
  userId: 'user-1',
  properties: [mockProperty],
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  updatedAt: Date.now(),
  totalValue: 500000,
  totalInvestment: 450000,
  totalReturn: 50000,
  totalReturnPercentage: 11.1,
  riskScore: 0.3,
  diversificationScore: 0.7,
  currentAllocation: {
    residential: 100,
    commercial: 0,
    industrial: 0,
    land: 0,
    reits: 0,
    other: 0
  },
  performanceMetrics: {
    totalReturn: 50000,
    totalReturnPercentage: 11.1,
    annualizedReturn: 11.1,
    volatility: 0.15,
    sharpeRatio: 0.74,
    maxDrawdown: 0.05,
    beta: 0.8,
    alpha: 0.02,
    informationRatio: 0.13,
    treynorRatio: 0.14,
    jensenAlpha: 0.02,
    calmarRatio: 2.22,
    sortinoRatio: 1.11,
    valueAtRisk: 25000,
    expectedShortfall: 30000,
    monthlyReturns: [],
    yearlyReturns: [],
    benchmarkComparison: {
      benchmark: 'S&P 500',
      correlation: 0.7,
      trackingError: 0.05,
      informationRatio: 0.13,
      beta: 0.8,
      alpha: 0.02
    }
  },
  settings: {
    riskTolerance: 'moderate',
    investmentHorizon: 'long',
    rebalancingFrequency: 'quarterly',
    targetReturn: 10,
    maxRisk: 0.4,
    minDiversification: 0.3,
    autoRebalancing: false,
    notifications: {
      performanceAlerts: true,
      rebalancingReminders: true,
      riskWarnings: true,
      marketUpdates: false
    },
    currency: 'USD',
    timezone: 'America/New_York'
  }
};

describe('Portfolio Management Components', () => {
  describe('PortfolioDashboard', () => {
    it('renders portfolio information correctly', () => {
      render(
        <PortfolioDashboard 
          portfolio={mockPortfolio}
          onEdit={jest.fn()}
          onAddProperty={jest.fn()}
          onViewDetails={jest.fn()}
        />
      );
      
      expect(screen.getByText('My Investment Portfolio')).toBeInTheDocument();
      expect(screen.getByText('1 properties')).toBeInTheDocument();
      expect(screen.getByText('$500,000')).toBeInTheDocument();
      expect(screen.getByText('+11.10%')).toBeInTheDocument();
    });

    it('displays risk level correctly', () => {
      render(
        <PortfolioDashboard 
          portfolio={mockPortfolio}
          onEdit={jest.fn()}
          onAddProperty={jest.fn()}
          onViewDetails={jest.fn()}
        />
      );
      
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Score: 30/100')).toBeInTheDocument();
    });

    it('shows diversification score', () => {
      render(
        <PortfolioDashboard 
          portfolio={mockPortfolio}
          onEdit={jest.fn()}
          onAddProperty={jest.fn()}
          onViewDetails={jest.fn()}
        />
      );
      
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('Well diversified')).toBeInTheDocument();
    });

    it('handles empty portfolio state', () => {
      const emptyPortfolio = { ...mockPortfolio, properties: [] };
      
      render(
        <PortfolioDashboard 
          portfolio={emptyPortfolio}
          onEdit={jest.fn()}
          onAddProperty={jest.fn()}
          onViewDetails={jest.fn()}
        />
      );
      
      expect(screen.getByText('No properties yet')).toBeInTheDocument();
      expect(screen.getByText('Add your first property to start building your portfolio')).toBeInTheDocument();
    });

    it('calls onAddProperty when add property button is clicked', () => {
      const onAddProperty = jest.fn();
      
      render(
        <PortfolioDashboard 
          portfolio={mockPortfolio}
          onEdit={jest.fn()}
          onAddProperty={onAddProperty}
          onViewDetails={jest.fn()}
        />
      );
      
      const addButton = screen.getByText('Add Property');
      fireEvent.click(addButton);
      
      expect(onAddProperty).toHaveBeenCalled();
    });

    it('toggles details visibility', () => {
      render(
        <PortfolioDashboard 
          portfolio={mockPortfolio}
          onEdit={jest.fn()}
          onAddProperty={jest.fn()}
          onViewDetails={jest.fn()}
        />
      );
      
      const toggleButton = screen.getByRole('button', { name: /eye/i });
      fireEvent.click(toggleButton);
      
      // Details should be hidden
      expect(screen.queryByText('Performance Overview')).not.toBeInTheDocument();
    });
  });

  describe('PortfolioList', () => {
    const mockPortfolios = [mockPortfolio];

    it('renders portfolio list correctly', () => {
      render(
        <PortfolioList
          portfolios={mockPortfolios}
          onSelectPortfolio={jest.fn()}
          onCreatePortfolio={jest.fn()}
          onEditPortfolio={jest.fn()}
          onDeletePortfolio={jest.fn()}
        />
      );
      
      expect(screen.getByText('Portfolios')).toBeInTheDocument();
      expect(screen.getByText('My Investment Portfolio')).toBeInTheDocument();
      expect(screen.getByText('1 properties')).toBeInTheDocument();
    });

    it('handles search functionality', () => {
      render(
        <PortfolioList
          portfolios={mockPortfolios}
          onSelectPortfolio={jest.fn()}
          onCreatePortfolio={jest.fn()}
          onEditPortfolio={jest.fn()}
          onDeletePortfolio={jest.fn()}
        />
      );
      
      const searchInput = screen.getByPlaceholderText('Search portfolios...');
      fireEvent.change(searchInput, { target: { value: 'Investment' } });
      
      expect(screen.getByText('My Investment Portfolio')).toBeInTheDocument();
    });

    it('filters portfolios by risk level', () => {
      render(
        <PortfolioList
          portfolios={mockPortfolios}
          onSelectPortfolio={jest.fn()}
          onCreatePortfolio={jest.fn()}
          onEditPortfolio={jest.fn()}
          onDeletePortfolio={jest.fn()}
        />
      );
      
      const riskFilter = screen.getByDisplayValue('All Risk Levels');
      fireEvent.change(riskFilter, { target: { value: 'low' } });
      
      expect(screen.getByText('My Investment Portfolio')).toBeInTheDocument();
    });

    it('switches between grid and list view', () => {
      render(
        <PortfolioList
          portfolios={mockPortfolios}
          onSelectPortfolio={jest.fn()}
          onCreatePortfolio={jest.fn()}
          onEditPortfolio={jest.fn()}
          onDeletePortfolio={jest.fn()}
        />
      );
      
      const listViewButton = screen.getByRole('button', { name: /list/i });
      fireEvent.click(listViewButton);
      
      // Should still show the portfolio
      expect(screen.getByText('My Investment Portfolio')).toBeInTheDocument();
    });

    it('handles empty portfolio list', () => {
      render(
        <PortfolioList
          portfolios={[]}
          onSelectPortfolio={jest.fn()}
          onCreatePortfolio={jest.fn()}
          onEditPortfolio={jest.fn()}
          onDeletePortfolio={jest.fn()}
        />
      );
      
      expect(screen.getByText('No portfolios yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first portfolio to start managing your property investments')).toBeInTheDocument();
    });

    it('calls onCreatePortfolio when create button is clicked', () => {
      const onCreatePortfolio = jest.fn();
      
      render(
        <PortfolioList
          portfolios={[]}
          onSelectPortfolio={jest.fn()}
          onCreatePortfolio={onCreatePortfolio}
          onEditPortfolio={jest.fn()}
          onDeletePortfolio={jest.fn()}
        />
      );
      
      const createButton = screen.getByText('Create Your First Portfolio');
      fireEvent.click(createButton);
      
      expect(onCreatePortfolio).toHaveBeenCalled();
    });
  });

  describe('FinancialModelingDashboard', () => {
    it('renders no models state correctly', () => {
      render(<FinancialModelingDashboard />);
      
      expect(screen.getByText('No Financial Models')).toBeInTheDocument();
      expect(screen.getByText('Create your first financial model to analyze property investments')).toBeInTheDocument();
    });

    it('handles model selection and display', async () => {
      // Mock localStorage with a model
      const mockModel = {
        id: 'model-1',
        name: 'Test Model',
        type: 'dcf',
        inputs: {},
        assumptions: {},
        outputs: {
          netPresentValue: 100000,
          internalRateOfReturn: 12.5,
          annualCashFlow: 24000,
          capRate: 4.8
        },
        sensitivityAnalysis: {
          variables: [],
          tornadoChart: [],
          spiderChart: [],
          monteCarloResults: {
            iterations: 0,
            meanNPV: 0,
            medianNPV: 0,
            standardDeviation: 0,
            confidenceIntervals: { p5: 0, p10: 0, p25: 0, p75: 0, p90: 0, p95: 0 },
            probabilityOfPositiveReturn: 0,
            valueAtRisk: 0,
            expectedShortfall: 0,
            distribution: []
          }
        },
        scenarioAnalysis: {
          scenarios: [],
          summary: {
            expectedNPV: 0,
            expectedIRR: 0,
            expectedCashFlow: 0,
            riskScore: 0,
            bestCase: {} as any,
            worstCase: {} as any,
            mostLikely: {} as any
          }
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      localStorage.setItem('flowgrow-models', JSON.stringify([mockModel]));

      render(<FinancialModelingDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Model')).toBeInTheDocument();
        expect(screen.getByText('$100,000')).toBeInTheDocument();
        expect(screen.getByText('12.50%')).toBeInTheDocument();
      });
    });

    it('toggles sensitivity analysis view', async () => {
      const mockModel = {
        id: 'model-1',
        name: 'Test Model',
        type: 'dcf',
        inputs: {},
        assumptions: {},
        outputs: {
          netPresentValue: 100000,
          internalRateOfReturn: 12.5,
          annualCashFlow: 24000,
          capRate: 4.8
        },
        sensitivityAnalysis: {
          variables: [],
          tornadoChart: [],
          spiderChart: [],
          monteCarloResults: {
            iterations: 0,
            meanNPV: 0,
            medianNPV: 0,
            standardDeviation: 0,
            confidenceIntervals: { p5: 0, p10: 0, p25: 0, p75: 0, p90: 0, p95: 0 },
            probabilityOfPositiveReturn: 0,
            valueAtRisk: 0,
            expectedShortfall: 0,
            distribution: []
          }
        },
        scenarioAnalysis: {
          scenarios: [],
          summary: {
            expectedNPV: 0,
            expectedIRR: 0,
            expectedCashFlow: 0,
            riskScore: 0,
            bestCase: {} as any,
            worstCase: {} as any,
            mostLikely: {} as any
          }
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      localStorage.setItem('flowgrow-models', JSON.stringify([mockModel]));

      render(<FinancialModelingDashboard />);
      
      await waitFor(() => {
        const sensitivityButton = screen.getByRole('button', { name: /bar chart/i });
        fireEvent.click(sensitivityButton);
        
        expect(screen.getByText('Sensitivity Analysis')).toBeInTheDocument();
      });
    });
  });
});

describe('Portfolio Integration Tests', () => {
  it('should handle portfolio creation workflow', () => {
    const onCreatePortfolio = jest.fn();
    
    render(
      <PortfolioList
        portfolios={[]}
        onSelectPortfolio={jest.fn()}
        onCreatePortfolio={onCreatePortfolio}
        onEditPortfolio={jest.fn()}
        onDeletePortfolio={jest.fn()}
      />
    );
    
    const createButton = screen.getByText('Create Your First Portfolio');
    fireEvent.click(createButton);
    
    expect(onCreatePortfolio).toHaveBeenCalled();
  });

  it('should handle portfolio selection and dashboard display', () => {
    const onSelectPortfolio = jest.fn();
    
    render(
      <PortfolioList
        portfolios={[mockPortfolio]}
        onSelectPortfolio={onSelectPortfolio}
        onCreatePortfolio={jest.fn()}
        onEditPortfolio={jest.fn()}
        onDeletePortfolio={jest.fn()}
      />
    );
    
    const viewButton = screen.getByText('View Portfolio');
    fireEvent.click(viewButton);
    
    expect(onSelectPortfolio).toHaveBeenCalledWith(mockPortfolio);
  });

  it('should display correct performance metrics', () => {
    render(
      <PortfolioDashboard 
        portfolio={mockPortfolio}
        onEdit={jest.fn()}
        onAddProperty={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );
    
    expect(screen.getByText('$500,000')).toBeInTheDocument(); // Total Value
    expect(screen.getByText('$450,000 invested')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument(); // Total Return
    expect(screen.getByText('+11.10%')).toBeInTheDocument(); // Return Percentage
  });

  it('should handle property card display correctly', () => {
    render(
      <PortfolioDashboard 
        portfolio={mockPortfolio}
        onEdit={jest.fn()}
        onAddProperty={jest.fn()}
        onViewDetails={jest.fn()}
      />
    );
    
    expect(screen.getByText('Beautiful House')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('10.0%')).toBeInTheDocument(); // Ownership percentage
    expect(screen.getByText('4.80%')).toBeInTheDocument(); // Cap rate
  });
});
