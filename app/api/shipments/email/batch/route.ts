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
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { shipments, customMessage, subject, sentBy } = body;

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

    const result = await sendDelayedShipmentsEmails(validShipments, customMessage, subject);
    
    // Create email history entries for each result
    const emailHistoryEntries = result.results.map(({ shipment, result: emailResult }) => ({
      shipmentId: shipment.id,
      emailHistory: {
        id: `email-${Date.now()}-${shipment.id}`,
        timestamp: new Date(),
        recipient: shipment.supplier_email || '',
        subject: subject || `Delayed Shipment Reminder - ${shipment.tracking_number} / PO ${shipment.po_number}`,
        status: emailResult.success ? 'sent' : 'failed' as const,
        messageId: emailResult.messageId,
        error: emailResult.error,
        sentBy: sentBy || 'System',
      },
    }));
    
    return NextResponse.json({
      success: true,
      successCount: result.success,
      failedCount: result.failed,
      results: result.results,
      emailHistory: emailHistoryEntries,
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

