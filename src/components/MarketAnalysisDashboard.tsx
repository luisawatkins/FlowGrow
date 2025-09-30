// Market Analysis Dashboard - Main Component

'use client';

import React, { useState } from 'react';
import { useMarketAnalysis } from '@/hooks/useMarketAnalysis';
import { useMarketInsights } from '@/hooks/useMarketInsights';
import { useMarketOpportunities } from '@/hooks/useMarketOpportunities';
import { useMarketReport } from '@/hooks/useMarketReport';
import { 
  MarketAnalysisRequest, 
  PropertyType, 
  MarketType,
  InsightType,
  OpportunityType,
  RiskLevel,
  TimeHorizon
} from '@/types/market';
import { MarketOverview } from './MarketAnalysis/MarketOverview';
import { MarketTrends } from './MarketAnalysis/MarketTrends';
import { MarketInsights } from './MarketAnalysis/MarketInsights';
import { InvestmentOpportunities } from './MarketAnalysis/InvestmentOpportunities';
import { MarketReport } from './MarketAnalysis/MarketReport';
import { MarketFilters } from './MarketAnalysis/MarketFilters';

interface MarketAnalysisDashboardProps {
  propertyId?: string;
  className?: string;
}

type TabType = 'overview' | 'trends' | 'insights' | 'opportunities' | 'report';

export const MarketAnalysisDashboard: React.FC<MarketAnalysisDashboardProps> = ({ 
  propertyId, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filters, setFilters] = useState<MarketAnalysisRequest>({
    location: 'San Francisco, CA',
    propertyType: PropertyType.SINGLE_FAMILY,
    marketType: MarketType.RESIDENTIAL,
    includeForecast: true,
    includeInsights: true,
    includeComparisons: true
  });

  const { 
    analysis, 
    loading: analysisLoading, 
    error: analysisError,
    refreshAnalysis
  } = useMarketAnalysis(filters);

  const { 
    insights, 
    loading: insightsLoading, 
    error: insightsError,
    refreshInsights
  } = useMarketInsights({
    location: filters.location,
    propertyType: filters.propertyType
  });

  const { 
    opportunities, 
    loading: opportunitiesLoading, 
    error: opportunitiesError,
    refreshOpportunities
  } = useMarketOpportunities({
    location: filters.location,
    propertyType: filters.propertyType
  });

  const { 
    report, 
    loading: reportLoading, 
    error: reportError,
    generateReport,
    refreshReport
  } = useMarketReport();

  const handleFilterChange = (newFilters: Partial<MarketAnalysisRequest>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport(filters);
      setActiveTab('report');
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'trends', label: 'Trends', count: analysis?.trends.length || 0 },
    { id: 'insights', label: 'Insights', count: insights.length },
    { id: 'opportunities', label: 'Opportunities', count: opportunities.length },
    { id: 'report', label: 'Report', count: report ? 1 : 0 }
  ] as const;

  return (
    <div className={`market-analysis-dashboard ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Analysis Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Advanced market insights and trends for {filters.location}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshAnalysis}
            disabled={analysisLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {analysisLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {reportLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <MarketFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <MarketOverview
            analysis={analysis}
            loading={analysisLoading}
            error={analysisError}
            onRefresh={refreshAnalysis}
          />
        )}

        {activeTab === 'trends' && (
          <MarketTrends
            trends={analysis?.trends || []}
            loading={analysisLoading}
            error={analysisError}
            onRefresh={refreshAnalysis}
          />
        )}

        {activeTab === 'insights' && (
          <MarketInsights
            insights={insights}
            loading={insightsLoading}
            error={insightsError}
            onRefresh={refreshInsights}
          />
        )}

        {activeTab === 'opportunities' && (
          <InvestmentOpportunities
            opportunities={opportunities}
            loading={opportunitiesLoading}
            error={opportunitiesError}
            onRefresh={refreshOpportunities}
          />
        )}

        {activeTab === 'report' && (
          <MarketReport
            report={report}
            loading={reportLoading}
            error={reportError}
            onRefresh={refreshReport}
            onGenerate={handleGenerateReport}
          />
        )}
      </div>
    </div>
  );
};
