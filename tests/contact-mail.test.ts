import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ContactData } from '@/lib/contact';

type SentEmail = {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
};

const sends: SentEmail[] = [];

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: async (payload: SentEmail) => {
        sends.push(payload);
        return { data: { id: 'test' }, error: null };
      },
    };
  },
}));

const { notificationRecipients, sendContactEmails } = await import('@/lib/contact-mail');

const enquiry: ContactData = {
  name: 'Test Sender',
  email: 'sender@example.com',
  phone: null,
  service: 'web-development',
  message: 'Please send a quote.',
};

afterEach(() => {
  vi.unstubAllEnvs();
  sends.length = 0;
});

describe('notificationRecipients', () => {
  it('sends notifications to every configured inbox', () => {
    vi.stubEnv('CONTACT_TO_EMAIL', 'tetoteknologies@gmail.com, elgeiy8@gmail.com');
    expect(notificationRecipients()).toEqual(['tetoteknologies@gmail.com', 'elgeiy8@gmail.com']);
  });

  it('accepts a single inbox without a comma', () => {
    vi.stubEnv('CONTACT_TO_EMAIL', 'tetoteknologies@gmail.com');
    expect(notificationRecipients()).toEqual(['tetoteknologies@gmail.com']);
  });

  it('ignores empty entries in the list', () => {
    vi.stubEnv('CONTACT_TO_EMAIL', ' tetoteknologies@gmail.com , , elgeiy8@gmail.com ');
    expect(notificationRecipients()).toEqual(['tetoteknologies@gmail.com', 'elgeiy8@gmail.com']);
  });
});

describe('sendContactEmails', () => {
  it('notifies both inboxes and replies to the sender', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('CONTACT_TO_EMAIL', 'tetoteknologies@gmail.com, elgeiy8@gmail.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'Teto Technologies <no-reply@teto.co.ke>');

    await sendContactEmails(enquiry, 'Web Development');

    expect(sends).toHaveLength(2);
    expect(sends[0].to).toEqual(['tetoteknologies@gmail.com', 'elgeiy8@gmail.com']);
    expect(sends[0].replyTo).toBe('sender@example.com');
    expect(sends[1].to).toBe('sender@example.com');
    expect(sends[1].replyTo).toBe('tetoteknologies@gmail.com');
  });
});
