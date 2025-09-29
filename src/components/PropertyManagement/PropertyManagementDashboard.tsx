'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Wrench, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  Settings,
  BarChart3,
  FileText,
  MessageSquare
} from 'lucide-react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { PropertyManagement, TenantInfo, MaintenanceRequest, AutomationTask } from '@/types/propertyManagement';
import { PropertyCard } from './PropertyCard';
import { TenantCard } from './TenantCard';
import { MaintenanceCard } from './MaintenanceCard';
import { AutomationCard } from './AutomationCard';
import { PropertyAnalytics } from './PropertyAnalytics';
import { TenantAnalytics } from './TenantAnalytics';
import { AutomationAnalytics } from './AutomationAnalytics';
import { PropertyRegistrationForm } from './PropertyRegistrationForm';
import { TenantRegistrationForm } from './TenantRegistrationForm';
import { MaintenanceRequestForm } from './MaintenanceRequestForm';
import { AutomationTaskForm } from './AutomationTaskForm';

interface PropertyManagementDashboardProps {
  className?: string;
}

export const PropertyManagementDashboard: React.FC<PropertyManagementDashboardProps> = ({ 
  className = '' 
}) => {
  const {
    properties,
    tenants,
    maintenanceRequests,
    automationTasks,
    dashboard,
    analytics,
    notifications,
    loading,
    errors,
    refreshAll,
    clearErrors,
    removeNotification,
    markNotificationAsRead
  } = usePropertyManagement();

  const [activeTab, setActiveTab] = useState('overview');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showAutomationForm, setShowAutomationForm] = useState(false);

  // Calculate summary statistics
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.isActive).length;
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.isActive).length;
  const pendingMaintenance = maintenanceRequests.filter(r => r.status === 'PENDING').length;
  const activeAutomationTasks = automationTasks.filter(t => t.isActive).length;
  const totalRevenue = properties.reduce((sum, p) => sum + p.totalRevenue, 0);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Get recent activities
  const recentMaintenance = maintenanceRequests
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const recentAutomation = automationTasks
    .sort((a, b) => b.lastExecuted || 0 - (a.lastExecuted || 0))
    .slice(0, 5);

  const handleRefresh = async () => {
    await refreshAll();
  };

  const handleClearErrors = () => {
    clearErrors();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
          <p className="text-muted-foreground">
            Manage your properties, tenants, and automation tasks
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading.dashboard}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading.dashboard ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {Object.values(errors).some(error => error) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">Errors occurred while loading data</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearErrors}>
                Clear Errors
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {Object.entries(errors).map(([key, error]) => 
                error && (
                  <div key={key} className="text-sm text-red-700">
                    {key}: {error}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {activeProperties} active properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {activeTenants} active tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">
              {activeAutomationTasks} automation tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {unreadNotifications > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Notifications ({unreadNotifications})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? 'bg-white' : 'bg-blue-100 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={notification.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                        {notification.priority}
                      </Badge>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Maintenance Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Recent Maintenance Requests
                </CardTitle>
                <CardDescription>
                  Latest maintenance requests across all properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMaintenance.length > 0 ? (
                    recentMaintenance.map((request) => (
                      <div key={request.requestId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{request.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Property {request.propertyId} • {request.priority}
                          </p>
                        </div>
                        <Badge variant={
                          request.status === 'COMPLETED' ? 'default' :
                          request.status === 'IN_PROGRESS' ? 'secondary' :
                          request.priority === 'HIGH' ? 'destructive' : 'outline'
                        }>
                          {request.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No maintenance requests found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Automation Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  Recent Automation Tasks
                </CardTitle>
                <CardDescription>
                  Latest automation task executions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAutomation.length > 0 ? (
                    recentAutomation.map((task) => (
                      <div key={task.taskId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{task.taskType.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">
                            Property {task.propertyId} • {task.schedule.scheduleType}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={task.isActive ? 'default' : 'secondary'}>
                            {task.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {task.successCount}/{task.executionCount}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No automation tasks found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Properties</h2>
            <Button onClick={() => setShowPropertyForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.propertyId} property={property} />
            ))}
          </div>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Tenants</h2>
            <Button onClick={() => setShowTenantForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <TenantCard key={tenant.tenantId} tenant={tenant} />
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Maintenance Requests</h2>
            <Button onClick={() => setShowMaintenanceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {maintenanceRequests.map((request) => (
              <MaintenanceCard key={request.requestId} request={request} />
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Automation Tasks</h2>
            <Button onClick={() => setShowAutomationForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {automationTasks.map((task) => (
              <AutomationCard key={task.taskId} task={task} />
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <PropertyAnalytics analytics={analytics.property} />
            <TenantAnalytics analytics={analytics.tenant} />
            <AutomationAnalytics analytics={analytics.automation} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      {showPropertyForm && (
        <PropertyRegistrationForm
          onClose={() => setShowPropertyForm(false)}
          onSuccess={() => {
            setShowPropertyForm(false);
            refreshAll();
          }}
        />
      )}

      {showTenantForm && (
        <TenantRegistrationForm
          onClose={() => setShowTenantForm(false)}
          onSuccess={() => {
            setShowTenantForm(false);
            refreshAll();
          }}
        />
      )}

      {showMaintenanceForm && (
        <MaintenanceRequestForm
          onClose={() => setShowMaintenanceForm(false)}
          onSuccess={() => {
            setShowMaintenanceForm(false);
            refreshAll();
          }}
        />
      )}

      {showAutomationForm && (
        <AutomationTaskForm
          onClose={() => setShowAutomationForm(false)}
          onSuccess={() => {
            setShowAutomationForm(false);
            refreshAll();
          }}
        />
      )}
    </div>
  );
};

