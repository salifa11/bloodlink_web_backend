import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true';

  const auth = process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined;

  return nodemailer.createTransport({ host, port, secure, auth });
};

export const sendMail = async ({ to, subject, text, html, from }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: from || process.env.FROM_EMAIL || 'no-reply@bloodlink.local',
    to,
    subject: subject || 'Message from Bloodlink',
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
