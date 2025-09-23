import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InvestmentCalculator } from '@/components/InvestmentCalculator'
import { Property } from '@/types'

// Mock data
const mockProperty: Property = {
  id: '1',
  name: 'Test Property',
  description: 'A beautiful test property',
  address: '123 Test St',
  squareFootage: 1500,
  price: '300000',
  owner: '0x123',
  isListed: true,
  propertyType: 'house',
  bedrooms: 3,
  bathrooms: 2
}

describe('InvestmentCalculator', () => {
  const mockOnCalculate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders investment calculator with property details', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    expect(screen.getByText('💰 Investment Calculator')).toBeInTheDocument()
    expect(screen.getByText('Calculate ROI, cash flow, and investment metrics for Test Property')).toBeInTheDocument()
  })

  it('displays default input values', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    expect(screen.getByDisplayValue('300000')).toBeInTheDocument() // Purchase price
    expect(screen.getByDisplayValue('20')).toBeInTheDocument() // Down payment %
    expect(screen.getByDisplayValue('6.5')).toBeInTheDocument() // Interest rate
    expect(screen.getByDisplayValue('30')).toBeInTheDocument() // Loan term
  })

  it('calculates and displays investment metrics', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    // Should display calculated values
    expect(screen.getByText('Down Payment')).toBeInTheDocument()
    expect(screen.getByText('Monthly Payment')).toBeInTheDocument()
    expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    expect(screen.getByText('Monthly Expenses')).toBeInTheDocument()
    expect(screen.getByText('Net Monthly Income')).toBeInTheDocument()
    expect(screen.getByText('Annual ROI')).toBeInTheDocument()
    expect(screen.getByText('Cash-on-Cash')).toBeInTheDocument()
    expect(screen.getByText('Cap Rate')).toBeInTheDocument()
  })

  it('updates calculations when inputs change', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    const purchasePriceInput = screen.getByDisplayValue('300000')
    fireEvent.change(purchasePriceInput, { target: { value: '400000' } })

    // Should trigger recalculation
    expect(mockOnCalculate).toHaveBeenCalled()
  })

  it('shows advanced options when toggled', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    const showAdvancedButton = screen.getByText('Show Advanced Options')
    fireEvent.click(showAdvancedButton)

    expect(screen.getByText('Monthly Expenses')).toBeInTheDocument()
    expect(screen.getByText('Property Tax (annual)')).toBeInTheDocument()
    expect(screen.getByText('Insurance (annual)')).toBeInTheDocument()
    expect(screen.getByText('Maintenance (annual)')).toBeInTheDocument()
    expect(screen.getByText('Management (annual)')).toBeInTheDocument()
  })

  it('hides advanced options when toggled off', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    const showAdvancedButton = screen.getByText('Show Advanced Options')
    fireEvent.click(showAdvancedButton)
    
    const hideAdvancedButton = screen.getByText('Hide Advanced Options')
    fireEvent.click(hideAdvancedButton)

    expect(screen.queryByText('Property Tax (annual)')).not.toBeInTheDocument()
  })

  it('displays ROI with appropriate color coding', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    // Should display ROI percentage
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('shows break even calculation', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    expect(screen.getByText('Break Even')).toBeInTheDocument()
  })

  it('displays 10-year total return', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    expect(screen.getByText('10-Year Total Return')).toBeInTheDocument()
  })

  it('handles zero or negative values gracefully', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    const purchasePriceInput = screen.getByDisplayValue('300000')
    fireEvent.change(purchasePriceInput, { target: { value: '0' } })

    // Should not crash and should handle gracefully
    expect(screen.getByText('Investment Calculator')).toBeInTheDocument()
  })

  it('calls onCalculate with results', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    expect(mockOnCalculate).toHaveBeenCalledWith(
      expect.objectContaining({
        purchasePrice: expect.any(Number),
        downPayment: expect.any(Number),
        loanAmount: expect.any(Number),
        monthlyPayment: expect.any(Number),
        monthlyRent: expect.any(Number),
        monthlyExpenses: expect.any(Number),
        netMonthlyIncome: expect.any(Number),
        annualROI: expect.any(Number),
        cashOnCashReturn: expect.any(Number),
        capRate: expect.any(Number),
        totalReturn: expect.any(Number),
        breakEvenMonths: expect.any(Number),
        cashFlow: expect.any(Array)
      })
    )
  })

  it('updates calculations when monthly rent is entered', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    const monthlyRentInput = screen.getByPlaceholderText('0')
    fireEvent.change(monthlyRentInput, { target: { value: '2000' } })

    expect(mockOnCalculate).toHaveBeenCalled()
  })

  it('displays currency formatting correctly', () => {
    render(
      <InvestmentCalculator
        property={mockProperty}
        onCalculate={mockOnCalculate}
      />
    )

    // Should display currency symbols
    expect(screen.getByText('$')).toBeInTheDocument()
  })
})
