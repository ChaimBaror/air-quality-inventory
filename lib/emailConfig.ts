// Email Configuration
// This file contains all email settings that can be easily modified

export interface EmailConfig {
  // SMTP Server Configuration
  smtp: {
    host: string;
    port: number;
    secure: boolean; // true for 465, false for other ports
    auth: {
      user: string; // Your email address
      pass: string; // Your email password or app password
    };
  };
  
  // Email sender information
  from: {
    name: string;
    email: string;
  };
  
  // Email template settings
  template: {
    subject: string; // Subject line template
    // You can use placeholders: {factoryName}, {po}, {style}, {expectedDate}, {daysOverdue}
  };
}

// Default configuration - modify these values
export const emailConfig: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
    auth: {
      user: process.env.SMTP_USER || '', // Set in .env file
      pass: process.env.SMTP_PASS || '', // Set in .env file (use app password for Gmail)
    },
  },
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Inventory Management System',
    email: process.env.EMAIL_FROM_EMAIL || process.env.SMTP_USER || '',
  },
  template: {
    subject: 'Delayed Order Reminder - {po} / {style}',
  },
};

// Email template HTML - Easy to customize
export const getEmailTemplate = (data: {
  factoryName: string;
  po: string;
  style: string;
  sampleType: string;
  expectedDate: string;
  daysOverdue: number;
  notes?: string;
}): string => {
  const { factoryName, po, style, sampleType, expectedDate, daysOverdue, notes } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delayed Order Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0; text-align: center;">
        <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Delayed Order Reminder</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear ${factoryName},
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We hope this message finds you well. We are writing to follow up on a delayed order that requires your attention.
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
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Tracking Number:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${style}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Type:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${sampleType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Expected Date:</td>
                        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${expectedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Days Overdue:</td>
                        <td style="padding: 8px 0; color: #ef4444; font-size: 14px; font-weight: 600;">${daysOverdue} days</td>
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

// Plain text version of the email (fallback)
export const getEmailTextTemplate = (data: {
  factoryName: string;
  po: string;
  style: string;
  sampleType: string;
  expectedDate: string;
  daysOverdue: number;
  notes?: string;
}): string => {
  const { factoryName, po, style, sampleType, expectedDate, daysOverdue, notes } = data;
  
  return `
Dear ${factoryName},

We hope this message finds you well. We are writing to follow up on a delayed order that requires your attention.

Order Details:
- PO Number: ${po}
- Tracking Number: ${style}
- Type: ${sampleType}
- Expected Date: ${expectedDate}
- Days Overdue: ${daysOverdue} days
${notes ? `- Notes: ${notes}` : ''}

We kindly request an update on the status of this order. If there are any issues or delays, please let us know as soon as possible so we can work together to resolve them.

Thank you for your attention to this matter. We appreciate your partnership and look forward to your response.

Best regards,
Inventory Management Team

---
This is an automated email sent from the Inventory Management System.
Please do not reply to this email directly.
  `.trim();
};

