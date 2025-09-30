// Market Report API Route

import { NextRequest, NextResponse } from 'next/server';
import { marketService } from '@/lib/marketService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await marketService.getMarketReport(params.id);
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market report' },
      { status: 500 }
    );
  }
}
