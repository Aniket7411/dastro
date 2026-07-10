import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const getEmailFrom = () =>
  process.env.EMAIL_FROM || `"DS Astrology" <${process.env.EMAIL_USER}>`;

const getSmtpCredentials = () => {
  const user = process.env.EMAIL_USER?.trim();
  // Gmail app passwords are often copied with spaces — strip them for SMTP auth.
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '').trim();

  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be configured to send email.');
  }

  return { user, pass };
};

/**
 * Maps SMTP/nodemailer failures to identifiable API responses (no secrets exposed).
 */
export const formatEmailError = (error) => {
  const rawMessage = error?.message || 'Unknown email error';
  const code = error?.code;
  const responseCode = error?.responseCode;

  if (rawMessage.includes('EMAIL_USER and EMAIL_PASS must be configured')) {
    return {
      errorCode: 'EMAIL_NOT_CONFIGURED',
      message: 'Email service is not configured on the server.',
      hint: 'Set EMAIL_USER and EMAIL_PASS in Render environment variables, then redeploy.',
    };
  }

  if (code === 'EAUTH' || responseCode === 535 || responseCode === 534) {
    return {
      errorCode: 'SMTP_AUTH_FAILED',
      message: 'SMTP login failed — invalid email credentials.',
      hint: 'Use a Gmail App Password (not your normal password), or switch to Brevo/SendGrid SMTP with SMTP_HOST.',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    };
  }

  if (['ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET', 'ESOCKET', 'ENOTFOUND'].includes(code)) {
    return {
      errorCode: 'SMTP_CONNECTION_FAILED',
      message: `Cannot reach SMTP server (${process.env.SMTP_HOST || 'smtp.gmail.com'}).`,
      hint: 'Gmail often blocks cloud hosts like Render. Use a relay: set SMTP_HOST, SMTP_PORT, EMAIL_USER, EMAIL_PASS (e.g. Brevo or SendGrid).',
    };
  }

  if (code === 'EENVELOPE' || responseCode === 550 || responseCode === 553) {
    return {
      errorCode: 'SMTP_SEND_REJECTED',
      message: 'SMTP server rejected the outgoing email.',
      hint: 'Check EMAIL_FROM / sender address is allowed by your mail provider.',
    };
  }

  return {
    errorCode: 'EMAIL_SEND_FAILED',
    message: rawMessage,
    hint: 'Check Render logs and run `node test-email.js` locally with the same env vars.',
    ...(code && { smtpCode: code }),
    ...(responseCode && { smtpResponseCode: responseCode }),
  };
};

export const getEmailConfigStatus = () => ({
  emailUserSet: Boolean(process.env.EMAIL_USER?.trim()),
  emailPassSet: Boolean(process.env.EMAIL_PASS?.replace(/\s+/g, '').trim()),
  smtpHost: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com (default)',
  smtpPort: process.env.SMTP_PORT || '587',
});

const smtpTimeouts = {
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
  socketTimeout: 20_000,
};

const createMailTransport = () => {
  const { user, pass } = getSmtpCredentials();

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      process.env.SMTP_SECURE === '1' ||
      port === 465;

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port,
      secure,
      auth: { user, pass },
      ...smtpTimeouts,
    });
  }

  // Explicit Gmail SMTP works more reliably on cloud hosts (Render, Railway) than service: 'gmail'.
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    ...smtpTimeouts,
  });
};

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = createMailTransport();
  }
  return transporter;
};

export const verifyEmailTransport = async () => {
  await getTransporter().verify();
};

const sendMail = async (mailOptions) => {
  const info = await getTransporter().sendMail(mailOptions);
  return info;
};

export const sendCredentialsEmail = async (studentEmail, password, studentName, courseTitle) => {
  await sendMail({
    from: getEmailFrom(),
    to: studentEmail,
    subject: 'Welcome to DS Astrology — Your Login Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Welcome to DS Astrology!</h2>
        <p>Dear ${studentName},</p>
        <p>Thank you for enrolling in <strong>${courseTitle}</strong>. Your course access is now active and your learning journey can begin!</p>
        <p>Here are your secure login credentials to access the Student Portal:</p>
        <div style="background-color: #FDF6EE; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${studentEmail}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p>You can log in and access your course materials here: <a href="https://dsastroinstitute.com/login" style="color: #C8832A; font-weight: bold;">Student Login</a></p>
        <p>Please change your password after your first login.</p>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendPaidLeadAdminEmail = async ({
  customerName,
  phone,
  email,
  product,
  amount,
  paymentId,
  orderId,
}) => {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  await sendAdminNotificationEmail(
    `Paid booking: ${product}`,
    `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
      <h2 style="color: #6b4a44; margin-top: 0;">Payment received</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Customer:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${customerName}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Product/Service:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${product}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Amount:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">₹${amount ?? 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Payment ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${paymentId || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Order ID:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${orderId || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Timestamp:</strong></td><td style="padding: 8px 0;">${timestamp}</td></tr>
      </table>
    </div>
    `
  );
};

export const sendAdminNotificationEmail = async (subject, htmlContent) => {
  if (!process.env.ADMIN_EMAIL) {
    console.log('ADMIN_EMAIL not configured, skipping admin notification.');
    return;
  }

  await sendMail({
    from: getEmailFrom(),
    to: process.env.ADMIN_EMAIL,
    subject,
    html: htmlContent,
  });
};

export const sendPasswordResetEmail = async (studentEmail, studentName, otp) => {
  await sendMail({
    from: getEmailFrom(),
    to: studentEmail,
    subject: 'Password Reset — DS Astrology',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Password Reset Request</h2>
        <p>Dear ${studentName || 'Student'},</p>
        <p>We received a request to reset the password for your DS Astrology student account.</p>
        <p>Your 6-digit OTP code is:</p>
        <div style="background-color: #FDF6EE; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="margin: 0; color: #C8832A; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This code is valid for <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendCounsellorPasswordResetEmail = async (email, name, otp) => {
  const loginUrl = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/counsellor/login`
    : 'https://dsastroinstitute.com/counsellor/login';

  await sendMail({
    from: getEmailFrom(),
    to: email,
    subject: 'Counsellor Password Reset — DS Astrology',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Password Reset Request</h2>
        <p>Dear ${name || 'Counsellor'},</p>
        <p>We received a request to reset the password for your counsellor desk account.</p>
        <p>Your 6-digit OTP code is:</p>
        <div style="background-color: #FDF6EE; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="margin: 0; color: #C8832A; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This code is valid for <strong>15 minutes</strong>. After resetting, sign in at <a href="${loginUrl}">${loginUrl}</a>.</p>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendCounsellorWelcomeEmail = async (email, name, password, loginUrl) => {
  const deskUrl = loginUrl
    || (process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/counsellor/login`
      : 'https://dsastroinstitute.com/counsellor/login');

  await sendMail({
    from: getEmailFrom(),
    to: email,
    subject: 'Your Counsellor Desk Account — DS Astrology',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Welcome to the Counsellor Desk</h2>
        <p>Dear ${name || 'Counsellor'},</p>
        <p>Your account for the free consultation lead desk has been created. Use the credentials below to sign in:</p>
        <div style="background-color: #FDF6EE; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 6px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 6px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${deskUrl}" style="background-color: #C8832A; color: #fff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: bold;">Open Counsellor Login</a>
        </div>
        <p>Please change your password after your first login if you received a temporary password.</p>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendPaymentFailedEmail = async (studentEmail, studentName, courseTitle, retryUrl) => {
  await sendMail({
    from: getEmailFrom(),
    to: studentEmail,
    subject: 'Payment Unsuccessful — DS Astrology',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Payment Unsuccessful</h2>
        <p>Dear ${studentName || 'Student'},</p>
        <p>We couldn't process your payment for <strong>${courseTitle || 'your selected course'}</strong>. No amount has been deducted for this failed attempt.</p>
        <p>Please try again — if the issue continues, our team is happy to help.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${retryUrl || 'https://dsastroinstitute.com/recorded-courses'}" style="background-color: #C8832A; color: #fff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: bold;">Try Again</a>
        </div>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendConsultationConfirmationEmail = async (studentEmail, studentName, courseTitle, preferredDatetime) => {
  const formattedDate = preferredDatetime
    ? new Date(preferredDatetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
    : 'Not specified';

  await sendMail({
    from: getEmailFrom(),
    to: studentEmail,
    subject: 'Consultation Request Received — DS Astrology',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Consultation Request Received</h2>
        <p>Dear ${studentName || 'Student'},</p>
        <p>Thank you for booking a consultation${courseTitle ? ` for <strong>${courseTitle}</strong>` : ''}. Damini Mam will confirm your slot shortly.</p>
        <div style="background-color: #FDF6EE; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Requested date &amp; time:</strong> ${formattedDate}</p>
        </div>
        <p>We'll be in touch soon to confirm your appointment.</p>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendExpiryReminderEmail = async (studentEmail, studentName, courseTitle, validUntil, renewUrl) => {
  const formattedDate = validUntil
    ? new Date(validUntil).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' })
    : '';

  await sendMail({
    from: getEmailFrom(),
    to: studentEmail,
    subject: `Your access to ${courseTitle || 'your course'} expires soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Your Course Access Is Expiring Soon</h2>
        <p>Dear ${studentName || 'Student'},</p>
        <p>Your access to <strong>${courseTitle || 'your course'}</strong> will expire on <strong>${formattedDate}</strong> — that's within the next 7 days.</p>
        <p>Renew now to avoid losing access to your lessons and materials.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${renewUrl || 'https://dsastroinstitute.com/recorded-courses'}" style="background-color: #C8832A; color: #fff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: bold;">Renew Now</a>
        </div>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};

export const sendPasswordChangedEmail = async (studentEmail, studentName) => {
  await sendMail({
    from: getEmailFrom(),
    to: studentEmail,
    subject: 'Password Changed — DS Astrology',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #C8832A; border-radius: 10px;">
        <h2 style="color: #2A0F02; text-align: center;">Password Updated</h2>
        <p>Dear ${studentName || 'Student'},</p>
        <p>Your student account password was changed successfully.</p>
        <p>If you did not make this change, please contact us immediately.</p>
        <br/>
        <p style="color: #666; font-size: 12px; text-align: center;">
          <strong>DS Astrology Team</strong>
        </p>
      </div>
    `,
  });
};
