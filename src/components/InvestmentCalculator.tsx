'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Property } from '@/types'

interface InvestmentCalculatorProps {
  property: Property
  onCalculate: (results: InvestmentResults) => void
  className?: string
}

interface InvestmentResults {
  purchasePrice: number
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  monthlyRent: number
  monthlyExpenses: number
  netMonthlyIncome: number
  annualROI: number
  cashOnCashReturn: number
  capRate: number
  totalReturn: number
  breakEvenMonths: number
  cashFlow: CashFlowProjection[]
}

interface CashFlowProjection {
  year: number
  monthlyRent: number
  monthlyExpenses: number
  netMonthlyIncome: number
  annualIncome: number
  propertyValue: number
  totalReturn: number
}

export function InvestmentCalculator({ property, onCalculate, className = '' }: InvestmentCalculatorProps) {
  const [inputs, setInputs] = useState({
    purchasePrice: parseFloat(property.price) || 0,
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTerm: 30,
    monthlyRent: 0,
    propertyTax: 0,
    insurance: 0,
    maintenance: 0,
    management: 0,
    vacancy: 5,
    appreciation: 3,
    rentIncrease: 2
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const results = useMemo((): InvestmentResults => {
    const purchasePrice = inputs.purchasePrice
    const downPayment = (purchasePrice * inputs.downPaymentPercent) / 100
    const loanAmount = purchasePrice - downPayment
    const monthlyRate = inputs.interestRate / 100 / 12
    const numPayments = inputs.loanTerm * 12

    // Calculate monthly mortgage payment
    const monthlyPayment = loanAmount > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0

    // Calculate monthly expenses
    const monthlyExpenses = 
      monthlyPayment +
      (inputs.propertyTax / 12) +
      (inputs.insurance / 12) +
      (inputs.maintenance / 12) +
      (inputs.management / 12) +
      (inputs.monthlyRent * inputs.vacancy / 100)

    const netMonthlyIncome = inputs.monthlyRent - monthlyExpenses
    const annualROI = (netMonthlyIncome * 12) / purchasePrice * 100
    const cashOnCashReturn = (netMonthlyIncome * 12) / downPayment * 100
    const capRate = (netMonthlyIncome * 12) / purchasePrice * 100

    // Calculate cash flow projections
    const cashFlow: CashFlowProjection[] = []
    let currentRent = inputs.monthlyRent
    let currentValue = purchasePrice

    for (let year = 1; year <= 10; year++) {
      currentRent *= (1 + inputs.rentIncrease / 100)
      currentValue *= (1 + inputs.appreciation / 100)
      
      const yearExpenses = monthlyExpenses * 12
      const yearIncome = currentRent * 12
      const yearNetIncome = yearIncome - yearExpenses
      const totalReturn = (currentValue - purchasePrice) + (yearNetIncome * year)

      cashFlow.push({
        year,
        monthlyRent: currentRent,
        monthlyExpenses,
        netMonthlyIncome: yearNetIncome / 12,
        annualIncome: yearNetIncome,
        propertyValue: currentValue,
        totalReturn
      })
    }

    const totalReturn = cashFlow[cashFlow.length - 1]?.totalReturn || 0
    const breakEvenMonths = netMonthlyIncome > 0 ? downPayment / netMonthlyIncome : 0

    return {
      purchasePrice,
      downPayment,
      loanAmount,
      monthlyPayment,
      monthlyRent: inputs.monthlyRent,
      monthlyExpenses,
      netMonthlyIncome,
      annualROI,
      cashOnCashReturn,
      capRate,
      totalReturn,
      breakEvenMonths,
      cashFlow
    }
  }, [inputs])

  useEffect(() => {
    onCalculate(results)
  }, [results, onCalculate])

  const handleInputChange = (field: string, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }))
  }

  const getROIColor = (roi: number) => {
    if (roi > 10) return 'text-green-600'
    if (roi > 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💰 Investment Calculator
        </CardTitle>
        <CardDescription>
          Calculate ROI, cash flow, and investment metrics for {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Investment Parameters</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <Input
                  type="number"
                  value={inputs.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment (%)
                </label>
                <Input
                  type="number"
                  value={inputs.downPaymentPercent}
                  onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                  placeholder="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  placeholder="6.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (years)
                </label>
                <Input
                  type="number"
                  value={inputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent
              </label>
              <Input
                type="number"
                value={inputs.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                placeholder="0"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Monthly Expenses</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Tax (annual)
                    </label>
                    <Input
                      type="number"
                      value={inputs.propertyTax}
                      onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance (annual)
                    </label>
                    <Input
                      type="number"
                      value={inputs.insurance}
                      onChange={(e) => handleInputChange('insurance', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance (annual)
                    </label>
                    <Input
                      type="number"
                      value={inputs.maintenance}
                      onChange={(e) => handleInputChange('maintenance', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Management (annual)
                    </label>
                    <Input
                      type="number"
                      value={inputs.management}
                      onChange={(e) => handleInputChange('management', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vacancy Rate (%)
                    </label>
                    <Input
                      type="number"
                      value={inputs.vacancy}
                      onChange={(e) => handleInputChange('vacancy', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appreciation (%)
                    </label>
                    <Input
                      type="number"
                      value={inputs.appreciation}
                      onChange={(e) => handleInputChange('appreciation', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rent Increase (%)
                  </label>
                  <Input
                    type="number"
                    value={inputs.rentIncrease}
                    onChange={(e) => handleInputChange('rentIncrease', e.target.value)}
                    placeholder="2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Investment Analysis</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Down Payment</div>
                <div className="text-lg font-bold text-blue-800">
                  {formatCurrency(results.downPayment)}
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Monthly Payment</div>
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(results.monthlyPayment)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Monthly Rent</div>
                <div className="text-lg font-bold text-purple-800">
                  {formatCurrency(results.monthlyRent)}
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Monthly Expenses</div>
                <div className="text-lg font-bold text-orange-800">
                  {formatCurrency(results.monthlyExpenses)}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${results.netMonthlyIncome > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-sm font-medium ${results.netMonthlyIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Net Monthly Income
              </div>
              <div className={`text-2xl font-bold ${results.netMonthlyIncome > 0 ? 'text-green-800' : 'text-red-800'}`}>
                {formatCurrency(results.netMonthlyIncome)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Annual ROI</div>
                <div className={`text-lg font-bold ${getROIColor(results.annualROI)}`}>
                  {results.annualROI.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <div className="text-sm text-indigo-600 font-medium">Cash-on-Cash</div>
                <div className={`text-lg font-bold ${getROIColor(results.cashOnCashReturn)}`}>
                  {results.cashOnCashReturn.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <div className="text-sm text-teal-600 font-medium">Cap Rate</div>
                <div className={`text-lg font-bold ${getROIColor(results.capRate)}`}>
                  {results.capRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="text-sm text-pink-600 font-medium">Break Even</div>
                <div className="text-lg font-bold text-pink-800">
                  {results.breakEvenMonths > 0 ? `${Math.round(results.breakEvenMonths)} months` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 font-medium">10-Year Total Return</div>
              <div className="text-xl font-bold text-gray-800">
                {formatCurrency(results.totalReturn)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
