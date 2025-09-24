import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PropertyManagement } from '@/components/PropertyManagement/PropertyManagement';
import { TenantPortal } from '@/components/PropertyManagement/TenantPortal';
import { PropertyManagerDashboard } from '@/components/PropertyManagement/PropertyManagerDashboard';

// Mock the services
jest.mock('@/lib/tenantService', () => ({
  TenantService: {
    getTenantPortal: jest.fn().mockResolvedValue({
      tenantId: '1',
      propertyId: 'prop-1',
      leaseId: 'lease-1',
      dashboard: {
        upcomingPayments: [
          {
            id: '1',
            amount: 2500,
            dueDate: '2024-02-01',
            status: 'pending',
            paymentMethod: 'bank_transfer'
          }
        ],
        recentMaintenanceRequests: [
          {
            id: '1',
            title: 'Kitchen Sink Leak',
            description: 'The kitchen sink has a slow leak',
            status: 'submitted',
            submittedDate: '2024-01-10'
          }
        ],
        announcements: [],
        documents: []
      },
      features: {
        rentPayment: true,
        maintenanceRequests: true,
        documentAccess: true,
        announcements: true,
        leaseRenewal: true,
        moveOut: true
      },
      lastLogin: '2024-01-15T10:00:00Z',
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: 'en',
        timezone: 'America/Los_Angeles'
      }
    }),
    getPropertyManagementDashboard: jest.fn().mockResolvedValue({
      propertyId: 'prop-1',
      overview: {
        totalUnits: 10,
        occupiedUnits: 8,
        vacantUnits: 2,
        occupancyRate: 80,
        monthlyRent: 20000,
        monthlyExpenses: 5000,
        netIncome: 15000
      },
      tenants: {
        active: 8,
        new: 1,
        departing: 0,
        overdue: 1
      },
      maintenance: {
        open: 3,
        inProgress: 2,
        completed: 15,
        overdue: 1
      },
      financials: {
        rentCollected: 18000,
        rentDue: 2000,
        expenses: 5000,
        profit: 13000
      },
      recentActivity: [],
      upcomingTasks: [],
      alerts: []
    }),
    formatCurrency: jest.fn((amount) => `$${amount.toLocaleString()}`),
    formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
    getPaymentStatusColor: jest.fn(() => 'bg-yellow-100 text-yellow-800'),
    getMaintenanceStatusColor: jest.fn(() => 'bg-blue-100 text-blue-800'),
    calculateDaysUntilDue: jest.fn(() => 15)
  }
}));

describe('PropertyManagement', () => {
  test('renders property management component for manager', () => {
    render(<PropertyManagement propertyId="prop-1" userType="manager" />);
    
    expect(screen.getByText('Property Management')).toBeInTheDocument();
    expect(screen.getByText('Manage your property operations, tenants, and finances')).toBeInTheDocument();
  });

  test('renders tenant portal for tenant user type', () => {
    render(<PropertyManagement propertyId="prop-1" userType="tenant" tenantId="tenant-1" />);
    
    expect(screen.getByText('Tenant Portal')).toBeInTheDocument();
    expect(screen.getByText('Manage your rental payments, maintenance requests, and lease information')).toBeInTheDocument();
  });

  test('renders owner dashboard for owner user type', () => {
    render(<PropertyManagement propertyId="prop-1" userType="owner" />);
    
    expect(screen.getByText('Property Owner Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Monitor your property performance and financial metrics')).toBeInTheDocument();
  });

  test('shows add new tenant button for manager', () => {
    render(<PropertyManagement propertyId="prop-1" userType="manager" />);
    
    expect(screen.getByText('Add New Tenant')).toBeInTheDocument();
  });

  test('shows features overview', () => {
    render(<PropertyManagement propertyId="prop-1" userType="manager" />);
    
    expect(screen.getByText('Property Management Features')).toBeInTheDocument();
    expect(screen.getByText('Tenant Management')).toBeInTheDocument();
    expect(screen.getByText('Rent Collection')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Tracking')).toBeInTheDocument();
  });

  test('shows owner dashboard metrics', () => {
    render(<PropertyManagement propertyId="prop-1" userType="owner" />);
    
    expect(screen.getByText('Total Properties')).toBeInTheDocument();
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
    expect(screen.getByText('Occupancy Rate')).toBeInTheDocument();
    expect(screen.getByText('ROI')).toBeInTheDocument();
  });
});

describe('TenantPortal', () => {
  test('renders tenant portal', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Tenant Portal')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    // Should show loading spinner
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('shows dashboard tab by default', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Payments')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });
  });

  test('switches to payments tab when clicked', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      const paymentsTab = screen.getByText('Payments');
      fireEvent.click(paymentsTab);
      
      expect(screen.getByText('Payment History')).toBeInTheDocument();
    });
  });

  test('switches to maintenance tab when clicked', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      const maintenanceTab = screen.getByText('Maintenance');
      fireEvent.click(maintenanceTab);
      
      expect(screen.getByText('Maintenance Requests')).toBeInTheDocument();
    });
  });

  test('switches to documents tab when clicked', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      const documentsTab = screen.getByText('Documents');
      fireEvent.click(documentsTab);
      
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });
  });

  test('switches to profile tab when clicked', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      const profileTab = screen.getByText('Profile');
      fireEvent.click(profileTab);
      
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });
  });

  test('shows upcoming payments in dashboard', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Upcoming Payments')).toBeInTheDocument();
    });
  });

  test('shows recent maintenance requests in dashboard', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Maintenance Requests')).toBeInTheDocument();
    });
  });

  test('shows quick stats in dashboard', async () => {
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Upcoming Payments')).toBeInTheDocument();
      expect(screen.getByText('Open Requests')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });
  });
});

describe('PropertyManagerDashboard', () => {
  test('renders property manager dashboard', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Property Management Dashboard')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    // Should show loading spinner
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('shows overview tab by default', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Tenants')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });
  });

  test('switches to tenants tab when clicked', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const tenantsTab = screen.getByText('Tenants');
      fireEvent.click(tenantsTab);
      
      expect(screen.getByText('Tenant Summary')).toBeInTheDocument();
    });
  });

  test('switches to maintenance tab when clicked', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const maintenanceTab = screen.getByText('Maintenance');
      fireEvent.click(maintenanceTab);
      
      expect(screen.getByText('Maintenance Summary')).toBeInTheDocument();
    });
  });

  test('switches to financials tab when clicked', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const financialsTab = screen.getByText('Financials');
      fireEvent.click(financialsTab);
      
      expect(screen.getByText('Financial Summary')).toBeInTheDocument();
    });
  });

  test('switches to reports tab when clicked', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const reportsTab = screen.getByText('Reports');
      fireEvent.click(reportsTab);
      
      expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    });
  });

  test('shows key metrics in overview', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Occupancy Rate')).toBeInTheDocument();
      expect(screen.getByText('Monthly Rent')).toBeInTheDocument();
      expect(screen.getByText('Net Income')).toBeInTheDocument();
      expect(screen.getByText('Total Units')).toBeInTheDocument();
    });
  });

  test('shows property overview section', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Property Overview')).toBeInTheDocument();
      expect(screen.getByText('Financial Summary')).toBeInTheDocument();
    });
  });

  test('shows tenant summary in tenants tab', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const tenantsTab = screen.getByText('Tenants');
      fireEvent.click(tenantsTab);
      
      expect(screen.getByText('Active Tenants')).toBeInTheDocument();
      expect(screen.getByText('New Tenants')).toBeInTheDocument();
      expect(screen.getByText('Departing')).toBeInTheDocument();
      expect(screen.getByText('Overdue Payments')).toBeInTheDocument();
    });
  });

  test('shows maintenance summary in maintenance tab', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const maintenanceTab = screen.getByText('Maintenance');
      fireEvent.click(maintenanceTab);
      
      expect(screen.getByText('Open Requests')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });

  test('shows financial summary in financials tab', async () => {
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      const financialsTab = screen.getByText('Financials');
      fireEvent.click(financialsTab);
      
      expect(screen.getByText('Rent Collected')).toBeInTheDocument();
      expect(screen.getByText('Rent Due')).toBeInTheDocument();
      expect(screen.getByText('Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Profit')).toBeInTheDocument();
    });
  });
});

describe('Property Management Integration', () => {
  test('handles management complete callback', () => {
    const onManagementComplete = jest.fn();
    render(
      <PropertyManagement 
        propertyId="prop-1" 
        userType="manager" 
        onManagementComplete={onManagementComplete}
      />
    );
    
    // This would be triggered when management actions are completed
    // The actual implementation would depend on the specific action
  });

  test('handles different user types correctly', () => {
    const { rerender } = render(<PropertyManagement propertyId="prop-1" userType="manager" />);
    expect(screen.getByText('Property Management')).toBeInTheDocument();
    
    rerender(<PropertyManagement propertyId="prop-1" userType="tenant" tenantId="tenant-1" />);
    expect(screen.getByText('Tenant Portal')).toBeInTheDocument();
    
    rerender(<PropertyManagement propertyId="prop-1" userType="owner" />);
    expect(screen.getByText('Property Owner Dashboard')).toBeInTheDocument();
  });
});

describe('Property Management Edge Cases', () => {
  test('handles missing tenantId for tenant user type', () => {
    render(<PropertyManagement propertyId="prop-1" userType="tenant" />);
    
    // Should handle missing tenantId gracefully
    expect(screen.getByText('Tenant Portal')).toBeInTheDocument();
  });

  test('handles error state in tenant portal', async () => {
    const mockGetTenantPortal = require('@/lib/tenantService').TenantService.getTenantPortal;
    mockGetTenantPortal.mockRejectedValueOnce(new Error('Failed to load'));
    
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Portal')).toBeInTheDocument();
    });
  });

  test('handles error state in property manager dashboard', async () => {
    const mockGetPropertyManagementDashboard = require('@/lib/tenantService').TenantService.getPropertyManagementDashboard;
    mockGetPropertyManagementDashboard.mockRejectedValueOnce(new Error('Failed to load'));
    
    render(<PropertyManagerDashboard propertyId="prop-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
    });
  });

  test('handles empty data gracefully', async () => {
    const mockGetTenantPortal = require('@/lib/tenantService').TenantService.getTenantPortal;
    mockGetTenantPortal.mockResolvedValueOnce(null);
    
    render(<TenantPortal tenantId="tenant-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Portal not found')).toBeInTheDocument();
    });
  });
});
