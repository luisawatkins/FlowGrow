import { NextRequest, NextResponse } from 'next/server';
import { historyService } from '@/lib/historyService';
import { TimelineExportOptions } from '@/types/history';

interface RouteParams {
  params: {
    propertyId: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const exportOptions: TimelineExportOptions = {
      format: body.format || 'json',
      dateRange: body.dateRange ? {
        start: new Date(body.dateRange.start),
        end: new Date(body.dateRange.end)
      } : undefined,
      eventTypes: body.eventTypes,
      includeMetadata: body.includeMetadata || false
    };

    const blob = await historyService.exportTimeline(params.propertyId, exportOptions);

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set('Content-Type', blob.type);
    headers.set(
      'Content-Disposition',
      `attachment; filename="property-${params.propertyId}-timeline.${exportOptions.format}"`
    );

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error('Error exporting timeline:', error);
    return NextResponse.json(
      { error: 'Failed to export timeline' },
      { status: 500 }
    );
  }
}
