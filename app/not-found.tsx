import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
  title: 'Page Not Found | Teto Technologies',
  description: 'The page you were looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-primary-700 dark:text-primary-300 sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">That page is not here.</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
        The link may be old, or the page may have moved. Try one of these instead.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Back to home
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
        <Link href="/services" className="btn-secondary">
          Browse services
        </Link>
        <Link href="/contact" className="btn-secondary">
          Contact us
        </Link>
      </div>
    </section>
  );
}
