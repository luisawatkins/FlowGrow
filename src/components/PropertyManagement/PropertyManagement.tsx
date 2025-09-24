import React, { useState } from 'react';
import { TenantPortal } from './TenantPortal';
import { PropertyManagerDashboard } from './PropertyManagerDashboard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PropertyManagementProps {
  propertyId: string;
  userType: 'tenant' | 'manager' | 'owner';
  tenantId?: string;
  onManagementComplete?: (data: any) => void;
}

export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  propertyId,
  userType,
  tenantId,
  onManagementComplete
}) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'tenants' | 'maintenance' | 'financials'>('dashboard');

  const handleManagementComplete = (data: any) => {
    onManagementComplete?.(data);
  };

  const getViewTitle = () => {
    switch (userType) {
      case 'tenant':
        return 'Tenant Portal';
      case 'manager':
        return 'Property Management';
      case 'owner':
        return 'Property Owner Dashboard';
      default:
        return 'Property Management';
    }
  };

  const getViewDescription = () => {
    switch (userType) {
      case 'tenant':
        return 'Manage your rental payments, maintenance requests, and lease information';
      case 'manager':
        return 'Manage your property operations, tenants, and finances';
      case 'owner':
        return 'Monitor your property performance and financial metrics';
      default:
        return 'Manage your property operations and tenants';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getViewTitle()}</h1>
          <p className="text-gray-600 mt-2">{getViewDescription()}</p>
        </div>
        {userType === 'manager' && (
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Add New Tenant
            </Button>
          </div>
        )}
      </div>

      {/* User Type Specific Content */}
      {userType === 'tenant' && tenantId && (
        <TenantPortal tenantId={tenantId} />
      )}

      {userType === 'manager' && (
        <PropertyManagerDashboard propertyId={propertyId} />
      )}

      {userType === 'owner' && (
        <div className="space-y-6">
          {/* Owner Dashboard */}
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
                  <p className="text-sm font-medium text-gray-500">Total Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">5</p>
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
                  <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                  <p className="text-2xl font-semibold text-gray-900">$25,000</p>
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
                  <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">95%</p>
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
                  <p className="text-sm font-medium text-gray-500">ROI</p>
                  <p className="text-2xl font-semibold text-gray-900">12.5%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Property Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">$2.5M</p>
                <p className="text-sm text-gray-500">Total Property Value</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">$300K</p>
                <p className="text-sm text-gray-500">Annual Net Income</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">8.2%</p>
                <p className="text-sm text-gray-500">Cap Rate</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-2">📊</span>
                <span>View Reports</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-2">💰</span>
                <span>Financial Summary</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-2">👥</span>
                <span>Tenant Overview</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-2">🔧</span>
                <span>Maintenance Status</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Features Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Property Management Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Tenant Management</h3>
            <p className="text-sm text-gray-600">
              Manage tenant applications, leases, and communications
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Rent Collection</h3>
            <p className="text-sm text-gray-600">
              Track rent payments, late fees, and payment history
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Maintenance Tracking</h3>
            <p className="text-sm text-gray-600">
              Manage maintenance requests and vendor relationships
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Financial Reporting</h3>
            <p className="text-sm text-gray-600">
              Generate detailed financial reports and analytics
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Document Management</h3>
            <p className="text-sm text-gray-600">
              Store and manage lease documents and legal paperwork
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Communication Hub</h3>
            <p className="text-sm text-gray-600">
              Centralized communication with tenants and vendors
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
