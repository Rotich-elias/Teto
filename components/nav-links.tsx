'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

const links = [
  { label: 'TSO', href: '/tso' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const activeClass = 'bg-primary-50 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200';
const idleClass = 'text-ink-soft hover:bg-surface-sunken hover:text-ink';

export function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${active ? activeClass : idleClass}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Mobile menu built on <details>, so it works before JavaScript loads.
 * Once hydrated, it closes itself after each client-side navigation.
 */
export function MobileMenu({ menuIcon, closeIcon, footer }: { menuIcon: ReactNode; closeIcon: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (details.current) details.current.open = false;
  }, [pathname]);

  return (
    <details ref={details} className="group">
      <summary
        className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line bg-surface-raised text-ink [&::-webkit-details-marker]:hidden"
        aria-label="Toggle navigation menu"
      >
        <span className="group-open:hidden">{menuIcon}</span>
        <span className="hidden group-open:block">{closeIcon}</span>
      </summary>

      <div id="mobile-nav" className="fixed inset-x-0 top-[4.5rem] z-40 border-b border-line bg-surface-raised shadow-lift">
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile navigation">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-base font-semibold ${active ? activeClass : idleClass}`}
              >
                {link.label}
              </Link>
            );
          })}
          {footer}
        </nav>
      </div>
    </details>
  );
}
