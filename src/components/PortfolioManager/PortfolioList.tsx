'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { Portfolio } from '@/types/portfolio';
import { usePortfolio } from '@/hooks/usePortfolio';

interface PortfolioListProps {
  portfolios: Portfolio[];
  onSelectPortfolio: (portfolio: Portfolio) => void;
  onCreatePortfolio: () => void;
  onEditPortfolio: (portfolio: Portfolio) => void;
  onDeletePortfolio: (portfolio: Portfolio) => void;
  className?: string;
}

const PortfolioList: React.FC<PortfolioListProps> = ({
  portfolios,
  onSelectPortfolio,
  onCreatePortfolio,
  onEditPortfolio,
  onDeletePortfolio,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'return' | 'risk' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

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

  const getRiskLevel = (riskScore: number) => {
    if (riskScore < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (riskScore < 0.6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (riskScore < 0.8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Filter and sort portfolios
  const filteredAndSortedPortfolios = portfolios
    .filter(portfolio => {
      const matchesSearch = portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           portfolio.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const riskLevel = getRiskLevel(portfolio.riskScore).level.toLowerCase();
      const matchesRisk = filterRisk === 'all' || riskLevel === filterRisk;
      
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'value':
          aValue = a.totalValue;
          bValue = b.totalValue;
          break;
        case 'return':
          aValue = a.totalReturnPercentage;
          bValue = b.totalReturnPercentage;
          break;
        case 'risk':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        case 'created':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Portfolios</h2>
            <p className="text-gray-600">Manage your property investment portfolios</p>
          </div>
          
          <button
            onClick={onCreatePortfolio}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Portfolio
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="value-desc">Highest Value</option>
              <option value="value-asc">Lowest Value</option>
              <option value="return-desc">Best Return</option>
              <option value="return-asc">Worst Return</option>
              <option value="risk-asc">Lowest Risk</option>
              <option value="risk-desc">Highest Risk</option>
              <option value="created-desc">Newest</option>
              <option value="created-asc">Oldest</option>
            </select>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio List */}
      <div className="p-6">
        {filteredAndSortedPortfolios.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterRisk !== 'all' ? 'No portfolios found' : 'No portfolios yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterRisk !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first portfolio to start managing your property investments'
              }
            </p>
            {!searchQuery && filterRisk === 'all' && (
              <button
                onClick={onCreatePortfolio}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Portfolio
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredAndSortedPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                viewMode={viewMode}
                onSelect={() => onSelectPortfolio(portfolio)}
                onEdit={() => onEditPortfolio(portfolio)}
                onDelete={() => onDeletePortfolio(portfolio)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Portfolio Card Component
const PortfolioCard: React.FC<{
  portfolio: Portfolio;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ portfolio, viewMode, onSelect, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

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

  const getRiskLevel = (riskScore: number) => {
    if (riskScore < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (riskScore < 0.6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (riskScore < 0.8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskLevel = getRiskLevel(portfolio.riskScore);

  if (viewMode === 'list') {
    return (
      <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex-1 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
            <p className="text-sm text-gray-600">
              {portfolio.properties.length} properties • {formatCurrency(portfolio.totalValue)}
            </p>
          </div>
          
          <div className="text-right">
            <div className={`font-semibold ${getPerformanceColor(portfolio.totalReturnPercentage)}`}>
              {formatPercentage(portfolio.totalReturnPercentage)}
            </div>
            <div className="text-sm text-gray-600">
              {formatCurrency(portfolio.totalReturn)}
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${riskLevel.bg} ${riskLevel.color}`}>
            {riskLevel.level}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { onSelect(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Portfolio
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Portfolio
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
            <p className="text-sm text-gray-600">
              {portfolio.properties.length} properties
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { onSelect(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Portfolio
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Portfolio
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Value</span>
          <span className="font-semibold text-gray-900">{formatCurrency(portfolio.totalValue)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Return</span>
          <div className="text-right">
            <div className={`font-semibold ${getPerformanceColor(portfolio.totalReturnPercentage)}`}>
              {formatPercentage(portfolio.totalReturnPercentage)}
            </div>
            <div className="text-xs text-gray-600">
              {formatCurrency(portfolio.totalReturn)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Risk Level</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskLevel.bg} ${riskLevel.color}`}>
            {riskLevel.level}
          </span>
        </div>
      </div>
      
      <button
        onClick={onSelect}
        className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Portfolio
      </button>
    </div>
  );
};

export default PortfolioList;
