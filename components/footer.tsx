import Link from 'next/link';
import { Icon, type IconName } from '@/components/icon';
import { Logo } from '@/components/logo';
import { Todo } from '@/components/todo';
import { company, services, social, telHref } from '@/lib/site';

const linkClass = 'text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300';

const companyLinks = [
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

function ContactItem({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
      {children}
    </li>
  );
}

export function Footer() {
  const socialLinks = social.filter((item) => item.url);

  return (
    <footer className="border-t border-line bg-surface-sunken">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">{company.description}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <span className="h-2 w-2 rounded-full bg-accent-500" />
              {company.secondaryTagline}
            </p>

            {/* Social icons are hidden entirely while their URLs are blank. */}
            {socialLinks.length > 0 ? (
              <div className="mt-5 flex items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-raised text-ink-soft transition hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300"
                    aria-label={`${company.name} on ${item.name}`}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Services">
            <h2 className="text-sm font-bold text-ink">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={linkClass}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-bold text-ink">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold text-ink">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <ContactItem icon="mail">
                {company.email ? (
                  <a href={`mailto:${company.email}`} className="hover:text-primary-700 dark:hover:text-primary-300">
                    {company.email}
                  </a>
                ) : (
                  <Todo label="email address" />
                )}
              </ContactItem>
              <ContactItem icon="phone">
                {company.phone ? (
                  <a href={telHref(company.phone)} className="hover:text-primary-700 dark:hover:text-primary-300">
                    {company.phone}
                  </a>
                ) : (
                  <Todo label="phone number" />
                )}
              </ContactItem>
              <ContactItem icon="pin">{company.address ? <span>{company.address}</span> : <Todo label="physical address" />}</ContactItem>
              <ContactItem icon="clock">{company.hours ? <span>{company.hours}</span> : <Todo label="business hours" />}</ContactItem>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span>{company.legalName ?? <Todo label="registered business name" />}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              &middot;
            </span>
            <span>
              {company.registrationNumber ? `Reg. ${company.registrationNumber}` : <Todo label="business registration number" />}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
