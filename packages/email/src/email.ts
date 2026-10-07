import { Resend } from 'resend';

export async function sendEmail(from: string, to: string, subject: string, htmlBody: string, apiKey: string) {
    const resend = new Resend(apiKey);
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