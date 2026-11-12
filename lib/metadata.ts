import type { Metadata } from 'next';

/** Per-page metadata with canonical + hreflang, matching the Laravel layout. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      languages: { 'en-KE': path, 'x-default': path },
    },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}
