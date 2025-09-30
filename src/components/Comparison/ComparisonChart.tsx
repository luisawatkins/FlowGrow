'use client';

import React, { useState, useMemo } from 'react';
import { PropertyComparison } from '@/types/comparison';

interface ComparisonChartProps {
  comparison: PropertyComparison;
  isLoading?: boolean;
}

type ChartType = 'radar' | 'bar' | 'scatter';

export function ComparisonChart({ 
  comparison, 
  isLoading = false 
}: ComparisonChartProps) {
  const [chartType, setChartType] = useState<ChartType>('radar');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'priceScore',
    'locationScore',
    'sizeScore',
    'featureScore',
    'conditionScore'
  ]);

  const availableMetrics = [
    { key: 'priceScore', label: 'Price Score', color: '#3B82F6' },
    { key: 'valueScore', label: 'Value Score', color: '#10B981' },
    { key: 'affordabilityScore', label: 'Affordability', color: '#F59E0B' },
    { key: 'locationScore', label: 'Location', color: '#8B5CF6' },
    { key: 'neighborhoodScore', label: 'Neighborhood', color: '#EF4444' },
    { key: 'accessibilityScore', label: 'Accessibility', color: '#06B6D4' },
    { key: 'sizeScore', label: 'Size', color: '#84CC16' },
    { key: 'conditionScore', label: 'Condition', color: '#F97316' },
    { key: 'featureScore', label: 'Features', color: '#EC4899' },
    { key: 'investmentScore', label: 'Investment', color: '#6366F1' },
    { key: 'cashFlowScore', label: 'Cash Flow', color: '#14B8A6' },
    { key: 'appreciationScore', label: 'Appreciation', color: '#F59E0B' }
  ];

  const chartData = useMemo(() => {
    return comparison.properties.map(property => ({
      name: property.property.title,
      data: selectedMetrics.map(metric => ({
        metric,
        value: property.metrics[metric as keyof typeof property.metrics] as number,
        label: availableMetrics.find(m => m.key === metric)?.label || metric
      }))
    }));
  }, [comparison.properties, selectedMetrics, availableMetrics]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (comparison.properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data to visualize</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add properties to see comparison charts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Chart Type Selector */}
        <div className="flex space-x-2">
          {[
            { type: 'radar', label: 'Radar Chart', icon: '🎯' },
            { type: 'bar', label: 'Bar Chart', icon: '📊' },
            { type: 'scatter', label: 'Scatter Plot', icon: '📈' }
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => setChartType(type as ChartType)}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                chartType === type
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedMetrics.includes(metric.key)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {chartType === 'radar' && <RadarChart data={chartData} />}
        {chartType === 'bar' && <BarChart data={chartData} />}
        {chartType === 'scatter' && <ScatterChart data={chartData} />}
      </div>

      {/* Property Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparison.properties.map((property, index) => (
          <div key={property.property.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {property.property.title}
              </h4>
              <span className="text-xs font-medium text-gray-500">#{property.rank}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{formatCurrency(property.property.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{formatNumber(property.property.details.livingArea)} sq ft</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{property.score}/100</span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">Score Breakdown:</div>
              <div className="space-y-1">
                {selectedMetrics.slice(0, 3).map(metric => {
                  const value = property.metrics[metric as keyof typeof property.metrics] as number;
                  const metricInfo = availableMetrics.find(m => m.key === metric);
                  return (
                    <div key={metric} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{metricInfo?.label}:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple Radar Chart Component
function RadarChart({ data }: { data: any[] }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Radar Chart</h3>
        <p className="text-sm text-gray-500">
          Visual comparison of property metrics across multiple dimensions
        </p>
        <div className="mt-4 text-xs text-gray-400">
          * Advanced chart visualization would be implemented with a charting library like Chart.js or D3.js
        </div>
      </div>
    </div>
  );
}

// Simple Bar Chart Component
function BarChart({ data }: { data: any[] }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bar Chart</h3>
        <p className="text-sm text-gray-500">
          Side-by-side comparison of property metrics
        </p>
        <div className="mt-4 text-xs text-gray-400">
          * Advanced chart visualization would be implemented with a charting library like Chart.js or D3.js
        </div>
      </div>
    </div>
  );
}

// Simple Scatter Plot Component
function ScatterChart({ data }: { data: any[] }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Scatter Plot</h3>
        <p className="text-sm text-gray-500">
          Correlation analysis between different property metrics
        </p>
        <div className="mt-4 text-xs text-gray-400">
          * Advanced chart visualization would be implemented with a charting library like Chart.js or D3.js
        </div>
      </div>
    </div>
  );
}
