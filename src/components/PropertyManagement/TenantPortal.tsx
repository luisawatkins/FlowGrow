import React, { useState, useEffect } from 'react';
import { TenantPortal as TenantPortalType, RentPayment, MaintenanceRequest } from '@/types/propertyManagement';
import { TenantService } from '@/lib/tenantService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TenantPortalProps {
  tenantId: string;
}

export const TenantPortal: React.FC<TenantPortalProps> = ({ tenantId }) => {
  const [portal, setPortal] = useState<TenantPortalType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'maintenance' | 'documents' | 'profile'>('dashboard');

  useEffect(() => {
    loadTenantPortal();
  }, [tenantId]);

  const loadTenantPortal = async () => {
    try {
      setLoading(true);
      setError(null);
      const portalData = await TenantService.getTenantPortal(tenantId);
      setPortal(portalData);
    } catch (err) {
      setError('Failed to load tenant portal');
      console.error('Error loading tenant portal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData: Partial<RentPayment>) => {
    try {
      setLoading(true);
      await TenantService.createRentPayment(paymentData);
      await loadTenantPortal(); // Refresh data
    } catch (err) {
      setError('Failed to submit payment');
      console.error('Error submitting payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceRequest = async (requestData: Partial<MaintenanceRequest>) => {
    try {
      setLoading(true);
      await TenantService.createMaintenanceRequest(requestData);
      await loadTenantPortal(); // Refresh data
    } catch (err) {
      setError('Failed to submit maintenance request');
      console.error('Error submitting maintenance request:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return TenantService.formatCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return TenantService.formatDate(dateString);
  };

  const getPaymentStatusColor = (status: string) => {
    return TenantService.getPaymentStatusColor(status);
  };

  const getMaintenanceStatusColor = (status: string) => {
    return TenantService.getMaintenanceStatusColor(status);
  };

  if (loading && !portal) {
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Portal</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }

  if (!portal) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Portal not found</h3>
          <p className="text-gray-500">Unable to load tenant portal data.</p>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Portal</h1>
          <p className="text-gray-600 mt-2">
            Manage your rental payments, maintenance requests, and lease information
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-500">
            Last login: {formatDate(portal.lastLogin)}
          </span>
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
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Upcoming Payments</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {portal.dashboard.upcomingPayments.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Open Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {portal.dashboard.recentMaintenanceRequests.filter(r => r.status !== 'completed').length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Documents</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {portal.dashboard.documents.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming Payments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
            {portal.dashboard.upcomingPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming payments</p>
            ) : (
              <div className="space-y-3">
                {portal.dashboard.upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(payment.amount)} - {formatDate(payment.dueDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due in {TenantService.calculateDaysUntilDue(payment.dueDate)} days
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Maintenance Requests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance Requests</h3>
            {portal.dashboard.recentMaintenanceRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No maintenance requests</p>
            ) : (
              <div className="space-y-3">
                {portal.dashboard.recentMaintenanceRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.title}</p>
                      <p className="text-sm text-gray-500">
                        Submitted {formatDate(request.submittedDate)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'payments' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          {portal.dashboard.upcomingPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No payment history available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portal.dashboard.upcomingPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentMethod}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'maintenance' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Requests</h3>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              New Request
            </Button>
          </div>
          {portal.dashboard.recentMaintenanceRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No maintenance requests</p>
          ) : (
            <div className="space-y-4">
              {portal.dashboard.recentMaintenanceRequests.map((request) => (
                <div key={request.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{request.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {request.category}</span>
                    <span>Priority: {request.priority}</span>
                    <span>Submitted: {formatDate(request.submittedDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
          {portal.dashboard.documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents available</p>
          ) : (
            <div className="space-y-3">
              {portal.dashboard.documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{document.name}</p>
                    <p className="text-sm text-gray-500">
                      {document.type} • {formatDate(document.uploadedDate)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'profile' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={portal.preferences.notifications.email}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={portal.preferences.notifications.sms}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">SMS notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={portal.preferences.notifications.push}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Push notifications</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
