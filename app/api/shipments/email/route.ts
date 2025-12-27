import { NextRequest, NextResponse } from 'next/server';
import { sendDelayedShipmentEmail } from '@/lib/shipmentEmailService';
import { mockShipments } from '@/lib/shipmentData';
import { EmailHistoryEntry } from '@/types';

/**
 * POST /api/shipments/email
 * Send email for a specific shipment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipmentId, customMessage, subject, sentBy } = body;

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

    const emailSubject = subject || `Delayed Shipment Reminder - ${shipment.tracking_number} / PO ${shipment.po_number}`;
    const result = await sendDelayedShipmentEmail(shipment, customMessage, emailSubject);
    
    // Create email history entry
    const emailHistoryEntry: EmailHistoryEntry = {
      id: `email-${Date.now()}`,
      timestamp: new Date(),
      recipient: shipment.supplier_email,
      subject: emailSubject,
      status: result.success ? 'sent' : 'failed',
      messageId: result.messageId,
      error: result.error,
      sentBy: sentBy || 'System',
    };
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        emailHistory: emailHistoryEntry,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          emailHistory: emailHistoryEntry,
        },
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

