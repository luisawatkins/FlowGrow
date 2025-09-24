import React, { useState } from 'react';
import { MortgageCalculator } from './MortgageCalculator';
import { LenderNetwork } from './LenderNetwork';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FinancingProps {
  onFinancingComplete?: (data: any) => void;
  showCalculator?: boolean;
  showLenderNetwork?: boolean;
}

export const Financing: React.FC<FinancingProps> = ({
  onFinancingComplete,
  showCalculator = true,
  showLenderNetwork = true
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'lenders' | 'applications'>('calculator');
  const [selectedLender, setSelectedLender] = useState<any>(null);
  const [selectedFinancingOption, setSelectedFinancingOption] = useState<any>(null);
  const [mortgageCalculation, setMortgageCalculation] = useState<any>(null);

  const handleCalculationComplete = (result: any) => {
    setMortgageCalculation(result);
    onFinancingComplete?.(result);
  };

  const handleLenderSelect = (lender: any) => {
    setSelectedLender(lender);
  };

  const handleFinancingOptionSelect = (option: any) => {
    setSelectedFinancingOption(option);
    onFinancingComplete?.(option);
  };

  const tabs = [
    { id: 'calculator', label: 'Mortgage Calculator', icon: '🧮' },
    { id: 'lenders', label: 'Lender Network', icon: '🏦' },
    { id: 'applications', label: 'Applications', icon: '📋' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Financing</h1>
          <p className="text-gray-600 mt-2">
            Calculate payments, compare lenders, and manage your mortgage applications
          </p>
        </div>
        {(selectedLender || selectedFinancingOption) && (
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => {
                setSelectedLender(null);
                setSelectedFinancingOption(null);
              }}
              variant="outline"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'calculator' && showCalculator && (
        <MortgageCalculator
          onCalculationComplete={handleCalculationComplete}
          showAmortizationSchedule={true}
        />
      )}

      {activeTab === 'lenders' && showLenderNetwork && (
        <LenderNetwork
          onLenderSelect={handleLenderSelect}
          onFinancingOptionSelect={handleFinancingOptionSelect}
          showFinancingOptions={true}
        />
      )}

      {activeTab === 'applications' && (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loan Applications</h3>
            <p className="text-gray-500">Track and manage your mortgage applications in one place.</p>
            <div className="mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Application
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => setActiveTab('calculator')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🧮</span>
            <span>Calculate Payment</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('lenders')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🏦</span>
            <span>Find Lenders</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('applications')}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">📋</span>
            <span>Start Application</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">📊</span>
            <span>Rate Alerts</span>
          </Button>
        </div>
      </Card>

      {/* Features Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Financing Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Mortgage Calculator</h3>
            <p className="text-sm text-gray-600">
              Calculate monthly payments, total interest, and amortization schedules
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Lender Comparison</h3>
            <p className="text-sm text-gray-600">
              Compare rates, fees, and terms from multiple verified lenders
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Application Tracking</h3>
            <p className="text-sm text-gray-600">
              Track your loan application status and required documents
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Pre-qualification</h3>
            <p className="text-sm text-gray-600">
              Get pre-qualified for a mortgage without affecting your credit score
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Rate Alerts</h3>
            <p className="text-sm text-gray-600">
              Get notified when interest rates drop to your target level
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Credit Assessment</h3>
            <p className="text-sm text-gray-600">
              Understand your credit profile and get improvement recommendations
            </p>
          </div>
        </div>
      </Card>

      {/* Selected Options Summary */}
      {(selectedLender || selectedFinancingOption || mortgageCalculation) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Options</h3>
          <div className="space-y-4">
            {mortgageCalculation && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Mortgage Calculation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Monthly Payment</p>
                    <p className="font-semibold text-blue-900">
                      ${mortgageCalculation.monthlyPayment?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Interest Rate</p>
                    <p className="font-semibold text-blue-900">
                      {mortgageCalculation.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Total Interest</p>
                    <p className="font-semibold text-blue-900">
                      ${mortgageCalculation.totalInterest?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">Loan Term</p>
                    <p className="font-semibold text-blue-900">
                      {mortgageCalculation.loanTerm} years
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedFinancingOption && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Selected Financing Option</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Loan Type</p>
                    <p className="font-semibold text-green-900">{selectedFinancingOption.loanType}</p>
                  </div>
                  <div>
                    <p className="text-green-700">Interest Rate</p>
                    <p className="font-semibold text-green-900">{selectedFinancingOption.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-green-700">Monthly Payment</p>
                    <p className="font-semibold text-green-900">
                      ${selectedFinancingOption.monthlyPayment?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700">Closing Costs</p>
                    <p className="font-semibold text-green-900">
                      ${selectedFinancingOption.closingCosts?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedLender && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Selected Lender</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-purple-700">Lender</p>
                    <p className="font-semibold text-purple-900">{selectedLender.name}</p>
                  </div>
                  <div>
                    <p className="text-purple-700">Rating</p>
                    <p className="font-semibold text-purple-900">
                      {selectedLender.rating}/5 ({selectedLender.reviewCount} reviews)
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700">Processing Time</p>
                    <p className="font-semibold text-purple-900">{selectedLender.processingTime}</p>
                  </div>
                  <div>
                    <p className="text-purple-700">Min Credit Score</p>
                    <p className="font-semibold text-purple-900">{selectedLender.minCreditScore}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
