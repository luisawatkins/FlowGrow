import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface MortgageCalculationRequest {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax?: number;
  homeInsurance?: number;
  pmi?: number;
  hoa?: number;
}

interface MortgagePayment {
  principal: number;
  interest: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoa: number;
  total: number;
}

interface AmortizationSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: MortgageCalculationRequest = await request.json();

    // Validate required fields
    const requiredFields = ['propertyPrice', 'downPayment', 'interestRate', 'loanTerm'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate loan amount
    const loanAmount = data.propertyPrice - data.downPayment;
    const monthlyInterestRate = (data.interestRate / 100) / 12;
    const numberOfPayments = data.loanTerm * 12;

    // Calculate monthly mortgage payment (P&I)
    const monthlyPayment =
      (loanAmount *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate additional costs
    const monthlyPropertyTax = (data.propertyTax || 0) / 12;
    const monthlyHomeInsurance = (data.homeInsurance || 0) / 12;
    const monthlyPMI = (data.pmi || 0) / 12;
    const monthlyHOA = (data.hoa || 0) / 12;

    // Calculate total monthly payment
    const payment: MortgagePayment = {
      principal: monthlyPayment - (loanAmount * monthlyInterestRate),
      interest: loanAmount * monthlyInterestRate,
      propertyTax: monthlyPropertyTax,
      homeInsurance: monthlyHomeInsurance,
      pmi: monthlyPMI,
      hoa: monthlyHOA,
      total:
        monthlyPayment +
        monthlyPropertyTax +
        monthlyHomeInsurance +
        monthlyPMI +
        monthlyHOA,
    };

    // Generate amortization schedule
    const schedule: AmortizationSchedule[] = [];
    let balance = loanAmount;
    let month = 1;

    while (month <= numberOfPayments && balance > 0) {
      const interest = balance * monthlyInterestRate;
      const principal = monthlyPayment - interest;
      balance = balance - principal;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        balance: Math.max(0, balance),
      });

      month++;
    }

    return NextResponse.json({
      payment,
      schedule,
      summary: {
        totalPayments: numberOfPayments,
        totalInterest: schedule.reduce((sum, month) => sum + month.interest, 0),
        totalCost:
          data.downPayment +
          schedule.reduce(
            (sum, month) => sum + month.payment,
            0
          ) +
          (data.propertyTax || 0) * data.loanTerm +
          (data.homeInsurance || 0) * data.loanTerm +
          (data.pmi || 0) * data.loanTerm +
          (data.hoa || 0) * data.loanTerm,
      },
    });
  } catch (error) {
    console.error('Error calculating mortgage:', error);
    return NextResponse.json(
      { error: 'Failed to calculate mortgage' },
      { status: 500 }
    );
  }
}