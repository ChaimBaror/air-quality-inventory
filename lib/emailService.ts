import nodemailer from 'nodemailer';
import { emailConfig, getEmailTemplate, getEmailTextTemplate } from './emailConfig';
import { Sample } from '@/types';
import { differenceInDays } from 'date-fns';
import { formatDate } from './utils';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

export const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: emailConfig.smtp.auth,
    });
  }
  return transporter;
};

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email for a delayed order
 */
export const sendDelayedOrderEmail = async (
  sample: Sample,
  supplierEmail?: string
): Promise<EmailResult> => {
  try {
    // Validate email configuration
    if (!emailConfig.smtp.auth.user || !emailConfig.smtp.auth.pass) {
      return {
        success: false,
        error: 'Email configuration is missing. Please set SMTP_USER and SMTP_PASS environment variables.',
      };
    }

    // Get factory email (supports both new and legacy fields)
    const factoryEmail = supplierEmail || sample.factory_email || sample.supplierEmail;

    if (!factoryEmail) {
      return {
        success: false,
        error: 'Factory email address is missing.',
      };
    }

    // Get data using helper functions (supports both new and legacy fields)
    const factoryName = sample.factory || sample.factoryName || 'Factory';
    const poNumber = sample.po_number || sample.po || 'N/A';
    const dueDate = sample.due_date || sample.expectedDate;
    const style = sample.style || 'N/A';
    const sampleStage = sample.sample_stage || sample.sampleType || 'Sample';

    // Calculate days overdue
    const daysOverdue = dueDate ? Math.abs(differenceInDays(dueDate, new Date())) : 0;

    // Prepare email data
    const emailData = {
      factoryName,
      po: poNumber,
      style,
      sampleType: sampleStage,
      expectedDate: formatDate(dueDate),
      daysOverdue,
      notes: sample.notes,
    };

    // Generate subject with placeholders
    const subject = emailConfig.template.subject
      .replace('{factoryName}', factoryName)
      .replace('{po}', poNumber)
      .replace('{style}', style)
      .replace('{expectedDate}', formatDate(dueDate))
      .replace('{daysOverdue}', daysOverdue.toString());

    // Prepare email options
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: factoryEmail,
      subject,
      html: getEmailTemplate(emailData),
      text: getEmailTextTemplate(emailData),
    };

    // Send email
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while sending email';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Send emails for all delayed orders
 */
export const sendDelayedOrdersEmails = async (
  samples: Sample[]
): Promise<{ success: number; failed: number; results: Array<{ sample: Sample; result: EmailResult }> }> => {
  const delayedSamples = samples.filter((sample) => sample.status === 'overdue');
  
  const results: Array<{ sample: Sample; result: EmailResult }> = [];
  let successCount = 0;
  let failedCount = 0;

  for (const sample of delayedSamples) {
    // Use factory_email or supplierEmail from sample
    const factoryEmail = sample.factory_email || sample.supplierEmail;
    
    if (!factoryEmail) {
      results.push({
        sample,
        result: {
          success: false,
          error: 'No factory email address found for this sample',
        },
      });
      failedCount++;
      continue;
    }

    const result = await sendDelayedOrderEmail(sample, factoryEmail);
    results.push({ sample, result });

    if (result.success) {
      successCount++;
    } else {
      failedCount++;
    }

    // Add a small delay between emails to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return {
    success: successCount,
    failed: failedCount,
    results,
  };
};

