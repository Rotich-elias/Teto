import { describe, expect, it } from 'vitest';
import { company, findService, products, serviceName, services, telHref, tso } from '@/lib/site';

describe('site helpers', () => {
  it('exposes the seven configured services', () => {
    expect(services).toHaveLength(7);
  });

  it('has mission and vision statements', () => {
    expect(company.mission?.length ?? 0).toBeGreaterThan(20);
    expect(company.vision?.length ?? 0).toBeGreaterThan(20);
  });

  it('describes the TSO flagship with features', () => {
    expect(tso.fullName).toBe('Take Schools Online');
    expect(tso.features.length).toBeGreaterThan(0);
  });

  it('lists products, including the pending notes app', () => {
    expect(products.length).toBeGreaterThanOrEqual(2);
    expect(products.some((product) => product.name === null)).toBe(true);
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
