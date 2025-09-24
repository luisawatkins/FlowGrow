import React, { useState, useEffect } from 'react';
import { Lender, FinancingOption, FinancingSearchFilters } from '@/types/financing';
import { LenderService } from '@/lib/lenderService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LenderNetworkProps {
  onLenderSelect?: (lender: Lender) => void;
  onFinancingOptionSelect?: (option: FinancingOption) => void;
  showFinancingOptions?: boolean;
}

export const LenderNetwork: React.FC<LenderNetworkProps> = ({
  onLenderSelect,
  onFinancingOptionSelect,
  showFinancingOptions = true
}) => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);
  const [filters, setFilters] = useState<FinancingSearchFilters>({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load lenders on component mount
  useEffect(() => {
    loadLenders();
  }, []);

  const loadLenders = async () => {
    try {
      setLoading(true);
      setError(null);
      const lenderList = await LenderService.getLenders();
      setLenders(lenderList);
    } catch (err) {
      setError('Failed to load lenders');
      console.error('Error loading lenders:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchFinancingOptions = async () => {
    if (!filters.loanAmount) {
      alert('Please enter loan amount to search for financing options');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchPerformed(true);
      
      const options = await LenderService.getFinancingOptions(
        filters.loanAmount.max,
        filters.downPayment?.max || 0,
        720, // Mock credit score
        filters.loanAmount.max + (filters.downPayment?.max || 0)
      );
      
      setFinancingOptions(options);
    } catch (err) {
      setError('Failed to search financing options');
      console.error('Error searching financing options:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FinancingSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLenderSelect = (lender: Lender) => {
    setSelectedLender(lender);
    onLenderSelect?.(lender);
  };

  const handleFinancingOptionSelect = (option: FinancingOption) => {
    onFinancingOptionSelect?.(option);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  if (loading && lenders.length === 0) {
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lender Network</h2>
          <p className="text-gray-600 mt-2">
            Connect with verified lenders and compare financing options
          </p>
        </div>
        {selectedLender && (
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => setSelectedLender(null)}
              variant="outline"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Financing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount
            </label>
            <Input
              type="number"
              placeholder="400000"
              value={filters.loanAmount?.max || ''}
              onChange={(e) => handleFilterChange('loanAmount', {
                min: 0,
                max: parseFloat(e.target.value) || 0
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <Input
              type="number"
              placeholder="80000"
              value={filters.downPayment?.max || ''}
              onChange={(e) => handleFilterChange('downPayment', {
                min: 0,
                max: parseFloat(e.target.value) || 0
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Score
            </label>
            <Input
              type="number"
              placeholder="720"
              value={filters.creditScore?.max || ''}
              onChange={(e) => handleFilterChange('creditScore', {
                min: 0,
                max: parseFloat(e.target.value) || 0
              })}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={searchFinancingOptions}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Searching...' : 'Search Options'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {/* Financing Options */}
      {showFinancingOptions && searchPerformed && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Financing Options ({financingOptions.length} found)
            </h3>
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading...
              </div>
            )}
          </div>

          {financingOptions.length === 0 && !loading ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No financing options found</h3>
                <p className="text-gray-500">Try adjusting your search criteria to find more options.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {financingOptions.map((option) => (
                <Card key={option.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {option.loanType}
                        </h4>
                        {option.isRecommended && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Recommended
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPercentage(option.interestRate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Monthly Payment</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(option.monthlyPayment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Cost</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(option.totalCost)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Closing Costs</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(option.closingCosts)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {option.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-6">
                      <Button
                        onClick={() => handleFinancingOptionSelect(option)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Select Option
                      </Button>
                      <Button
                        onClick={() => {
                          const lender = lenders.find(l => l.id === option.lenderId);
                          if (lender) handleLenderSelect(lender);
                        }}
                        variant="outline"
                      >
                        View Lender
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lender Directory */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verified Lenders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lenders.map((lender) => (
            <div
              key={lender.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedLender?.id === lender.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleLenderSelect(lender)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {lender.logo ? (
                    <img
                      src={lender.logo}
                      alt={lender.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {lender.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{lender.name}</h4>
                    {lender.isVerified && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {lender.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {lender.rating} ({lender.reviewCount})
                    </div>
                    <span>•</span>
                    <span>{lender.processingTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {lender.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Lender Details */}
      {selectedLender && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lender Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> {selectedLender.phone}</p>
                <p><strong>Email:</strong> {selectedLender.email}</p>
                <p><strong>Website:</strong> 
                  <a href={selectedLender.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 ml-1">
                    {selectedLender.website}
                  </a>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Loan Requirements</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Min Loan Amount:</strong> {formatCurrency(selectedLender.minLoanAmount)}</p>
                <p><strong>Max Loan Amount:</strong> {formatCurrency(selectedLender.maxLoanAmount)}</p>
                <p><strong>Min Credit Score:</strong> {selectedLender.minCreditScore}</p>
                <p><strong>Max LTV:</strong> {selectedLender.maxLtv}%</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Available Loan Types</h4>
            <div className="flex flex-wrap gap-2">
              {selectedLender.loanTypes.map((loanType, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {loanType.name}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
