import type { MetadataRoute } from 'next';
import { services, siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/tso', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/products', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/portfolio', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return [
    ...pages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
