'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Target,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { FinancialModel, ModelInputs, ModelAssumptions, ModelOutputs } from '@/types/portfolio';
import { FinancialModelingEngine } from '@/lib/financialModeling';
import { usePortfolio } from '@/hooks/usePortfolio';

interface FinancialModelingDashboardProps {
  portfolioId?: string;
  className?: string;
}

const FinancialModelingDashboard: React.FC<FinancialModelingDashboardProps> = ({
  portfolioId,
  className = ''
}) => {
  const [models, setModels] = useState<FinancialModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<FinancialModel | null>(null);
  const [showSensitivity, setShowSensitivity] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { calculateModelOutputs } = usePortfolio();

  useEffect(() => {
    loadModels();
  }, [portfolioId]);

  const loadModels = async () => {
    try {
      const storedModels = JSON.parse(localStorage.getItem('flowgrow-models') || '[]');
      const filteredModels = portfolioId 
        ? storedModels.filter((m: FinancialModel) => m.id.includes(portfolioId))
        : storedModels;
      setModels(filteredModels);
      
      if (filteredModels.length > 0 && !selectedModel) {
        setSelectedModel(filteredModels[0]);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
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

  const recalculateModel = async (model: FinancialModel) => {
    setIsCalculating(true);
    try {
      const outputs = calculateModelOutputs(model.inputs, model.assumptions);
      const updatedModel = {
        ...model,
        outputs,
        updatedAt: Date.now()
      };
      
      // Update in localStorage
      const storedModels = JSON.parse(localStorage.getItem('flowgrow-models') || '[]');
      const modelIndex = storedModels.findIndex((m: FinancialModel) => m.id === model.id);
      if (modelIndex >= 0) {
        storedModels[modelIndex] = updatedModel;
        localStorage.setItem('flowgrow-models', JSON.stringify(storedModels));
      }
      
      setModels(prev => prev.map(m => m.id === model.id ? updatedModel : m));
      setSelectedModel(updatedModel);
    } catch (error) {
      console.error('Failed to recalculate model:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  if (!selectedModel) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Financial Models</h3>
          <p className="text-gray-600 mb-6">Create your first financial model to analyze property investments</p>
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 inline mr-2" />
            Create Model
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedModel.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedModel.type.toUpperCase()} Model • Updated {new Date(selectedModel.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSensitivity(!showSensitivity)}
              className={`p-2 rounded-lg transition-colors ${
                showSensitivity ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowScenario(!showScenario)}
              className={`p-2 rounded-lg transition-colors ${
                showScenario ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <PieChart className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => recalculateModel(selectedModel)}
              disabled={isCalculating}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isCalculating ? 'animate-spin' : ''}`} />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* NPV */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">NPV</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(selectedModel.outputs.netPresentValue)}`}>
              {formatCurrency(selectedModel.outputs.netPresentValue)}
            </div>
            <div className="text-sm text-blue-700">
              {selectedModel.outputs.netPresentValue > 0 ? 'Profitable' : 'Unprofitable'}
            </div>
          </div>

          {/* IRR */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                {getPerformanceIcon(selectedModel.outputs.internalRateOfReturn)}
              </div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">IRR</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(selectedModel.outputs.internalRateOfReturn)}`}>
              {formatPercentage(selectedModel.outputs.internalRateOfReturn)}
            </div>
            <div className="text-sm text-green-700">
              Annual return
            </div>
          </div>

          {/* Cash Flow */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Cash Flow</span>
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(selectedModel.outputs.annualCashFlow)}`}>
              {formatCurrency(selectedModel.outputs.annualCashFlow)}
            </div>
            <div className="text-sm text-purple-700">
              Annual cash flow
            </div>
          </div>

          {/* Cap Rate */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">Cap Rate</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {formatPercentage(selectedModel.outputs.capRate)}
            </div>
            <div className="text-sm text-orange-700">
              Capitalization rate
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Investment Metrics */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash on Cash Return</span>
                <span className="font-medium">{formatPercentage(selectedModel.outputs.cashOnCashReturn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Equity Multiple</span>
                <span className="font-medium">{selectedModel.outputs.equityMultiple.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payback Period</span>
                <span className="font-medium">{selectedModel.outputs.paybackPeriod.toFixed(1)} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Rent Multiplier</span>
                <span className="font-medium">{selectedModel.outputs.grossRentMultiplier.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Ratios</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Debt Service Coverage</span>
                <span className="font-medium">{selectedModel.outputs.debtServiceCoverageRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan to Value</span>
                <span className="font-medium">{formatPercentage(selectedModel.outputs.loanToValueRatio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debt Yield</span>
                <span className="font-medium">{formatPercentage(selectedModel.outputs.debtYield)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return on Equity</span>
                <span className="font-medium">{formatPercentage(selectedModel.outputs.returnOnEquity)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        {showSensitivity && selectedModel.sensitivityAnalysis && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensitivity Analysis</h3>
            
            {selectedModel.sensitivityAnalysis.tornadoChart.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Impact of key variables on NPV
                </div>
                
                <div className="space-y-3">
                  {selectedModel.sensitivityAnalysis.tornadoChart.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-600 truncate">
                        {item.variable}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${Math.min(Math.abs(item.negativeImpact) / 10000 * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(Math.abs(item.positiveImpact) / 10000 * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-sm text-gray-600 text-right">
                        {formatCurrency(item.range)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No sensitivity analysis available</p>
                <p className="text-sm text-gray-400">Run sensitivity analysis to see variable impacts</p>
              </div>
            )}
          </div>
        )}

        {/* Scenario Analysis */}
        {showScenario && selectedModel.scenarioAnalysis && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
            
            {selectedModel.scenarioAnalysis.scenarios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedModel.scenarioAnalysis.scenarios.map((scenario, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{scenario.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">NPV</span>
                        <span className={`font-medium ${getPerformanceColor(scenario.keyMetrics.npv)}`}>
                          {formatCurrency(scenario.keyMetrics.npv)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IRR</span>
                        <span className={`font-medium ${getPerformanceColor(scenario.keyMetrics.irr)}`}>
                          {formatPercentage(scenario.keyMetrics.irr)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Probability</span>
                        <span className="font-medium">{(scenario.probability * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No scenario analysis available</p>
                <p className="text-sm text-gray-400">Run scenario analysis to see different outcomes</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
              Create New Model
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Last calculated: {new Date(selectedModel.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialModelingDashboard;
