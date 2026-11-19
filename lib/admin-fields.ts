import type { SectionKey } from '@/lib/content-sections';

/**
 * Declarative form definitions for the generic admin content editor. The
 * editor renders these fields and PUTs the resulting JSON to the content API,
 * which validates it with the matching Zod schema in lib/content.ts.
 */

export type FieldDef =
  | {
      key: string;
      label: string;
      type: 'text' | 'textarea' | 'url' | 'image' | 'icon';
      hint?: string;
      maxLength?: number;
      nullable?: boolean;
    }
  | { key: string; label: string; type: 'select'; options: string[]; hint?: string }
  | { key: string; label: string; type: 'stringList'; hint?: string; template?: string }
  | {
      key: string;
      label: string;
      type: 'group';
      fields: FieldDef[];
    }
  | {
      key: string;
      label: string;
      type: 'objectList';
      fields: FieldDef[];
      template?: Record<string, unknown>;
      reorderable?: boolean;
      hint?: string;
    };

/** Sections whose stored value is an array; the editor wraps them in `items`. */
export const arraySections = new Set<SectionKey>([
  'social',
  'portfolio',
  'products',
  'services',
  'values',
  'process_steps',
  'tech',
]);

export function toEditorDoc(section: SectionKey, value: unknown): Record<string, unknown> {
  if (arraySections.has(section)) return { items: Array.isArray(value) ? value : [] };
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function fromEditorDoc(section: SectionKey, doc: Record<string, unknown>): unknown {
  return arraySections.has(section) ? doc.items : doc;
}

const t = (key: string, label: string, nullable = false, maxLength = 5000): FieldDef => ({
  key,
  label,
  type: 'text',
  nullable,
  maxLength,
});
const area = (key: string, label: string, nullable = false): FieldDef => ({
  key,
  label,
  type: 'textarea',
  nullable,
  maxLength: 5000,
});
const url = (key: string, label: string): FieldDef => ({ key, label, type: 'url', nullable: true, maxLength: 2000 });
const icon = (key = 'icon'): FieldDef => ({ key, label: 'Icon', type: 'icon' });
const image = (key = 'image', label = 'Image'): FieldDef => ({ key, label, type: 'image', maxLength: 2000 });
const list = (key: string, label: string, template = ''): FieldDef => ({ key, label, type: 'stringList', template });
const group = (key: string, label: string, fields: FieldDef[]): FieldDef => ({ key, label, type: 'group', fields });

export const contentFields: Record<SectionKey, FieldDef[]> = {
  company: [
    t('name', 'Company name', false, 120),
    t('legalName', 'Registered name', true, 160),
    t('registrationNumber', 'Registration number', true, 80),
    t('tagline', 'Tagline', false, 200),
    t('secondaryTagline', 'Secondary tagline', false, 200),
    area('description', 'Description'),
    area('mission', 'Mission'),
    area('vision', 'Vision'),
    { key: 'email', label: 'Email address', type: 'url', nullable: true, hint: 'Use name@example.com', maxLength: 190 },
    { key: 'dataEmail', label: 'Data protection email', type: 'url', nullable: true, maxLength: 190 },
    t('phone', 'Phone number', true, 80),
    t('whatsapp', 'WhatsApp number (with country code)', true, 80),
    t('whatsappMessage', 'WhatsApp greeting', false, 1000),
    t('address', 'Physical address', true, 300),
    t('hours', 'Business hours', true, 200),
    t('founded', 'Founded', true, 20),
    t('founder', 'Founder', true, 120),
    url('mapEmbedUrl', 'Google Maps embed URL'),
  ],
  social: [
    {
      key: 'items',
      label: 'Social links',
      type: 'objectList',
      reorderable: true,
      hint: 'Leave a URL blank to hide that icon on the site.',
      template: { name: 'New network', icon: 'web', url: null },
      fields: [
        t('name', 'Network name', false, 60),
        icon(),
        url('url', 'Profile URL'),
      ],
    },
  ],
  portfolio: [
    {
      key: 'items',
      label: 'Case studies',
      type: 'objectList',
      reorderable: true,
      template: {
        title: null,
        client: 'Client name',
        sector: null,
        summary: null,
        problem: null,
        solution: null,
        result: null,
        tech: [],
        image: '',
        url: null,
      },
      fields: [
        t('title', 'Project title', true, 200),
        t('client', 'Client', false, 200),
        t('sector', 'Sector', true, 120),
        t('summary', 'One-line summary', true, 1000),
        area('problem', 'Problem', true),
        area('solution', 'Solution', true),
        area('result', 'Verified result', true),
        list('tech', 'Technologies', 'Next.js'),
        image(),
        url('url', 'Live site URL'),
      ],
    },
  ],
  products: [
    {
      key: 'items',
      label: 'Products',
      type: 'objectList',
      reorderable: true,
      template: {
        name: 'New product',
        slug: 'new-product',
        kind: 'app',
        summary: null,
        description: null,
        image: '',
        downloadUrl: null,
        websiteUrl: null,
        platforms: [],
        status: 'Available',
      },
      hint: 'For an APK download set the slug and use /download/<slug> as the download URL, then upload the file in App downloads.',
      fields: [
        t('name', 'Product name', true, 200),
        t('slug', 'Download slug', true, 60),
        { key: 'kind', label: 'Type', type: 'select', options: ['app', 'website'] },
        t('summary', 'Summary', true, 1000),
        area('description', 'Full description', true),
        image(),
        url('downloadUrl', 'Download URL'),
        url('websiteUrl', 'Website URL'),
        list('platforms', 'Platforms', 'Android'),
        t('status', 'Status', true, 80),
      ],
    },
  ],
  services: [
    {
      key: 'items',
      label: 'Services',
      type: 'objectList',
      reorderable: true,
      template: {
        slug: 'new-service',
        name: 'New service',
        short: 'A short description.',
        icon: 'web',
        metaTitle: 'Service | Teto Technologies',
        metaDescription: 'Describe this service for search engines.',
        intro: ['An introduction paragraph.'],
        features: [{ title: 'Feature', text: 'What it means for the client.' }],
        deliverables: [],
        tech: [],
      },
      fields: [
        t('slug', 'URL slug', false, 60),
        t('name', 'Name', false, 160),
        t('short', 'Short description', false, 500),
        icon(),
        t('metaTitle', 'SEO title', false, 250),
        t('metaDescription', 'SEO description', false, 500),
        list('intro', 'Introduction paragraphs', 'A paragraph about this service.'),
        {
          key: 'features',
          label: 'Features',
          type: 'objectList',
          template: { title: 'Feature', text: 'Description.' },
          fields: [t('title', 'Title', false, 200), area('text', 'Description')],
        },
        list('deliverables', 'Deliverables', 'A written scope'),
        list('tech', 'Typical stack', 'Next.js'),
      ],
    },
  ],
  values: [
    {
      key: 'items',
      label: 'Values',
      type: 'objectList',
      reorderable: true,
      template: { icon: 'shield', title: 'New value', text: 'What this value means in practice.' },
      fields: [icon(), t('title', 'Title', false, 200), area('text', 'Description')],
    },
  ],
  process_steps: [
    {
      key: 'items',
      label: 'Process steps',
      type: 'objectList',
      reorderable: true,
      template: { step: '06', title: 'New step', text: 'What happens at this stage.' },
      fields: [t('step', 'Number', false, 20), t('title', 'Title', false, 200), area('text', 'Description')],
    },
  ],
  tech: [
    {
      key: 'items',
      label: 'Tools',
      type: 'objectList',
      reorderable: true,
      template: { name: 'New tool', hint: 'What it is used for' },
      fields: [t('name', 'Name', false, 120), t('hint', 'Hint', false, 120)],
    },
  ],
  tso: [
    t('name', 'Short name', false, 80),
    t('fullName', 'Full name', false, 160),
    t('status', 'Status badge', false, 120),
    area('lead', 'Lead paragraph'),
    list('why', 'Why it matters', 'A reason schools need this.'),
    {
      key: 'steps',
      label: 'How it works',
      type: 'objectList',
      reorderable: true,
      template: { step: '04', title: 'Next step', text: 'What happens.', duration: 'Timing' },
      fields: [t('step', 'Number', false, 20), t('title', 'Title', false, 200), area('text', 'Description'), t('duration', 'Duration', false, 200)],
    },
    {
      key: 'features',
      label: 'What TSO includes',
      type: 'objectList',
      reorderable: true,
      template: { icon: 'web', title: 'Feature', text: 'Description.' },
      fields: [icon(), t('title', 'Title', false, 200), area('text', 'Description')],
    },
    group('plan', 'Package', [
      t('name', 'Package name', false, 160),
      t('tagline', 'Tagline', false, 500),
      t('price', 'Price (e.g. KES 10,000)', true, 80),
      t('priceNote', 'Price note', false, 200),
      list('features', 'Included features', 'A custom-built school website'),
      t('cta', 'Button text', false, 200),
    ]),
    list('audiences', 'Target schools', 'Senior secondary schools'),
  ],
  seo: [
    t('defaultTitle', 'Default page title', false, 250),
    t('defaultDescription', 'Default description', false, 500),
    image('shareImage', 'Social sharing image'),
    list('keywords', 'Keywords', 'web development Kenya'),
  ],
  homepage: [
    t('eyebrow', 'Hero badge', false, 200),
    t('title', 'Hero title (include the highlighted words)', false, 300),
    t('highlight', 'Highlighted words', false, 200),
    area('lead', 'Hero description'),
    list('bullets', 'Hero bullet points', 'Web & mobile'),
    t('servicesEyebrow', 'Services eyebrow', false, 120),
    t('servicesTitle', 'Services title', false, 300),
    t('servicesText', 'Services description', false, 1000),
    t('whyEyebrow', 'Why Teto eyebrow', false, 120),
    t('whyTitle', 'Why Teto title', false, 300),
    area('whyText', 'Why Teto description'),
    area('quote', 'Pull quote'),
    t('processEyebrow', 'Process eyebrow', false, 120),
    t('processTitle', 'Process title', false, 300),
    t('processText', 'Process description', false, 1000),
    t('workEyebrow', 'Work eyebrow', false, 120),
    t('workTitle', 'Work title', false, 300),
    t('workText', 'Work description', false, 1000),
    t('techEyebrow', 'Tools eyebrow', false, 120),
    t('techTitle', 'Tools title', false, 300),
    t('techText', 'Tools description', false, 1000),
    t('statLabel', 'Services stat label', false, 80),
    t('foundedLabel', 'Founded stat label', false, 80),
    t('locationLabel', 'Location stat label', false, 80),
    t('location', 'Location value', false, 80),
  ],
};
