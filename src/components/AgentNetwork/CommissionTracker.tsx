import React, { useState, useEffect } from 'react';
import { Commission } from '@/types/agent';
import { CommissionCalculator } from '@/lib/commissionCalculator';
import { useAgent } from '@/hooks/useAgent';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CommissionTrackerProps {
  agentId: string;
}

export const CommissionTracker: React.FC<CommissionTrackerProps> = ({ agentId }) => {
  const { commissions, commissionLoading, loadCommissions } = useAgent();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    salePrice: '',
    commissionRate: '2.5',
    agentSplit: '70'
  });

  useEffect(() => {
    if (agentId) {
      loadCommissions(agentId);
    }
  }, [agentId, loadCommissions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCommission = () => {
    const salePrice = parseFloat(calculatorInputs.salePrice);
    const commissionRate = parseFloat(calculatorInputs.commissionRate);
    const agentSplit = parseFloat(calculatorInputs.agentSplit) / 100;

    if (salePrice && commissionRate && agentSplit) {
      return CommissionCalculator.calculateCommission(salePrice, commissionRate, agentSplit);
    }
    return null;
  };

  const commissionCalculation = calculateCommission();

  const summary = CommissionCalculator.calculateCommissionSummary(commissions);

  if (commissionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Commission Tracker</h2>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            onClick={() => setShowCalculator(!showCalculator)}
            variant="outline"
          >
            {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </Button>
        </div>
      </div>

      {/* Commission Calculator */}
      {showCalculator && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price
              </label>
              <Input
                type="number"
                placeholder="500000"
                value={calculatorInputs.salePrice}
                onChange={(e) => setCalculatorInputs(prev => ({
                  ...prev,
                  salePrice: e.target.value
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="2.5"
                value={calculatorInputs.commissionRate}
                onChange={(e) => setCalculatorInputs(prev => ({
                  ...prev,
                  commissionRate: e.target.value
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Split (%)
              </label>
              <Input
                type="number"
                placeholder="70"
                value={calculatorInputs.agentSplit}
                onChange={(e) => setCalculatorInputs(prev => ({
                  ...prev,
                  agentSplit: e.target.value
                }))}
              />
            </div>
          </div>

          {commissionCalculation && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Commission Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sale Price:</span>
                    <span className="font-medium">{formatCurrency(commissionCalculation.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission Rate:</span>
                    <span className="font-medium">{commissionCalculation.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Commission:</span>
                    <span className="font-medium">{formatCurrency(commissionCalculation.commissionAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Agent Split:</span>
                    <span className="font-medium">{formatCurrency(commissionCalculation.agentAmount)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Brokerage Split:</span>
                    <span className="font-medium">{formatCurrency(commissionCalculation.brokerageAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxes (25%):</span>
                    <span className="font-medium text-red-600">-{formatCurrency(commissionCalculation.taxes)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-900">Net Commission:</span>
                    <span className="font-bold text-green-600">{formatCurrency(commissionCalculation.netAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Commission</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.totalCommission)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Commission</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.averageCommission)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{summary.totalTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Best Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary.topMonths.length > 0 ? formatCurrency(summary.topMonths[0].amount) : '$0'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commission History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Commission History</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedPeriod('month')}
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
            >
              Month
            </Button>
            <Button
              onClick={() => setSelectedPeriod('quarter')}
              variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
              size="sm"
            >
              Quarter
            </Button>
            <Button
              onClick={() => setSelectedPeriod('year')}
              variant={selectedPeriod === 'year' ? 'default' : 'outline'}
              size="sm"
            >
              Year
            </Button>
          </div>
        </div>

        {commissions.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No commissions yet</h3>
            <p className="text-gray-500">Your commission history will appear here once you start closing deals.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Property #{commission.propertyId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {commission.notes}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(commission.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {commission.percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                        {commission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(commission.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {commission.paidDate ? formatDate(commission.paidDate) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
