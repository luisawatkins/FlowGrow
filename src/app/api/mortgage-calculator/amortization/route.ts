import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  const monthlyPayment = (
    principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)
  ) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= numberOfPayments; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance), // Ensure balance doesn't go below 0 due to rounding
    });
  }

  return schedule;
}

export async function POST(request: NextRequest) {
  try {
    const {
      loanAmount,
      interestRate,
      loanTerm,
    } = await request.json();

    // Validate inputs
    if (
      typeof loanAmount !== 'number' ||
      typeof interestRate !== 'number' ||
      typeof loanTerm !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      );
    }

    const schedule = calculateAmortizationSchedule(
      loanAmount,
      interestRate,
      loanTerm
    );

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error calculating amortization schedule:', error);
    return NextResponse.json(
      { error: 'Failed to calculate amortization schedule' },
      { status: 500 }
    );
  }
}
