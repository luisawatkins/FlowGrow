import { NextRequest, NextResponse } from 'next/server';
import { comparisonService } from '@/lib/comparisonService';
import { ExportFormat } from '@/types/comparison';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, format } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!format || !Object.values(ExportFormat).includes(format)) {
      return NextResponse.json(
        { error: 'Valid export format is required' },
        { status: 400 }
      );
    }

    const exportData = await comparisonService.exportComparison(
      params.id,
      format as ExportFormat,
      userId
    );

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting comparison:', error);
    return NextResponse.json(
      { error: 'Failed to export comparison' },
      { status: 500 }
    );
  }
}
