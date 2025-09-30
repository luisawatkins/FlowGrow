// Investment Opportunities Component

'use client';

import React, { useState } from 'react';
import { InvestmentOpportunity, OpportunityType, RiskLevel, TimeHorizon, ImpactLevel } from '@/types/market';

interface InvestmentOpportunitiesProps {
  opportunities: InvestmentOpportunity[];
  loading: boolean;
  error: any;
  onRefresh: () => void;
}

export const InvestmentOpportunities: React.FC<InvestmentOpportunitiesProps> = ({
  opportunities,
  loading,
  error,
  onRefresh
}) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [filterType, setFilterType] = useState<OpportunityType | 'all'>('all');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterTimeHorizon, setFilterTimeHorizon] = useState<TimeHorizon | 'all'>('all');

  const getOpportunityTypeColor = (type: OpportunityType): string => {
    const colors = {
      [OpportunityType.UNDERVALUED]: 'bg-green-100 text-green-800',
      [OpportunityType.GROWTH_POTENTIAL]: 'bg-blue-100 text-blue-800',
      [OpportunityType.RENTAL_INCOME]: 'bg-purple-100 text-purple-800',
      [OpportunityType.DEVELOPMENT]: 'bg-orange-100 text-orange-800',
      [OpportunityType.FLIP_OPPORTUNITY]: 'bg-yellow-100 text-yellow-800',
      [OpportunityType.DISTRESSED_SALE]: 'bg-red-100 text-red-800'
    };
    return colors[type] || colors[OpportunityType.GROWTH_POTENTIAL];
  };

  const getRiskColor = (risk: RiskLevel): string => {
    const colors = {
      [RiskLevel.LOW]: 'bg-green-100 text-green-800',
      [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [RiskLevel.HIGH]: 'bg-orange-100 text-orange-800',
      [RiskLevel.VERY_HIGH]: 'bg-red-100 text-red-800'
    };
    return colors[risk] || colors[RiskLevel.MEDIUM];
  };

  const getImpactColor = (impact: ImpactLevel): string => {
    const colors = {
      [ImpactLevel.LOW]: 'bg-gray-100 text-gray-800',
      [ImpactLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [ImpactLevel.HIGH]: 'bg-orange-100 text-orange-800',
      [ImpactLevel.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[impact] || colors[ImpactLevel.MEDIUM];
  };

  const formatOpportunityType = (type: OpportunityType): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeHorizon = (horizon: TimeHorizon): string => {
    return horizon.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const filteredOpportunities = opportunities.filter(opportunity => {
    if (filterType !== 'all' && opportunity.opportunityType !== filterType) return false;
    if (filterRisk !== 'all' && opportunity.riskLevel !== filterRisk) return false;
    if (filterTimeHorizon !== 'all' && opportunity.timeHorizon !== filterTimeHorizon) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-medium">Failed to load investment opportunities</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
            <button
              onClick={onRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities available</h3>
        <p className="mt-1 text-sm text-gray-500">Investment opportunities will appear here when available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="typeFilter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as OpportunityType | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value={OpportunityType.UNDERVALUED}>Undervalued</option>
              <option value={OpportunityType.GROWTH_POTENTIAL}>Growth Potential</option>
              <option value={OpportunityType.RENTAL_INCOME}>Rental Income</option>
              <option value={OpportunityType.DEVELOPMENT}>Development</option>
              <option value={OpportunityType.FLIP_OPPORTUNITY}>Flip Opportunity</option>
              <option value={OpportunityType.DISTRESSED_SALE}>Distressed Sale</option>
            </select>
          </div>
          <div>
            <label htmlFor="riskFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Level
            </label>
            <select
              id="riskFilter"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value={RiskLevel.LOW}>Low</option>
              <option value={RiskLevel.MEDIUM}>Medium</option>
              <option value={RiskLevel.HIGH}>High</option>
              <option value={RiskLevel.VERY_HIGH}>Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Time Horizon
            </label>
            <select
              id="timeFilter"
              value={filterTimeHorizon}
              onChange={(e) => setFilterTimeHorizon(e.target.value as TimeHorizon | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time Horizons</option>
              <option value={TimeHorizon.SHORT_TERM}>Short Term</option>
              <option value={TimeHorizon.MEDIUM_TERM}>Medium Term</option>
              <option value={TimeHorizon.LONG_TERM}>Long Term</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-right">
          <p className="text-sm text-gray-600">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOpportunityTypeColor(opportunity.opportunityType)}`}>
                    {formatOpportunityType(opportunity.opportunityType)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(opportunity.riskLevel)}`}>
                    {opportunity.riskLevel} risk
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{opportunity.location}</span>
                  <span>•</span>
                  <span>{formatTimeHorizon(opportunity.timeHorizon)}</span>
                  <span>•</span>
                  <span>{formatDate(opportunity.date)}</span>
                </div>
                <p className="text-gray-700 mb-4">{opportunity.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  +{opportunity.potentialReturn.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round(opportunity.confidence * 100)}% confidence
                </div>
              </div>
            </div>

            {/* Opportunity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Potential Return</p>
                <p className="text-xl font-semibold text-green-600">
                  +{opportunity.potentialReturn.toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className={`text-xl font-semibold ${getRiskColor(opportunity.riskLevel)}`}>
                  {opportunity.riskLevel}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Time Horizon</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatTimeHorizon(opportunity.timeHorizon)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedOpportunity(selectedOpportunity?.id === opportunity.id ? null : opportunity)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedOpportunity?.id === opportunity.id ? 'Hide Details' : 'View Details'}
              </button>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                View Property
              </button>
            </div>

            {/* Opportunity Details */}
            {selectedOpportunity?.id === opportunity.id && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Factors */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Factors</h4>
                    <div className="space-y-3">
                      {opportunity.factors.map((factor, index) => (
                        <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{factor.factor}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(factor.impact)}`}>
                              {factor.impact} impact
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Weight</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${factor.weight * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {opportunity.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <p className="text-sm text-blue-800">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
