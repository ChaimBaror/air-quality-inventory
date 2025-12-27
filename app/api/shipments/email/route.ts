import { NextRequest, NextResponse } from 'next/server';
import { sendDelayedShipmentEmail } from '@/lib/shipmentEmailService';
import { mockShipments } from '@/lib/shipmentData';

/**
 * POST /api/shipments/email
 * Send email for a specific shipment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipmentId, customMessage } = body;

    // Get all shipments (in production, this would come from a database)
    const allShipments = mockShipments;
    const shipment = allShipments.find((s) => s.id === shipmentId);
    
    if (!shipment) {
      return NextResponse.json(
        { success: false, error: 'Shipment not found' },
        { status: 404 }
      );
    }

    if (!shipment.supplier_email) {
      return NextResponse.json(
        { success: false, error: 'Supplier email address is missing for this shipment' },
        { status: 400 }
      );
    }

    const result = await sendDelayedShipmentEmail(shipment, customMessage);
    
    if (result.success) {
      return NextResponse.json({
        message: 'Email sent successfully',
        ...result,
      });
    } else {
      return NextResponse.json(
        result,
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in shipment email API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

