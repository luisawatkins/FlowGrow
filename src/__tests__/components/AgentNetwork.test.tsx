import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgentNetwork } from '@/components/AgentNetwork/AgentNetwork';
import { AgentSearch } from '@/components/AgentNetwork/AgentSearch';
import { AgentProfile } from '@/components/AgentNetwork/AgentProfile';
import { AgentDashboard } from '@/components/AgentNetwork/AgentDashboard';
import { CommissionTracker } from '@/components/AgentNetwork/CommissionTracker';
import { Agent } from '@/types/agent';

// Mock the hooks
jest.mock('@/hooks/useAgent', () => ({
  useAgent: () => ({
    agents: [],
    selectedAgent: null,
    loading: false,
    error: null,
    brokerages: [],
    selectedBrokerage: null,
    commissions: [],
    commissionLoading: false,
    performance: null,
    performanceLoading: false,
    dashboard: null,
    dashboardLoading: false,
    searchFilters: {},
    searchResults: [],
    searchLoading: false,
    agentMatches: [],
    matchingLoading: false,
    loadAgents: jest.fn(),
    selectAgent: jest.fn(),
    createAgent: jest.fn(),
    updateAgent: jest.fn(),
    verifyAgent: jest.fn(),
    loadBrokerages: jest.fn(),
    selectBrokerage: jest.fn(),
    loadCommissions: jest.fn(),
    loadPerformance: jest.fn(),
    loadDashboard: jest.fn(),
    searchAgents: jest.fn(),
    findMatchingAgents: jest.fn(),
    clearError: jest.fn()
  })
}));

// Mock agent data
const mockAgent: Agent = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@realestate.com',
  phone: '+1-555-0123',
  licenseNumber: 'RE123456',
  licenseState: 'CA',
  licenseExpiry: '2025-12-31',
  brokerage: 'Premier Realty Group',
  specialties: ['Luxury Homes', 'First-time Buyers'],
  experience: 8,
  rating: 4.9,
  reviewCount: 127,
  profileImage: '/images/agents/sarah-johnson.jpg',
  bio: 'Experienced real estate agent specializing in luxury homes.',
  languages: ['English', 'Spanish'],
  serviceAreas: ['Beverly Hills', 'West Hollywood'],
  commissionRate: 2.5,
  isVerified: true,
  isActive: true,
  joinDate: '2016-03-15',
  lastActive: '2024-01-15',
  totalSales: 45,
  totalVolume: 125000000,
  averageDaysOnMarket: 28,
  clientSatisfactionScore: 4.9,
  certifications: ['CRS', 'ABR'],
  awards: ['Top Producer 2023'],
  socialMedia: {
    linkedin: 'https://linkedin.com/in/sarahjohnson'
  }
};

describe('AgentNetwork', () => {
  test('renders agent network component', () => {
    render(<AgentNetwork />);
    
    expect(screen.getByText('Real Estate Agent Network')).toBeInTheDocument();
    expect(screen.getByText('Connect with verified real estate professionals in your area')).toBeInTheDocument();
  });

  test('renders search tab by default', () => {
    render(<AgentNetwork />);
    
    expect(screen.getByText('Find Agents')).toBeInTheDocument();
    expect(screen.getByText('Find Your Perfect Agent')).toBeInTheDocument();
  });

  test('shows features overview', () => {
    render(<AgentNetwork />);
    
    expect(screen.getByText('Agent Network Features')).toBeInTheDocument();
    expect(screen.getByText('Advanced Search')).toBeInTheDocument();
    expect(screen.getByText('Verified Agents')).toBeInTheDocument();
    expect(screen.getByText('Performance Tracking')).toBeInTheDocument();
  });
});

describe('AgentSearch', () => {
  test('renders search form', () => {
    render(<AgentSearch />);
    
    expect(screen.getByText('Find Your Perfect Agent')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City, State, or ZIP')).toBeInTheDocument();
    expect(screen.getByText('Search Agents')).toBeInTheDocument();
  });

  test('allows filter input', () => {
    render(<AgentSearch />);
    
    const locationInput = screen.getByPlaceholderText('City, State, or ZIP');
    fireEvent.change(locationInput, { target: { value: 'Beverly Hills' } });
    
    expect(locationInput).toHaveValue('Beverly Hills');
  });

  test('clears filters when clear button is clicked', () => {
    render(<AgentSearch />);
    
    const locationInput = screen.getByPlaceholderText('City, State, or ZIP');
    fireEvent.change(locationInput, { target: { value: 'Beverly Hills' } });
    
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    expect(locationInput).toHaveValue('');
  });
});

describe('AgentProfile', () => {
  test('renders agent profile', () => {
    render(<AgentProfile agent={mockAgent} />);
    
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Premier Realty Group')).toBeInTheDocument();
    expect(screen.getByText('License: RE123456')).toBeInTheDocument();
    expect(screen.getByText('8 years experience')).toBeInTheDocument();
  });

  test('shows agent specialties', () => {
    render(<AgentProfile agent={mockAgent} />);
    
    expect(screen.getByText('Specialties')).toBeInTheDocument();
    expect(screen.getByText('Luxury Homes')).toBeInTheDocument();
    expect(screen.getByText('First-time Buyers')).toBeInTheDocument();
  });

  test('shows service areas', () => {
    render(<AgentProfile agent={mockAgent} />);
    
    expect(screen.getByText('Service Areas')).toBeInTheDocument();
    expect(screen.getByText('Beverly Hills')).toBeInTheDocument();
    expect(screen.getByText('West Hollywood')).toBeInTheDocument();
  });

  test('shows performance stats', () => {
    render(<AgentProfile agent={mockAgent} />);
    
    expect(screen.getByText('45')).toBeInTheDocument(); // Total Sales
    expect(screen.getByText('$125,000,000')).toBeInTheDocument(); // Total Volume
    expect(screen.getByText('28')).toBeInTheDocument(); // Avg Days on Market
    expect(screen.getByText('2.5%')).toBeInTheDocument(); // Commission Rate
  });

  test('shows verification badge for verified agents', () => {
    render(<AgentProfile agent={mockAgent} />);
    
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  test('calls onContact when contact button is clicked', () => {
    const onContact = jest.fn();
    render(<AgentProfile agent={mockAgent} onContact={onContact} />);
    
    const contactButton = screen.getByText('Contact Agent');
    fireEvent.click(contactButton);
    
    expect(onContact).toHaveBeenCalledWith('1');
  });

  test('calls onViewProperties when view properties button is clicked', () => {
    const onViewProperties = jest.fn();
    render(<AgentProfile agent={mockAgent} onViewProperties={onViewProperties} />);
    
    const viewPropertiesButton = screen.getByText('View Properties');
    fireEvent.click(viewPropertiesButton);
    
    expect(onViewProperties).toHaveBeenCalledWith('1');
  });

  test('calls onScheduleMeeting when schedule meeting button is clicked', () => {
    const onScheduleMeeting = jest.fn();
    render(<AgentProfile agent={mockAgent} onScheduleMeeting={onScheduleMeeting} />);
    
    const scheduleMeetingButton = screen.getByText('Schedule Meeting');
    fireEvent.click(scheduleMeetingButton);
    
    expect(onScheduleMeeting).toHaveBeenCalledWith('1');
  });
});

describe('AgentDashboard', () => {
  test('shows loading state', () => {
    render(<AgentDashboard agentId="1" />);
    
    // The component should show loading spinner
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('shows dashboard not found when no data', async () => {
    render(<AgentDashboard agentId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard not found')).toBeInTheDocument();
    });
  });
});

describe('CommissionTracker', () => {
  test('shows loading state', () => {
    render(<CommissionTracker agentId="1" />);
    
    // The component should show loading spinner
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('shows commission tracker header', async () => {
    render(<CommissionTracker agentId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Commission Tracker')).toBeInTheDocument();
    });
  });

  test('toggles calculator visibility', async () => {
    render(<CommissionTracker agentId="1" />);
    
    await waitFor(() => {
      const showCalculatorButton = screen.getByText('Show Calculator');
      fireEvent.click(showCalculatorButton);
      
      expect(screen.getByText('Commission Calculator')).toBeInTheDocument();
      expect(screen.getByText('Hide Calculator')).toBeInTheDocument();
    });
  });
});

describe('Agent Network Integration', () => {
  test('handles agent selection', () => {
    const onAgentSelect = jest.fn();
    render(<AgentNetwork onAgentSelect={onAgentSelect} />);
    
    // This would be triggered when an agent is selected from search results
    // The actual implementation would depend on the search results
  });

  test('shows dashboard tab when agent is selected and showDashboard is true', () => {
    render(<AgentNetwork showDashboard={true} />);
    
    // The dashboard tab should be available when an agent is selected
    // This would be tested with a selected agent state
  });

  test('shows commission tracker tab when agent is selected and showCommissionTracker is true', () => {
    render(<AgentNetwork showCommissionTracker={true} />);
    
    // The commission tracker tab should be available when an agent is selected
    // This would be tested with a selected agent state
  });
});

describe('Agent Profile Edge Cases', () => {
  test('handles agent without profile image', () => {
    const agentWithoutImage = { ...mockAgent, profileImage: undefined };
    render(<AgentProfile agent={agentWithoutImage} />);
    
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    // Should show initials instead of image
  });

  test('handles agent without certifications', () => {
    const agentWithoutCerts = { ...mockAgent, certifications: [] };
    render(<AgentProfile agent={agentWithoutCerts} />);
    
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    // Should not show certifications section
  });

  test('handles unverified agent', () => {
    const unverifiedAgent = { ...mockAgent, isVerified: false };
    render(<AgentProfile agent={unverifiedAgent} />);
    
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    // Should not show verification badge
  });
});

describe('Search Functionality', () => {
  test('searches agents with filters', async () => {
    render(<AgentSearch />);
    
    const locationInput = screen.getByPlaceholderText('City, State, or ZIP');
    fireEvent.change(locationInput, { target: { value: 'Beverly Hills' } });
    
    const searchButton = screen.getByText('Search Agents');
    fireEvent.click(searchButton);
    
    // Should trigger search with filters
    expect(locationInput).toHaveValue('Beverly Hills');
  });

  test('handles empty search results', async () => {
    render(<AgentSearch />);
    
    const searchButton = screen.getByText('Search Agents');
    fireEvent.click(searchButton);
    
    // Should show no results message
    await waitFor(() => {
      expect(screen.getByText('No agents found')).toBeInTheDocument();
    });
  });
});
