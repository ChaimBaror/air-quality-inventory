/**
 * SERVER-ONLY MODULE
 * This file uses Node.js modules (fs via nodemailer) and must only be imported in server-side code (API routes).
 * Do not import this in client components.
 */
import nodemailer from 'nodemailer';
import { emailConfig, getEmailTemplate, getEmailTextTemplate } from './emailConfig';
import { Shipment } from '@/types';
import { differenceInDays } from 'date-fns';
import { formatDate } from './shipmentUtils';

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
 * Send email for a delayed shipment
 */
export const sendDelayedShipmentEmail = async (
  shipment: Shipment,
  customMessage?: string,
  subject?: string
): Promise<EmailResult> => {
  try {
    // Validate email configuration
    if (!emailConfig.smtp.auth.user || !emailConfig.smtp.auth.pass) {
      return {
        success: false,
        error: 'Email configuration is missing. Please set SMTP_USER and SMTP_PASS environment variables.',
      };
    }

    if (!shipment.supplier_email) {
      return {
        success: false,
        error: 'Supplier email address is missing.',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipment.supplier_email)) {
      return {
        success: false,
        error: `Invalid email address format: ${shipment.supplier_email}`,
      };
    }

    // Calculate days overdue
    const expectedDate = shipment.expected_delivery_date;
    const daysOverdue = expectedDate 
      ? Math.abs(differenceInDays(expectedDate, new Date()))
      : 0;

    // Prepare email data
    const emailData = {
      factoryName: shipment.supplier,
      po: shipment.po_number,
      style: shipment.tracking_number, // Using tracking_number as style identifier
      sampleType: `Shipment (${shipment.carrier})`,
      expectedDate: formatDate(expectedDate),
      daysOverdue,
      notes: customMessage || shipment.notes || '',
      trackingNumber: shipment.tracking_number,
      carrier: shipment.carrier,
    };

    // Generate subject
    const emailSubject = subject || `Delayed Shipment Reminder - ${shipment.tracking_number} / PO ${shipment.po_number}`;

    // Prepare email options
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: shipment.supplier_email,
      subject: emailSubject,
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
 * Send emails for all delayed shipments
 */
export const sendDelayedShipmentsEmails = async (
  shipments: Shipment[],
  customMessage?: string,
  subject?: string
): Promise<{ success: number; failed: number; results: Array<{ shipment: Shipment; result: EmailResult }> }> => {
  const delayedShipments = shipments.filter((shipment) => {
    if (shipment.status === 'delivered') return false;
    const expectedDate = shipment.expected_delivery_date;
    if (!expectedDate) return false;
    const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
    return date < new Date();
  });
  
  const results: Array<{ shipment: Shipment; result: EmailResult }> = [];
  let successCount = 0;
  let failedCount = 0;

  for (const shipment of delayedShipments) {
    if (!shipment.supplier_email) {
      results.push({
        shipment,
        result: {
          success: false,
          error: 'No supplier email address found for this shipment',
        },
      });
      failedCount++;
      continue;
    }

    const result = await sendDelayedShipmentEmail(shipment, customMessage, subject);
    results.push({ shipment, result });

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

