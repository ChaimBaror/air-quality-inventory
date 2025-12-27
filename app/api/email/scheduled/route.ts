import { NextRequest, NextResponse } from 'next/server';
import { sendDelayedOrdersEmails } from '@/lib/emailService';
import { mockSamples } from '@/lib/data';

/**
 * POST /api/email/scheduled
 * Scheduled email job - should be called by a cron service on Wednesdays
 * 
 * This endpoint can be triggered by:
 * 1. Vercel Cron Jobs (vercel.json)
 * 2. External cron services (cron-job.org, etc.)
 * 3. Manual trigger for testing
 * 
 * Security: Add authentication header check in production
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if it's Wednesday (optional - can be handled by cron schedule)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 3 = Wednesday
    
    // Uncomment to enforce Wednesday-only execution
    // if (dayOfWeek !== 3) {
    //   return NextResponse.json({
    //     success: false,
    //     error: 'This job should only run on Wednesdays',
    //     skipped: true,
    //   });
    // }

    // Get all samples (in production, this would come from a database)
    const allSamples = mockSamples;

    // Send emails for all delayed orders
    const result = await sendDelayedOrdersEmails(allSamples);

    return NextResponse.json({
      success: true,
      message: `Scheduled email job completed. Sent ${result.success} emails successfully. ${result.failed} failed.`,
      timestamp: new Date().toISOString(),
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      ...result,
    });
  } catch (error: unknown) {
    console.error('Error in scheduled email job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email/scheduled
 * Test endpoint to manually trigger the scheduled job
 */
export async function GET(request: NextRequest) {
  // For testing purposes, allow GET requests
  return POST(request);
}

