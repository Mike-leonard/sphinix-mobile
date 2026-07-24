import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter instance using environment settings
 */
export function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined,
  });
}

/**
 * Sends a formatted support ticket email via SMTP
 */
export async function sendSupportEmail({ name, email, category, subject, message }) {
  const transporter = getSmtpTransporter();
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'support@sphinix-mobile.com';
  const fromAddress = process.env.SMTP_FROM || `"Sphinix Mobile Support" <${process.env.SMTP_USER || 'noreply@sphinix-mobile.com'}>`;

  const emailSubject = `[Support Desk - ${category}] ${subject || 'New Contact Inquiry'}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #4f46e5; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">Sphinix Mobile Support Desk</h2>
      </div>
      <div style="padding: 20px 0; color: #334155; line-height: 1.6;">
        <p style="font-size: 14px;"><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
        <p style="font-size: 14px;"><strong>Category:</strong> ${category}</p>
        <p style="font-size: 14px;"><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Message:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #4f46e5; border-radius: 4px; font-size: 14px; white-space: pre-wrap;">${message}</div>
      </div>
      <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        Sent automatically from Sphinix Mobile Contact Support Form
      </div>
    </div>
  `;

  const mailOptions = {
    from: fromAddress,
    to: receiverEmail,
    replyTo: `"${name}" <${email}>`,
    subject: emailSubject,
    html: htmlContent,
  };

  return await transporter.sendMail(mailOptions);
}
