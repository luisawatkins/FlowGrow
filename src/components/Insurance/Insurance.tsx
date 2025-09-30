'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  Building,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react';
import { InsuranceDashboard } from './InsuranceDashboard';

interface InsuranceProps {
  className?: string;
}

export const Insurance: React.FC<InsuranceProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting insurance data...');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance & Risk Management</h1>
          <p className="text-muted-foreground">
            Comprehensive property insurance, risk assessment, and claims management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Active Policies</p>
                <p className="text-xs text-muted-foreground">3 policies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Open Claims</p>
                <p className="text-xs text-muted-foreground">2 claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Risk Score</p>
                <p className="text-xs text-muted-foreground">Medium risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Coverage</p>
                <p className="text-xs text-muted-foreground">$1.5M total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Policies</span>
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Claims</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <InsuranceDashboard />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Insurance Policies</CardTitle>
                  <CardDescription>
                    Manage your property insurance policies and coverage
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Policy Management</h3>
                <p className="text-muted-foreground mb-4">
                  Create, update, and manage your property insurance policies.
                </p>
                <Button>
                  Create New Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Claims Management</CardTitle>
                  <CardDescription>
                    Submit, track, and manage insurance claims
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Claim
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Claims Processing</h3>
                <p className="text-muted-foreground mb-4">
                  Submit new claims, track existing ones, and manage documentation.
                </p>
                <Button>
                  Submit New Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Settings</CardTitle>
              <CardDescription>
                Configure your insurance preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Auto-Renewal</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automatically renew policies before they expire
                    </p>
                    <Button variant="outline" size="sm">
                      Configure Auto-Renewal
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Risk Assessment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Set frequency for automatic risk assessments
                    </p>
                    <Button variant="outline" size="sm">
                      Configure Risk Assessment
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Notifications</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage email and SMS notifications for claims and policies
                    </p>
                    <Button variant="outline" size="sm">
                      Configure Notifications
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};



