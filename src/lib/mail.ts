// @ts-nocheck
// @todo fix this file
import nodemailer from 'nodemailer';


export async function sendMail({
  to,
  subject,
  body: _,
}: {
  to: string;
  subject: string;
  body: string;
}) {

  const { SMTP_HOST, SMTP_PORT, SMTP_FROM, SMTP_USER, SMTP_PASS } = process.env;

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transport.verify();
  } catch (e) {
    console.error(e);
  }
  
  try {
    return await transport.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html: '',
    });
  } catch (e) {
    console.error(e);
  }
}