import { NextRequest, NextResponse } from 'next/server';
import { sendDelayedOrderEmail, sendDelayedOrdersEmails } from '@/lib/emailService';
import { mockSamples } from '@/lib/data';
import { getFactoryEmail } from '@/lib/utils';

/**
 * POST /api/email/send
 * Send email for a specific delayed order or all delayed orders
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sampleId, sendAll } = body;

    // Get all samples (in production, this would come from a database)
    const allSamples = mockSamples;

    if (sendAll) {
      // Send emails for all delayed orders
      const result = await sendDelayedOrdersEmails(allSamples);
      
      return NextResponse.json({
        success: true,
        message: `Sent ${result.success} emails successfully. ${result.failed} failed.`,
        emailResults: result,
      });
    } else if (sampleId) {
      // Send email for a specific sample
      const sample = allSamples.find((s) => s.id === sampleId);
      
      if (!sample) {
        return NextResponse.json(
          { success: false, error: 'Sample not found' },
          { status: 404 }
        );
      }

      if (sample.status !== 'overdue') {
        return NextResponse.json(
          { success: false, error: 'Sample is not overdue' },
          { status: 400 }
        );
      }

      const factoryEmail = getFactoryEmail(sample);
      if (!factoryEmail) {
        return NextResponse.json(
          { success: false, error: 'Factory email address is missing for this sample' },
          { status: 400 }
        );
      }

      const result = await sendDelayedOrderEmail(sample, factoryEmail);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully',
          messageId: result.messageId,
        });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Please provide sampleId or set sendAll to true' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in email API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

