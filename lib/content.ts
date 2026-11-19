import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { z } from 'zod';
import type { IconName } from '@/components/icon';
import { iconNames } from '@/components/icon';
import { sectionLabels, SECTION_KEYS, type SectionKey } from '@/lib/content-sections';
import { databaseConfigured, getSql } from '@/lib/db';
import {
  company as defaultCompany,
  homepage as defaultHomepage,
  portfolio as defaultPortfolio,
  processSteps as defaultProcessSteps,
  products as defaultProducts,
  seo as defaultSeo,
  services as defaultServices,
  social as defaultSocial,
  tech as defaultTech,
  tso as defaultTso,
  values as defaultValues,
  cleanExternalUrl,
  type ProcessStep,
  type Product,
  type Project,
  type Service,
  type Value,
} from '@/lib/site';

/**
 * Admin-editable site content. Every section is one JSONB row in Neon, with
 * cached reads tagged for instant invalidation when the admin saves a change.
 * The hardcoded values in lib/site.ts remain as seed defaults, so the site
 * renders correctly before the database has been migrated or populated.
 */

export { sectionLabels, SECTION_KEYS, type SectionKey } from '@/lib/content-sections';

export const contentTag = (key: SectionKey) => `site-content:${key}`;

const defaults: { [K in SectionKey]: unknown } = {
  company: defaultCompany,
  social: defaultSocial,
  portfolio: defaultPortfolio,
  products: defaultProducts,
  services: defaultServices,
  values: defaultValues,
  process_steps: defaultProcessSteps,
  tech: defaultTech,
  tso: defaultTso,
  seo: defaultSeo,
  homepage: defaultHomepage,
};

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

const text = (max = 5000) => z.string().max(max);
const nullableText = (max = 5000) => text(max).nullable();
const image = z.string().max(2000);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.');
const icon = z.enum(iconNames as [IconName, ...IconName[]]);
const stringList = z.array(text(300));

const companySchema = z.object({
  name: text(120),
  legalName: nullableText(160),
  registrationNumber: nullableText(80),
  tagline: text(200),
  secondaryTagline: text(200),
  description: nullableText(2000),
  mission: nullableText(2000),
  vision: nullableText(2000),
  email: nullableText(190),
  dataEmail: nullableText(190),
  phone: nullableText(80),
  whatsapp: nullableText(80),
  whatsappMessage: text(1000),
  address: nullableText(300),
  hours: nullableText(200),
  founded: nullableText(20),
  founder: nullableText(120),
  mapEmbedUrl: nullableText(2000).transform((value) => cleanExternalUrl(value)),
});

const socialSchema = z.array(
  z.object({
    name: text(60),
    icon,
    url: z.string().max(2000).nullable(),
  }),
);

const projectSchema = z.object({
  title: nullableText(200),
  client: text(200),
  sector: nullableText(120),
  summary: nullableText(1000),
  problem: nullableText(3000),
  solution: nullableText(3000),
  result: nullableText(3000),
  tech: stringList,
  image,
  url: nullableText(2000),
});

const productSchema = z.object({
  name: nullableText(200),
  slug: slug.nullable(),
  kind: z.enum(['app', 'website']),
  summary: nullableText(1000),
  description: nullableText(5000),
  image,
  downloadUrl: nullableText(2000),
  websiteUrl: nullableText(2000),
  platforms: stringList,
  status: nullableText(80),
});

const serviceSchema = z.object({
  slug,
  name: text(160),
  short: text(500),
  icon,
  metaTitle: text(250),
  metaDescription: text(500),
  intro: z.array(text(3000)),
  features: z.array(z.object({ title: text(200), text: text(2000) })),
  deliverables: stringList,
  tech: stringList,
});

const valueSchema = z.object({ icon, title: text(200), text: text(1000) });
const processStepSchema = z.object({ step: text(20), title: text(200), text: text(2000) });
const techSchema = z.array(z.object({ name: text(120), hint: text(120) }));

const tsoSchema = z.object({
  name: text(80),
  fullName: text(160),
  status: text(120),
  lead: text(3000),
  why: z.array(text(3000)),
  steps: z.array(z.object({ step: text(20), title: text(200), text: text(2000), duration: text(200) })),
  features: z.array(z.object({ icon, title: text(200), text: text(2000) })),
  plan: z.object({
    name: text(160),
    tagline: text(500),
    price: nullableText(80),
    priceNote: text(200),
    features: stringList,
    cta: text(200),
  }),
  audiences: stringList,
});

const seoSchema = z.object({
  defaultTitle: text(250),
  defaultDescription: text(500),
  shareImage: z.string().max(2000),
  keywords: stringList,
});

const homepageSchema = z.object({
  eyebrow: text(200),
  title: text(300),
  highlight: text(200),
  lead: text(2000),
  bullets: stringList,
  servicesEyebrow: text(120),
  servicesTitle: text(300),
  servicesText: text(1000),
  whyEyebrow: text(120),
  whyTitle: text(300),
  whyText: text(2000),
  quote: text(2000),
  processEyebrow: text(120),
  processTitle: text(300),
  processText: text(1000),
  workEyebrow: text(120),
  workTitle: text(300),
  workText: text(1000),
  techEyebrow: text(120),
  techTitle: text(300),
  techText: text(1000),
  statLabel: text(80),
  foundedLabel: text(80),
  locationLabel: text(80),
  location: text(80),
});

const schemas: { [K in SectionKey]: z.ZodType } = {
  company: companySchema,
  social: socialSchema,
  portfolio: z.array(projectSchema),
  products: z.array(productSchema),
  services: z.array(serviceSchema),
  values: z.array(valueSchema),
  process_steps: z.array(processStepSchema),
  tech: techSchema,
  tso: tsoSchema,
  seo: seoSchema,
  homepage: homepageSchema,
};

export type CompanyContent = z.infer<typeof companySchema>;
export type SocialLink = z.infer<typeof socialSchema>[number];
export type HomepageContent = z.infer<typeof homepageSchema>;
export type SeoContent = z.infer<typeof seoSchema>;

/** Validate a section's JSON without touching the database. */
export function parseSection(key: SectionKey, value: unknown) {
  return schemas[key].safeParse(value);
}

/* -------------------------------------------------------------------------- */
/* Cached reads                                                               */
/* -------------------------------------------------------------------------- */

let warnedAboutSchema = false;

async function readRow(key: SectionKey): Promise<unknown> {
  if (!databaseConfigured()) return null;

  try {
    const rows = (await getSql().query('SELECT data FROM site_content WHERE key = $1', [key])) as Array<{
      data: unknown;
    }>;
    const data = rows[0]?.data;
    if (data == null) return null;
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    // Before the migration runs, the fallback values still render the whole
    // site. Warn once instead of once per section on every build.
    if ((error as { code?: string })?.code === '42P01') {
      if (!warnedAboutSchema) {
        console.warn('site_content table does not exist; using built-in defaults. Run npm run db:migrate.');
        warnedAboutSchema = true;
      }
    } else {
      console.error(`Could not read site content (${key}).`, error);
    }
    return null;
  }
}

const readers = new Map<SectionKey, () => Promise<unknown>>();

function readerFor(key: SectionKey) {
  let reader = readers.get(key);
  if (!reader) {
    reader = unstable_cache(() => readRow(key), ['site-content', key], {
      tags: [contentTag(key)],
      revalidate: false,
    });
    readers.set(key, reader);
  }
  return reader;
}

/** Return the stored section or its built-in default. Never throws. */
export async function getSection<T = unknown>(key: SectionKey): Promise<T> {
  const fallback = defaults[key];
  try {
    const stored = await readerFor(key)();
    if (stored == null) return structuredClone(fallback) as T;
    const parsed = parseSection(key, stored);
    if (!parsed.success) {
      console.error(`Stored site content (${key}) is invalid; using defaults.`, parsed.error);
      return structuredClone(fallback) as T;
    }
    return parsed.data as T;
  } catch {
    return structuredClone(fallback) as T;
  }
}

export const getCompany = () => getSection<CompanyContent>('company');
export const getSocial = () => getSection<SocialLink[]>('social');
export const getPortfolio = () => getSection<Project[]>('portfolio');
export const getProducts = () => getSection<Product[]>('products');
export const getServices = () => getSection<Service[]>('services');
export const getValues = () => getSection<Value[]>('values');
export const getProcessSteps = () => getSection<ProcessStep[]>('process_steps');
export const getTech = () => getSection<{ name: string; hint: string }[]>('tech');
export const getTso = () => getSection<typeof defaultTso>('tso');
export const getSeo = () => getSection<SeoContent>('seo');
export const getHomepage = () => getSection<HomepageContent>('homepage');

export async function findService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((service) => service.slug === slug);
}

export async function serviceName(slug: string): Promise<string> {
  return (await findService(slug))?.name ?? slug;
}

/** WhatsApp link built from admin-editable company details. */
export async function whatsappHref(): Promise<string | null> {
  const company = await getCompany();
  const number = (company.whatsapp ?? '').replace(/\D+/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(company.whatsappMessage)}`;
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

export type ContentChange = {
  id: number;
  section: string;
  action: string;
  changed_at: string;
};

function invalidate(key: SectionKey) {
  // Every page renders the footer/nav, so revalidating the root layout is the
  // simplest way to guarantee edits appear immediately across the site.
  revalidateTag(contentTag(key), { expire: 0 });
  revalidatePath('/', 'layout');
}

async function logChange(section: string, action: string, snapshot: unknown) {
  if (!databaseConfigured()) return;
  try {
    await getSql().query(
      `INSERT INTO content_changes (section, action, snapshot) VALUES ($1, $2, $3::jsonb)`,
      [section, action, snapshot == null ? null : JSON.stringify(snapshot)],
    );
  } catch (error) {
    console.error('Could not record content change.', error);
  }
}

export async function saveContent(key: SectionKey, value: unknown): Promise<unknown> {
  const parsed = parseSection(key, value);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join('; ') || 'Invalid content.');
  }
  if (!databaseConfigured()) throw new Error('DATABASE_URL is not configured.');

  await getSql().query(
    `INSERT INTO site_content (key, data, updated_at) VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [key, JSON.stringify(parsed.data)],
  );

  await logChange(key, 'save', parsed.data);
  invalidate(key);
  return parsed.data;
}

/** Remove the stored override so the built-in default is used again. */
export async function resetContent(key: SectionKey): Promise<void> {
  if (!databaseConfigured()) throw new Error('DATABASE_URL is not configured.');
  await getSql().query('DELETE FROM site_content WHERE key = $1', [key]);
  await logChange(key, 'reset', null);
  invalidate(key);
}

export async function listChanges(limit = 20): Promise<ContentChange[]> {
  if (!databaseConfigured()) return [];
  try {
    return (await getSql().query(
      `SELECT id, section, action, changed_at FROM content_changes ORDER BY changed_at DESC, id DESC LIMIT $1`,
      [Math.min(Math.max(limit, 1), 100)],
    )) as ContentChange[];
  } catch (error) {
    console.error('Could not list content changes.', error);
    return [];
  }
}

export async function exportContent(): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = { _version: 1, exportedAt: new Date().toISOString() };
  for (const key of SECTION_KEYS) result[key] = await getSection(key);
  return result;
}

/** Import a backup produced by exportContent(). Only known sections are written. */
export async function importContent(payload: unknown): Promise<number> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Expected an exported content object.');
  }
  const input = payload as Record<string, unknown>;
  const keys = SECTION_KEYS.filter((key) => input[key] !== undefined);
  if (keys.length === 0) throw new Error('No recognised sections in that file.');

  for (const key of keys) {
    const parsed = parseSection(key, input[key]);
    if (!parsed.success) {
      throw new Error(`${sectionLabels[key]}: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
    }
  }

  if (!databaseConfigured()) throw new Error('DATABASE_URL is not configured.');

  for (const key of keys) {
    const parsed = parseSection(key, input[key]);
    await getSql().query(
      `INSERT INTO site_content (key, data, updated_at) VALUES ($1, $2::jsonb, now())
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [key, JSON.stringify(parsed.data)],
    );
  }

  await logChange('all', 'import', { sections: keys });
  for (const key of keys) invalidate(key);
  return keys.length;
}

/* -------------------------------------------------------------------------- */
/* Readiness — fields that still render a TODO(owner) badge                   */
/* -------------------------------------------------------------------------- */

export type Placeholder = { section: SectionKey; label: string };

export async function findPlaceholders(): Promise<Placeholder[]> {
  const missing: Placeholder[] = [];
  const add = (section: SectionKey, value: unknown, label: string) => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) missing.push({ section, label });
  };

  const [company, social, portfolio, products, services, tso, seo] = await Promise.all([
    getCompany(),
    getSocial(),
    getPortfolio(),
    getProducts(),
    getServices(),
    getTso(),
    getSeo(),
  ]);

  add('company', company.email, 'company email');
  add('company', company.phone, 'phone number');
  add('company', company.whatsapp, 'WhatsApp number');
  add('company', company.dataEmail, 'data protection email');
  add('company', company.address, 'physical address');
  add('company', company.hours, 'business hours');
  add('company', company.mapEmbedUrl, 'map embed URL');
  add('company', company.legalName, 'registered business name');
  add('company', company.registrationNumber, 'registration number');
  add('company', company.founder, 'founder name');
  add('company', company.founded, 'founding year');
  add('company', company.mission, 'mission statement');
  add('company', company.vision, 'vision statement');

  for (const item of social) add('social', item.url, `${item.name} URL`);
  portfolio.forEach((item, index) => {
    add('portfolio', item.title, `project ${index + 1} title`);
    add('portfolio', item.sector, `project ${index + 1} sector`);
    add('portfolio', item.summary, `project ${index + 1} summary`);
    add('portfolio', item.problem, `project ${index + 1} problem`);
    add('portfolio', item.solution, `project ${index + 1} solution`);
    add('portfolio', item.result, `project ${index + 1} result`);
    if (item.tech.length === 0) missing.push({ section: 'portfolio', label: `project ${index + 1} tech` });
  });
  products.forEach((item, index) => {
    const label = item.name || `product ${index + 1}`;
    add('products', item.name, `product ${index + 1} name`);
    add('products', item.image, `${label} image`);
    add('products', item.summary ?? item.description, `${label} summary`);
    if (!item.downloadUrl && !item.websiteUrl) missing.push({ section: 'products', label: `${label} download or website link` });
  });
  for (const item of services) add('services', item.metaTitle, `${item.name} meta title`);
  add('tso', tso.plan.price, 'TSO package price');
  add('seo', seo.shareImage, 'social sharing image');

  return missing;
}
