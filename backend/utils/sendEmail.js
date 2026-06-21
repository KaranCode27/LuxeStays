import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (options) => {
  const emailLogPath = path.join(__dirname, '..', 'email_logs.txt');
  const attachmentNames = options.attachments && options.attachments.length > 0
    ? options.attachments.map(att => `${att.filename} (${att.contentType || 'application/pdf'})`).join(', ')
    : 'None';

  const logContent = `
========================================
TIMESTAMP: ${new Date().toISOString()}
TO: ${options.email}
SUBJECT: ${options.subject}
ATTACHMENTS: ${attachmentNames}
----------------------------------------
TEXT MESSAGE:
${options.message}
----------------------------------------
HTML MESSAGE:
${options.html || 'N/A'}
========================================
\n`;

  // Always append to email_logs.txt in development for traceability
  try {
    fs.appendFileSync(emailLogPath, logContent);
    console.log(`[EMAIL LOGGED] Email to ${options.email} saved to backend/email_logs.txt`);
  } catch (err) {
    console.error('Failed to log email to file:', err);
  }

  // Attempt sending via Nodemailer if SMTP is configured
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    try {
      const port = parseInt(process.env.SMTP_PORT, 10) || 2525;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const message = {
        from: `${process.env.FROM_NAME || 'LuxeStays Support'} <${process.env.FROM_EMAIL || 'noreply@luxestays.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
        attachments: options.attachments || []
      };

      await transporter.sendMail(message);
      console.log(`[SMTP SENT] Email successfully dispatched to ${options.email}`);
    } catch (smtpErr) {
      console.error('[SMTP FAILED] Failed to send via SMTP. Fallback log is saved in backend/email_logs.txt. Error:', smtpErr.message);
    }
  } else {
    console.log(`[SMTP SKIPPED] No SMTP credentials in .env. Inspect backend/email_logs.txt to see the email content.`);
  }
};

export default sendEmail;
