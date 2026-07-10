import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const user = process.env.EMAIL_USER?.trim();
const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '').trim();

console.log('Using EMAIL_USER:', user);
console.log('EMAIL_PASS configured:', Boolean(pass));
console.log('Using SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
console.log('Using SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');

if (!user || !pass) {
  console.error('EMAIL_USER and EMAIL_PASS must be set.');
  process.exit(1);
}

const smtpTimeouts = {
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
  socketTimeout: 20_000,
};

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: Number(process.env.SMTP_PORT) || 587,
      secure:
        process.env.SMTP_SECURE === 'true' ||
        process.env.SMTP_SECURE === '1' ||
        Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
      ...smtpTimeouts,
    })
  : nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
      ...smtpTimeouts,
    });

const mailOptions = {
  from: process.env.EMAIL_FROM || user,
  to: user,
  subject: 'DS Astro — SMTP test',
  text: 'This is a test email to verify SMTP credentials.',
};

transporter
  .verify()
  .then(() => transporter.sendMail(mailOptions))
  .then((info) => {
    console.log('Test email sent:', info.response);
  })
  .catch((error) => {
    console.error('Test email failed:', error.message);
    if (error.code) console.error('Error code:', error.code);
    process.exitCode = 1;
  });
