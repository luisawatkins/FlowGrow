import React, { useState, useEffect } from 'react';
import { MortgageCalculatorService } from '@/lib/mortgageCalculator';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface MortgageCalculatorProps {
  onCalculationComplete?: (result: any) => void;
  showAmortizationSchedule?: boolean;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  onCalculationComplete,
  showAmortizationSchedule = true
}) => {
  const [inputs, setInputs] = useState({
    propertyValue: '',
    downPayment: '',
    loanAmount: '',
    interestRate: '',
    loanTerm: '30',
    propertyTax: '',
    insurance: '',
    pmi: '',
    hoa: ''
  });

  const [calculation, setCalculation] = useState<any>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'detailed'>('basic');

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateMortgage = () => {
    const propertyValue = parseFloat(inputs.propertyValue) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const loanAmount = parseFloat(inputs.loanAmount) || (propertyValue - downPayment);
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const loanTerm = parseInt(inputs.loanTerm) || 30;
    const propertyTax = parseFloat(inputs.propertyTax) || 0;
    const insurance = parseFloat(inputs.insurance) || 0;
    const pmi = parseFloat(inputs.pmi) || 0;
    const hoa = parseFloat(inputs.hoa) || 0;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      alert('Please enter valid loan amount, interest rate, and loan term');
      return;
    }

    const result = MortgageCalculatorService.calculateCompleteMortgage(
      loanAmount,
      interestRate,
      loanTerm,
      downPayment,
      propertyValue,
      propertyTax * 12, // Convert to annual
      insurance * 12,   // Convert to annual
      pmi * 12,        // Convert to annual
      hoa * 12         // Convert to annual
    );

    setCalculation(result);
    onCalculationComplete?.(result);
  };

  const formatCurrency = (amount: number) => {
    return MortgageCalculatorService.formatCurrency(amount);
  };

  const formatPercentage = (rate: number) => {
    return MortgageCalculatorService.formatPercentage(rate);
  };

  // Auto-calculate loan amount when property value or down payment changes
  useEffect(() => {
    const propertyValue = parseFloat(inputs.propertyValue) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    if (propertyValue > 0 && downPayment >= 0) {
      const loanAmount = propertyValue - downPayment;
      setInputs(prev => ({
        ...prev,
        loanAmount: loanAmount.toString()
      }));
    }
  }, [inputs.propertyValue, inputs.downPayment]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mortgage Calculator</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('basic')}
            variant={activeTab === 'basic' ? 'default' : 'outline'}
            size="sm"
          >
            Basic
          </Button>
          <Button
            onClick={() => setActiveTab('detailed')}
            variant={activeTab === 'detailed' ? 'default' : 'outline'}
            size="sm"
          >
            Detailed
          </Button>
        </div>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Property Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Value
            </label>
            <Input
              type="number"
              placeholder="500000"
              value={inputs.propertyValue}
              onChange={(e) => handleInputChange('propertyValue', e.target.value)}
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <Input
              type="number"
              placeholder="100000"
              value={inputs.downPayment}
              onChange={(e) => handleInputChange('downPayment', e.target.value)}
            />
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount
            </label>
            <Input
              type="number"
              placeholder="400000"
              value={inputs.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="4.5"
              value={inputs.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (years)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            >
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>

          {/* Calculate Button */}
          <div className="flex items-end">
            <Button
              onClick={calculateMortgage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Calculate
            </Button>
          </div>
        </div>

        {/* Detailed Inputs */}
        {activeTab === 'detailed' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Tax (monthly)
                </label>
                <Input
                  type="number"
                  placeholder="500"
                  value={inputs.propertyTax}
                  onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance (monthly)
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  value={inputs.insurance}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PMI (monthly)
                </label>
                <Input
                  type="number"
                  placeholder="200"
                  value={inputs.pmi}
                  onChange={(e) => handleInputChange('pmi', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HOA (monthly)
                </label>
                <Input
                  type="number"
                  placeholder="150"
                  value={inputs.hoa}
                  onChange={(e) => handleInputChange('hoa', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {calculation && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(calculation.monthlyPayment)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Interest</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(calculation.totalInterest)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Cost</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(calculation.totalCost)}
                  </p>
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
                  <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPercentage(calculation.interestRate)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Principal & Interest:</span>
                  <span className="font-medium">
                    {formatCurrency(calculation.monthlyPayment - calculation.propertyTax - calculation.insurance - calculation.pmi - calculation.hoa)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Property Tax:</span>
                  <span className="font-medium">{formatCurrency(calculation.propertyTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Insurance:</span>
                  <span className="font-medium">{formatCurrency(calculation.insurance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">PMI:</span>
                  <span className="font-medium">{formatCurrency(calculation.pmi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">HOA:</span>
                  <span className="font-medium">{formatCurrency(calculation.hoa)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-t pt-3">
                  <span className="text-sm font-medium text-gray-900">Total Monthly Payment:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(calculation.monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Amount:</span>
                  <span className="font-medium">{formatCurrency(calculation.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Down Payment:</span>
                  <span className="font-medium">{formatCurrency(calculation.downPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Term:</span>
                  <span className="font-medium">{calculation.loanTerm} years</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Amortization Schedule */}
          {showAmortizationSchedule && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Amortization Schedule</h3>
                <Button
                  onClick={() => setShowSchedule(!showSchedule)}
                  variant="outline"
                  size="sm"
                >
                  {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
                </Button>
              </div>

              {showSchedule && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {calculation.amortizationSchedule.slice(0, 12).map((entry: any) => (
                        <tr key={entry.paymentNumber}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.paymentNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(entry.paymentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(entry.principalPayment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(entry.interestPayment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(entry.totalPayment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(entry.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {calculation.amortizationSchedule.length > 12 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        Showing first 12 payments of {calculation.amortizationSchedule.length} total payments
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
