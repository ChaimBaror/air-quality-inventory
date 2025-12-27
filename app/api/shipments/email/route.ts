import { NextRequest, NextResponse } from 'next/server';
import { sendDelayedOrderEmail } from '@/lib/emailService';
import { mockShipments } from '@/lib/shipmentData';
import { Sample } from '@/types';

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

    // Convert shipment to sample format for email service (temporary compatibility)
    const sampleFormat: Sample = {
      id: shipment.id,
      factory: shipment.supplier,
      factoryName: shipment.supplier,
      po_number: shipment.po_number,
      po: shipment.po_number,
      supplierEmail: shipment.supplier_email,
      factory_email: shipment.supplier_email,
      expectedDate: shipment.expected_delivery_date,
      due_date: shipment.expected_delivery_date,
      status: shipment.status === 'delayed' ? 'overdue' : 'under_review',
      notes: customMessage || shipment.notes,
      style: shipment.tracking_number,
      customer_po: shipment.po_number,
      sample_stage: 'SHIPMENT Sample',
      sample_size: '',
      owner: shipment.owner,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };

    const factoryEmail = shipment.supplier_email;
    
    if (!factoryEmail) {
      return NextResponse.json(
        { success: false, error: 'Supplier email address is missing for this shipment' },
        { status: 400 }
      );
    }

    const result = await sendDelayedOrderEmail(sampleFormat, factoryEmail);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        ...result,
      });
    } else {
      return NextResponse.json(
        { success: false, ...result },
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

