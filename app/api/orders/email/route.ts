import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/orderEmailService';
import { mockOrders } from '@/lib/orderData';
import { EmailHistoryEntry } from '@/types';

/**
 * POST /api/orders/email
 * Send email for a specific order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customMessage, subject, sentBy } = body;

    // Get all orders (in production, this would come from a database)
    const allOrders = mockOrders;
    const order = allOrders.find((o) => o.id === orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.supplier_email) {
      return NextResponse.json(
        { success: false, error: 'Supplier email address is missing for this order' },
        { status: 400 }
      );
    }

    const result = await sendOrderEmail(order, customMessage, subject);
    
    // Create email history entry
    const emailHistoryEntry: EmailHistoryEntry = {
      id: `email-${Date.now()}`,
      timestamp: new Date(),
      recipient: order.supplier_email,
      subject: subject || `Order Update - ${order.po_number}`,
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
    console.error('Error in order email API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

