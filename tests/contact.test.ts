import { describe, expect, it } from 'vitest';
import { validateContact, type ContactFields } from '@/lib/contact';

const valid: Partial<ContactFields> = {
  name: 'Jane Wanjiku',
  email: 'jane@example.com',
  phone: '+254 712 345 678',
  service: 'payments-integration',
  message: 'We need M-Pesa integration for our shop.',
  consent: true,
};

describe('validateContact', () => {
  it('accepts a valid submission and returns normalised data', () => {
    const result = validateContact(valid);
    expect(result.errors).toBeNull();
    expect(result.data).toEqual({
      name: 'Jane Wanjiku',
      email: 'jane@example.com',
      phone: '+254 712 345 678',
      service: 'payments-integration',
      message: 'We need M-Pesa integration for our shop.',
    });
  });

  it('treats an omitted phone as null', () => {
    const result = validateContact({ ...valid, phone: '' });
    expect(result.errors).toBeNull();
    expect(result.data?.phone).toBeNull();
  });

  it('trims surrounding whitespace', () => {
    const result = validateContact({ ...valid, name: '  Jane  ', email: ' jane@example.com ' });
    expect(result.data?.name).toBe('Jane');
    expect(result.data?.email).toBe('jane@example.com');
  });

  it.each([
    ['name', { name: '' }],
    ['name', { name: 'A' }],
    ['email', { email: '' }],
    ['email', { email: 'not-an-email' }],
    ['phone', { phone: 'call me' }],
    ['service', { service: '' }],
    ['service', { service: 'not-a-service' }],
    ['message', { message: 'too short' }],
    ['consent', { consent: false }],
  ])('rejects an invalid %s', (field, override) => {
    const result = validateContact({ ...valid, ...override });
    expect(result.data).toBeNull();
    expect(result.errors).toHaveProperty(field);
  });

  it('rejects a name longer than 120 characters', () => {
    const result = validateContact({ ...valid, name: 'a'.repeat(121) });
    expect(result.errors).toHaveProperty('name');
  });

  it('rejects a message longer than 5000 characters', () => {
    const result = validateContact({ ...valid, message: 'a'.repeat(5001) });
    expect(result.errors).toHaveProperty('message');
  });

  it('reports every invalid field at once', () => {
    const result = validateContact({ name: '', email: '', service: '', message: '', consent: false });
    expect(Object.keys(result.errors ?? {}).sort()).toEqual(['consent', 'email', 'message', 'name', 'service']);
  });
});
