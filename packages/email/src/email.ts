import { Resend } from 'resend';
import { config } from '@repo/config';

const resend = new Resend(config.RESEND_API_KEY);

export async function sendEmail(from: string, to: string, subject: string, htmlBody: string) {

    const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: htmlBody,
  });

  if (error) {
    throw error
  }

  return data;
}