'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Shield,
  Star
} from 'lucide-react';
import { TenantAnalytics as TenantAnalyticsType } from '@/types/propertyManagement';

interface TenantAnalyticsProps {
  analytics: TenantAnalyticsType | null;
  className?: string;
}

export const TenantAnalytics: React.FC<TenantAnalyticsProps> = ({ 
  analytics, 
  className = '' 
}) => {
  if (!analytics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Tenant Analytics
          </CardTitle>
          <CardDescription>Tenant performance and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No analytics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 25) return 'text-green-600';
    if (score <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReputationScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVerificationRate = () => {
    return Math.round((analytics.verifiedTenants / analytics.totalTenants) * 100);
  };

  const getLeaseExpirationRate = () => {
    return Math.round((analytics.expiringLeases / analytics.activeLeases) * 100);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Tenant Analytics
        </CardTitle>
        <CardDescription>Tenant performance and metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalTenants}
            </div>
            <div className="text-sm text-blue-600">Total Tenants</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.verifiedTenants} verified
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {analytics.activeLeases}
            </div>
            <div className="text-sm text-green-600">Active Leases</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.expiringLeases} expiring
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Verification Rate</span>
            <span className="text-lg font-bold text-blue-600">
              {getVerificationRate()}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${getVerificationRate()}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pending Verifications:</span>
            <Badge variant="secondary">
              {analytics.pendingVerifications}
            </Badge>
          </div>
        </div>

        {/* Credit and Risk Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className={`text-2xl font-bold ${getCreditScoreColor(analytics.averageCreditScore)}`}>
              {analytics.averageCreditScore}
            </div>
            <div className="text-sm text-green-600">Avg Credit Score</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div className={`text-2xl font-bold ${getRiskScoreColor(analytics.averageRiskScore)}`}>
              {analytics.averageRiskScore}
            </div>
            <div className="text-sm text-orange-600">Avg Risk Score</div>
          </div>
        </div>

        {/* Reputation Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Reputation Score</span>
            <span className={`text-lg font-bold ${getReputationScoreColor(analytics.averageReputationScore)}`}>
              {analytics.averageReputationScore}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getReputationScoreColor(analytics.averageReputationScore).replace('text-', 'bg-')}`}
              style={{ width: `${analytics.averageReputationScore}%` }}
            ></div>
          </div>
        </div>

        {/* Lease Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Lease Status</h4>
          
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">Active Leases</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {analytics.activeLeases}
            </Badge>
          </div>

          {analytics.expiringLeases > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Expiring Soon</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {analytics.expiringLeases}
              </Badge>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Alerts</h4>
          
          {analytics.pendingVerifications > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Pending Verifications</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {analytics.pendingVerifications}
              </Badge>
            </div>
          )}

          {analytics.expiringLeases > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-800">Leases Expiring</span>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {analytics.expiringLeases}
              </Badge>
            </div>
          )}

          {analytics.pendingVerifications === 0 && analytics.expiringLeases === 0 && (
            <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">All tenants in good standing</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {analytics.totalTenants}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {analytics.verifiedTenants}
            </div>
            <div className="text-xs text-muted-foreground">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {analytics.activeLeases}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


