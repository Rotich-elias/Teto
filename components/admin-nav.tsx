'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/status', label: 'Site readiness' },
  { href: '/admin/content/products', label: 'Products' },
  { href: '/admin/content/portfolio', label: 'Portfolio' },
  { href: '/admin/content/company', label: 'Contact details' },
  { href: '/admin/content/social', label: 'Social links' },
  { href: '/admin/content/tso', label: 'TSO & price' },
  { href: '/admin/downloads', label: 'App downloads' },
  { href: '/admin/adverts', label: 'App adverts' },
  { href: '/admin/media', label: 'Media library' },
  { href: '/admin/messages', label: 'Message inbox' },
  { href: '/admin/backup', label: 'Backup & history' },
  { href: '/admin/content/services', label: 'Services' },
  { href: '/admin/content/homepage', label: 'Homepage' },
  { href: '/admin/content/values', label: 'Homepage values' },
  { href: '/admin/content/process_steps', label: 'Process steps' },
  { href: '/admin/content/tech', label: 'Tech list' },
  { href: '/admin/content/seo', label: 'SEO' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return null;

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="border-b border-line bg-surface-sunken">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 text-sm font-extrabold">Admin</span>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  active ? 'bg-primary-700 text-white' : 'text-ink-soft hover:bg-surface-raised hover:text-primary-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <button type="button" onClick={logout} className="btn-secondary px-3 py-1.5 text-xs">
          Sign out
        </button>
      </div>
    </div>
  );
}
