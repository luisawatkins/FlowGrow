'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useInsurance } from '@/hooks/useInsurance';
import { InsurancePolicy, InsuranceClaim, RiskAssessment, InsuranceMetrics } from '@/types/insurance';

interface InsuranceDashboardProps {
  className?: string;
}

export const InsuranceDashboard: React.FC<InsuranceDashboardProps> = ({ className }) => {
  const { loading, error, getPolicies, getClaims, getRiskAssessment, getMetrics } = useInsurance();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [metrics, setMetrics] = useState<InsuranceMetrics | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [policiesData, claimsData, metricsData] = await Promise.all([
        getPolicies(),
        getClaims(),
        getMetrics()
      ]);
      
      setPolicies(policiesData);
      setClaims(claimsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading && !policies.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={loadInitialData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance & Risk Management</h1>
          <p className="text-muted-foreground">
            Comprehensive property insurance and risk assessment system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Last updated: {metrics ? new Date(metrics.lastUpdated).toLocaleTimeString() : 'N/A'}
          </Button>
          <Button onClick={loadInitialData} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activePolicies || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics?.totalPolicies || 0} total policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.totalCoverage || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined coverage amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.openClaims || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {metrics?.totalClaims || 0} total claims
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(metrics?.riskScore || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Risk assessment score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Summary</CardTitle>
                <CardDescription>
                  Overview of your insurance policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Premiums</span>
                  <span className="text-sm font-bold">
                    {formatCurrency(metrics?.totalPremiums || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Claim Amount</span>
                  <span className="text-sm font-bold">
                    {formatCurrency(metrics?.averageClaimAmount || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing Time</span>
                  <span className="text-sm font-bold">
                    {metrics?.averageProcessingTime || 0} days
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Policy Health</span>
                    <span className="text-sm font-bold">Good</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest insurance-related activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claims.slice(0, 3).map((claim) => (
                    <div key={claim.claimID} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Claim #{claim.claimID.slice(-6)}</p>
                          <p className="text-xs text-muted-foreground">
                            {claim.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(claim.amount)}
                        </p>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common insurance management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>New Policy</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Submit Claim</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Risk Assessment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Insurance Policies</CardTitle>
                  <CardDescription>
                    Manage your property insurance policies
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.policyID} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{policy.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            Policy #{policy.policyNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Coverage</p>
                        <p className="font-medium">{formatCurrency(policy.coverageAmount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Premium</p>
                        <p className="font-medium">{formatCurrency(policy.premium)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductible</p>
                        <p className="font-medium">{formatCurrency(policy.deductible)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">{formatDate(policy.endDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Insurance Claims</CardTitle>
                  <CardDescription>
                    Track and manage your insurance claims
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Claim
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.claimID} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Claim #{claim.claimID.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">
                            {claim.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{formatCurrency(claim.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{claim.claimType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Submitted</p>
                        <p className="font-medium">{formatDate(claim.submittedDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Documents</p>
                        <p className="font-medium">{claim.documents.length} files</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Property risk analysis and mitigation strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessments.map((assessment) => (
                  <div key={assessment.assessmentID} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Property #{assessment.propertyID}</p>
                          <p className="text-sm text-muted-foreground">
                            Assessed on {formatDate(assessment.assessmentDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                          {assessment.riskLevel} risk
                        </Badge>
                        <span className="text-sm font-bold">
                          Score: {assessment.riskScore}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Risk Factors</p>
                        <div className="space-y-2">
                          {assessment.riskFactors.slice(0, 2).map((factor) => (
                            <div key={factor.factorID} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{factor.name}</span>
                              <Badge variant="outline">{factor.category}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Recommendations</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {assessment.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
