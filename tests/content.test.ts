import { describe, expect, it } from 'vitest';
import { fromEditorDoc, toEditorDoc } from '@/lib/admin-fields';
import { parseSection } from '@/lib/content';
import { type SectionKey } from '@/lib/content-sections';
import {
  company,
  homepage,
  portfolio,
  processSteps,
  products,
  seo,
  services,
  social,
  tech,
  tso,
  values,
} from '@/lib/site';

const defaults: Record<SectionKey, unknown> = {
  company,
  social,
  portfolio,
  products,
  services,
  values,
  process_steps: processSteps,
  tech,
  tso,
  seo,
  homepage,
};

describe('site content schemas', () => {
  it('accepts every built-in default section', () => {
    for (const [key, value] of Object.entries(defaults)) {
      const result = parseSection(key as SectionKey, value);
      expect(result.success, `${key}: ${result.success ? '' : result.error.message}`).toBe(true);
    }
  });

  it('rejects invalid product slugs', () => {
    const invalid = structuredClone(products);
    invalid[0]!.slug = 'Bad Slug';
    expect(parseSection('products', invalid).success).toBe(false);
  });

  it('rejects unknown icon names', () => {
    expect(parseSection('social', [{ name: 'Example', icon: 'not-an-icon', url: null }]).success).toBe(false);
  });

  it('rejects sections with missing required fields', () => {
    expect(parseSection('company', { name: 'Teto Technologies' }).success).toBe(false);
  });

  it('rejects malformed TSO pricing', () => {
    const invalid = structuredClone(tso);
    invalid.plan = null as never;
    expect(parseSection('tso', invalid).success).toBe(false);
  });
});

describe('admin editor documents', () => {
  it('wraps and unwraps array sections', () => {
    const doc = toEditorDoc('portfolio', portfolio);
    expect(doc).toEqual({ items: portfolio });
    expect(fromEditorDoc('portfolio', doc)).toEqual(portfolio);
  });

  it('passes object sections through unchanged', () => {
    const doc = toEditorDoc('company', company);
    expect(doc).toEqual(company);
    expect(fromEditorDoc('company', doc)).toEqual(company);
  });

  it('starts with an empty item list when a section has no value', () => {
    expect(toEditorDoc('social', null)).toEqual({ items: [] });
  });
});
