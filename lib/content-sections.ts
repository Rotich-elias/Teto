/** Shared section identifiers and labels, safe to import from client components. */

export const SECTION_KEYS = [
  'company',
  'social',
  'portfolio',
  'products',
  'services',
  'values',
  'process_steps',
  'tech',
  'tso',
  'seo',
  'homepage',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const sectionLabels: Record<SectionKey, string> = {
  company: 'Contact & company details',
  social: 'Social media links',
  portfolio: 'Portfolio',
  products: 'Products',
  services: 'Services',
  values: 'Homepage values',
  process_steps: 'Homepage process',
  tech: 'Technology list',
  tso: 'TSO page & price',
  seo: 'SEO settings',
  homepage: 'Homepage copy',
};
