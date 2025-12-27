/**
 * SERVER-ONLY MODULE
 * This file uses Node.js modules (fs via nodemailer) and must only be imported in server-side code (API routes).
 * Do not import this in client components.
 */
import nodemailer from 'nodemailer';
import { emailConfig } from './emailConfig';
import { Order } from '@/types';
import { differenceInDays } from 'date-fns';
import { formatDate } from './orderUtils';

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
 * Get order email template data
 */
const getOrderEmailData = (order: Order, customMessage?: string) => {
  const expectedDate = order.expected_completion_date || order.expected_ship_date;
  const daysOverdue = expectedDate 
    ? Math.abs(differenceInDays(expectedDate, new Date()))
    : 0;

  return {
    factoryName: order.supplier,
    po: order.po_number,
    style: order.customer_po || order.po_number,
    sampleType: `Order (${order.status})`,
    expectedDate: formatDate(expectedDate),
    daysOverdue,
    notes: customMessage || order.notes || '',
    orderValue: order.total_value,
    currency: order.currency || 'USD',
  };
};

/**
 * Get order email template HTML
 */
const getOrderEmailTemplate = (data: ReturnType<typeof getOrderEmailData>): string => {
  const { factoryName, po, style, sampleType, expectedDate, daysOverdue, notes, orderValue, currency } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center;">
        <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Order Update</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear ${factoryName},
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We hope this message finds you well. We are writing to follow up on order ${po}.
              </p>
              
              <!-- Order Details Box -->
              <table role="presentation" style="width: 100%; margin: 20px 0; border-collapse: collapse; background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 150px;">PO Number:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${po}</td>
                      </tr>
                      ${style !== po ? `
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Customer PO:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${style}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Status:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${sampleType}</td>
                      </tr>
                      ${expectedDate ? `
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Expected Date:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${expectedDate}</td>
                      </tr>
                      ` : ''}
                      ${daysOverdue > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Days Overdue:</td>
                        <td style="padding: 8px 0; color: #ef4444; font-size: 14px; font-weight: 600;">${daysOverdue} days</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Order Value:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(orderValue)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              ${notes ? `
              <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Notes:</strong> ${notes}
                </p>
              </div>
              ` : ''}
              
              <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We kindly request an update on the status of this order. If there are any issues or delays, please let us know as soon as possible so we can work together to resolve them.
              </p>
              
              <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for your attention to this matter. We appreciate your partnership and look forward to your response.
              </p>
              
              <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>Inventory Management Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                This is an automated email sent from the Inventory Management System.<br>
                Please do not reply to this email directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Get order email text template
 */
const getOrderEmailTextTemplate = (data: ReturnType<typeof getOrderEmailData>): string => {
  const { factoryName, po, style, sampleType, expectedDate, daysOverdue, notes, orderValue, currency } = data;
  
  return `
Dear ${factoryName},

We hope this message finds you well. We are writing to follow up on order ${po}.

Order Details:
- PO Number: ${po}
${style !== po ? `- Customer PO: ${style}\n` : ''}- Status: ${sampleType}
${expectedDate ? `- Expected Date: ${expectedDate}\n` : ''}${daysOverdue > 0 ? `- Days Overdue: ${daysOverdue} days\n` : ''}- Order Value: ${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(orderValue)}
${notes ? `- Notes: ${notes}\n` : ''}
We kindly request an update on the status of this order. If there are any issues or delays, please let us know as soon as possible so we can work together to resolve them.

Thank you for your attention to this matter. We appreciate your partnership and look forward to your response.

Best regards,
Inventory Management Team

---
This is an automated email sent from the Inventory Management System.
Please do not reply to this email directly.
  `.trim();
};

/**
 * Send email for an order
 */
export const sendOrderEmail = async (
  order: Order,
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

    if (!order.supplier_email) {
      return {
        success: false,
        error: 'Supplier email address is missing.',
      };
    }

    // Prepare email data
    const emailData = getOrderEmailData(order, customMessage);

    // Generate subject
    const emailSubject = subject || `Order Update - ${order.po_number}${order.customer_po ? ` / ${order.customer_po}` : ''}`;

    // Prepare email options
    const mailOptions = {
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: order.supplier_email,
      subject: emailSubject,
      html: getOrderEmailTemplate(emailData),
      text: getOrderEmailTextTemplate(emailData),
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

