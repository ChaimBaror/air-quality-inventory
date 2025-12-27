import { NextRequest, NextResponse } from 'next/server';
import { sendDelayedShipmentsEmails } from '@/lib/shipmentEmailService';
import { Shipment } from '@/types';

/**
 * POST /api/shipments/email/batch
 * Send emails for multiple shipments
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { shipments, customMessage } = body;

    if (!shipments || !Array.isArray(shipments) || shipments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Shipments array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate shipments structure
    const validShipments: Shipment[] = shipments.filter((s: unknown): s is Shipment => {
      return typeof s === 'object' && s !== null && 'id' in s;
    });

    if (validShipments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid shipments provided' },
        { status: 400 }
      );
    }

    const result = await sendDelayedShipmentsEmails(validShipments, customMessage);
    
    return NextResponse.json({
      success: true,
      successCount: result.success,
      failedCount: result.failed,
      results: result.results,
    });
  } catch (error: unknown) {
    console.error('Error in batch shipment email API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

