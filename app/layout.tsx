import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Footer } from '@/components/footer';
import { Nav } from '@/components/nav';
import { Schema } from '@/components/schema';
import { WhatsappButton } from '@/components/whatsapp-button';
import { getCompany, getSeo } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

const inter = localFont({
  src: './fonts/inter.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-inter',
});

const jakarta = localFont({
  src: './fonts/plus-jakarta-sans.woff2',
  weight: '600 800',
  display: 'swap',
  variable: '--font-jakarta',
});

export async function generateMetadata(): Promise<Metadata> {
  const [seo, company] = await Promise.all([getSeo(), getCompany()]);

  return {
    metadataBase: new URL(siteUrl()),
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    keywords: seo.keywords,
    authors: [{ name: company.name }],
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type: 'website',
      siteName: company.name,
      locale: 'en_KE',
      images: [{ url: seo.shareImage, width: 1200, height: 630, alt: `${company.name} — ${company.tagline}` }],
    },
    twitter: { card: 'summary_large_image', images: [seo.shareImage] },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F766E' },
    { media: '(prefers-color-scheme: dark)', color: '#08111A' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-surface text-ink">
        <Schema />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <Nav />

        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>

        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}
