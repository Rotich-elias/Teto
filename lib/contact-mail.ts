import { Resend } from 'resend';
import { company } from '@/lib/site';
import type { ContactData } from '@/lib/contact';

const FROM_FALLBACK = 'Teto Technologies <onboarding@resend.dev>';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

export function contactMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Send the company notification and the visitor auto-reply. */
export async function sendContactEmails(data: ContactData, serviceName: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Contact email not sent: RESEND_API_KEY is not configured.');
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL || FROM_FALLBACK;
  const inbox = process.env.CONTACT_TO_EMAIL || company.email;

  if (!inbox) {
    console.warn('Contact notification not sent: no CONTACT_TO_EMAIL or TETO_EMAIL configured.');
  } else {
    await resend.emails.send({
      from,
      to: inbox,
      replyTo: data.email,
      subject: `New enquiry: ${serviceName} — ${data.name}`,
      html: `
        <h1>New enquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${data.phone ? escapeHtml(data.phone) : 'Not provided'}</p>
        <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
      `,
    });
  }

  await resend.emails.send({
    from,
    to: data.email,
    replyTo: inbox || undefined,
    subject: `We received your message — ${company.name}`,
    html: `
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thank you for contacting ${escapeHtml(company.name)}. We have received your message about
      ${escapeHtml(serviceName)} and will get back to you as soon as we can.</p>
      <p>For reference, here is what you sent:</p>
      <blockquote>${escapeHtml(data.message).replace(/\n/g, '<br />')}</blockquote>
      <p>— ${escapeHtml(company.name)}</p>
    `,
  });
}
