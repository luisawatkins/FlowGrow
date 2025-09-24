'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  AlertTriangle,
  Target,
  RefreshCw,
  Download,
  Settings,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { Portfolio, PortfolioProperty } from '@/types/portfolio';
import { usePortfolio } from '@/hooks/usePortfolio';

interface PortfolioDashboardProps {
  portfolio: Portfolio;
  onEdit?: () => void;
  onAddProperty?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  portfolio,
  onEdit,
  onAddProperty,
  onViewDetails,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { calculatePerformance, analyzeRisk } = usePortfolio();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (riskScore < 0.6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (riskScore < 0.8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await calculatePerformance(portfolio.id);
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh portfolio:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const riskLevel = getRiskLevel(portfolio.riskScore);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{portfolio.name}</h2>
              <p className="text-sm text-gray-600">
                {portfolio.properties.length} properties • Created {new Date(portfolio.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Value */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(portfolio.totalValue)}
            </div>
            <div className="text-sm text-blue-700">
              {formatCurrency(portfolio.totalInvestment)} invested
            </div>
          </div>

          {/* Total Return */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                {getPerformanceIcon(portfolio.totalReturn)}
              </div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Total Return</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(portfolio.totalReturn)}`}>
              {formatCurrency(portfolio.totalReturn)}
            </div>
            <div className={`text-sm ${getPerformanceColor(portfolio.totalReturnPercentage)}`}>
              {formatPercentage(portfolio.totalReturnPercentage)}
            </div>
          </div>

          {/* Risk Score */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">Risk Level</span>
            </div>
            <div className={`text-2xl font-bold ${riskLevel.color}`}>
              {riskLevel.level}
            </div>
            <div className="text-sm text-orange-700">
              Score: {(portfolio.riskScore * 100).toFixed(0)}/100
            </div>
          </div>

          {/* Diversification */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Diversification</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {(portfolio.diversificationScore * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-purple-700">
              {portfolio.diversificationScore > 0.7 ? 'Well diversified' : 'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        {showDetails && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Portfolio</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">Benchmark</span>
                </div>
              </div>
            </div>
            
            {/* Placeholder for chart */}
            <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance chart will be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {/* Property Allocation */}
        {showDetails && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Property Allocation</h3>
              <button
                onClick={onAddProperty}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.properties.map((property) => (
                <PropertyCard key={property.propertyId} property={property} />
              ))}
              
              {portfolio.properties.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h4>
                  <p className="text-gray-600 mb-4">Add your first property to start building your portfolio</p>
                  <button
                    onClick={onAddProperty}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Property
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onViewDetails}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="w-4 h-4" />
            <span>Target Return: {portfolio.settings.targetReturn}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard: React.FC<{ property: PortfolioProperty }> = ({ property }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
            {property.property.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">{property.property.location}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(property.currentValue)}
          </div>
          <div className={`text-xs ${getPerformanceColor(property.totalReturnPercentage)}`}>
            {formatPercentage(property.totalReturnPercentage)}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Ownership</span>
          <span className="font-medium">{property.ownershipPercentage.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Purchase Price</span>
          <span className="font-medium">{formatCurrency(property.purchasePrice)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Cap Rate</span>
          <span className="font-medium">{property.capRate.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
