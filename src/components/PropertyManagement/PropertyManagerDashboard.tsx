import React, { useState, useEffect } from 'react';
import { PropertyManagementDashboard as DashboardType } from '@/types/propertyManagement';
import { TenantService } from '@/lib/tenantService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PropertyManagerDashboardProps {
  propertyId: string;
}

export const PropertyManagerDashboard: React.FC<PropertyManagerDashboardProps> = ({ propertyId }) => {
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'maintenance' | 'financials' | 'reports'>('overview');

  useEffect(() => {
    loadDashboard();
  }, [propertyId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await TenantService.getPropertyManagementDashboard(propertyId);
      setDashboard(dashboardData);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return TenantService.formatCurrency(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (!dashboard) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard not found</h3>
          <p className="text-gray-500">Unable to load property management dashboard.</p>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tenants', label: 'Tenants', icon: '👥' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'financials', label: 'Financials', icon: '💰' },
    { id: 'reports', label: 'Reports', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your property operations, tenants, and finances
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Add New Tenant
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPercentage(dashboard.overview.occupancyRate)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(dashboard.overview.monthlyRent)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Net Income</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(dashboard.overview.netIncome)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Units</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboard.overview.totalUnits}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Property Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Units:</span>
                  <span className="font-medium">{dashboard.overview.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupied Units:</span>
                  <span className="font-medium">{dashboard.overview.occupiedUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vacant Units:</span>
                  <span className="font-medium">{dashboard.overview.vacantUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupancy Rate:</span>
                  <span className="font-medium">{formatPercentage(dashboard.overview.occupancyRate)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Rent:</span>
                  <span className="font-medium">{formatCurrency(dashboard.overview.monthlyRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Expenses:</span>
                  <span className="font-medium">{formatCurrency(dashboard.overview.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">Net Income:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(dashboard.overview.netIncome)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tenants' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{dashboard.tenants.active}</p>
                <p className="text-sm text-gray-500">Active Tenants</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{dashboard.tenants.new}</p>
                <p className="text-sm text-gray-500">New Tenants</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{dashboard.tenants.departing}</p>
                <p className="text-sm text-gray-500">Departing</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{dashboard.tenants.overdue}</p>
                <p className="text-sm text-gray-500">Overdue Payments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Management</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add New Tenant
              </Button>
              <Button variant="outline">
                Send Rent Reminders
              </Button>
              <Button variant="outline">
                Generate Lease Renewals
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{dashboard.maintenance.open}</p>
                <p className="text-sm text-gray-500">Open Requests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{dashboard.maintenance.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{dashboard.maintenance.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{dashboard.maintenance.overdue}</p>
                <p className="text-sm text-gray-500">Overdue</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Management</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule Inspection
              </Button>
              <Button variant="outline">
                Assign Vendors
              </Button>
              <Button variant="outline">
                Generate Reports
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(dashboard.financials.rentCollected)}
                </p>
                <p className="text-sm text-gray-500">Rent Collected</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {formatCurrency(dashboard.financials.rentDue)}
                </p>
                <p className="text-sm text-gray-500">Rent Due</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(dashboard.financials.expenses)}
                </p>
                <p className="text-sm text-gray-500">Expenses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(dashboard.financials.profit)}
                </p>
                <p className="text-sm text-gray-500">Net Profit</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Management</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Record Expense
              </Button>
              <Button variant="outline">
                Generate Financial Report
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'reports' && (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
            <p className="text-gray-500">Generate detailed reports and analytics for your property.</p>
            <div className="mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Generate Report
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
