'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Activity, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  Building2
} from 'lucide-react';
import { AutomationAnalytics as AutomationAnalyticsType, AutomationTaskType } from '@/types/propertyManagement';

interface AutomationAnalyticsProps {
  analytics: AutomationAnalyticsType | null;
  className?: string;
}

export const AutomationAnalytics: React.FC<AutomationAnalyticsProps> = ({ 
  analytics, 
  className = '' 
}) => {
  if (!analytics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Automation Analytics
          </CardTitle>
          <CardDescription>Automation performance and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No analytics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTaskType = (taskType: AutomationTaskType) => {
    return taskType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getExecutionTimeColor = (time: number) => {
    if (time <= 1000) return 'text-green-600';
    if (time <= 3000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatExecutionTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  const formatGasUsed = (gas: number) => {
    return gas.toLocaleString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Automation Analytics
        </CardTitle>
        <CardDescription>Automation performance and metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalTasks}
            </div>
            <div className="text-sm text-blue-600">Total Tasks</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.activeTasks} active
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {analytics.totalExecutions}
            </div>
            <div className="text-sm text-green-600">Total Executions</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.successfulExecutions} successful
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Success Rate</span>
            <span className={`text-lg font-bold ${getSuccessRateColor(analytics.successRate)}`}>
              {analytics.successRate}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getSuccessRateColor(analytics.successRate).replace('text-', 'bg-')}`}
              style={{ width: `${analytics.successRate}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Successful:</span>
              <span className="font-medium text-green-600">{analytics.successfulExecutions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Failed:</span>
              <span className="font-medium text-red-600">{analytics.totalExecutions - analytics.successfulExecutions}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`text-2xl font-bold ${getExecutionTimeColor(analytics.averageExecutionTime)}`}>
              {formatExecutionTime(analytics.averageExecutionTime)}
            </div>
            <div className="text-sm text-purple-600">Avg Execution Time</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatGasUsed(analytics.totalGasUsed)}
            </div>
            <div className="text-sm text-orange-600">Total Gas Used</div>
          </div>
        </div>

        {/* Most Common Task Type */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Most Common Task Type</h4>
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                {formatTaskType(analytics.mostCommonTaskType)}
              </span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Most Active
            </Badge>
          </div>
        </div>

        {/* Tasks by Property */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Tasks by Property</h4>
          <div className="space-y-2">
            {Object.entries(analytics.tasksByProperty).slice(0, 5).map(([propertyId, taskCount]) => (
              <div key={propertyId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Property #{propertyId}</span>
                </div>
                <Badge variant="secondary">
                  {taskCount} tasks
                </Badge>
              </div>
            ))}
            {Object.keys(analytics.tasksByProperty).length > 5 && (
              <div className="text-xs text-muted-foreground text-center">
                +{Object.keys(analytics.tasksByProperty).length - 5} more properties
              </div>
            )}
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance Indicators</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">Success Rate</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {analytics.successRate}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">Active Tasks</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {analytics.activeTasks}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {analytics.totalTasks}
            </div>
            <div className="text-xs text-muted-foreground">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {analytics.successRate}%
            </div>
            <div className="text-xs text-muted-foreground">Success</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {formatExecutionTime(analytics.averageExecutionTime)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


