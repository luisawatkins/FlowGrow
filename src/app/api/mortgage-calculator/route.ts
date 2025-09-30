import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

export async function POST(request: NextRequest) {
  try {
    const {
      loanAmount,
      interestRate,
      loanTerm,
      propertyTax,
      insurance,
      pmi,
    } = await request.json();

    // Validate inputs
    if (
      typeof loanAmount !== 'number' ||
      typeof interestRate !== 'number' ||
      typeof loanTerm !== 'number' ||
      typeof propertyTax !== 'number' ||
      typeof insurance !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      );
    }

    // Calculate principal and interest payment
    const principalAndInterest = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );

    // Calculate monthly tax and insurance
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPMI = pmi || 0;

    // Calculate total monthly payment
    const monthlyPayment = principalAndInterest + monthlyTax + monthlyInsurance + monthlyPMI;

    // Calculate total payment over the loan term
    const totalPayment = monthlyPayment * loanTerm * 12;

    return NextResponse.json({
      monthlyPayment,
      totalPayment,
      principalAndInterest,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
    });
  } catch (error) {
    console.error('Error calculating mortgage:', error);
    return NextResponse.json(
      { error: 'Failed to calculate mortgage' },
      { status: 500 }
    );
  }
}
