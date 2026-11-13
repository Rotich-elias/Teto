import { describe, expect, it } from 'vitest';
import { findService, serviceName, services, telHref } from '@/lib/site';

describe('site helpers', () => {
  it('exposes the seven configured services', () => {
    expect(services).toHaveLength(7);
  });

  it('finds a service by slug', () => {
    expect(findService('web-development')?.name).toBe('Web Development');
  });

  it('includes the business email and cloud hosting services', () => {
    expect(findService('business-email')?.name).toBe('Business Email Hosting');
    expect(findService('cloud-hosting')?.name).toBe('Managed Cloud Hosting');
  });

  it('returns undefined for an unknown slug', () => {
    expect(findService('does-not-exist')).toBeUndefined();
  });

  it('falls back to the raw slug when the service is unknown', () => {
    expect(serviceName('does-not-exist')).toBe('does-not-exist');
  });

  it('builds a tel: link without spaces', () => {
    expect(telHref('+254 712 345 678')).toBe('tel:+254712345678');
  });
});
