import Link from 'next/link';
import { Icon } from '@/components/icon';
import { Logo } from '@/components/logo';
import { DesktopNavLinks, MobileMenu } from '@/components/nav-links';
import { getCompany } from '@/lib/content';
import { telHref } from '@/lib/site';

export async function Nav() {
  const company = await getCompany();

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <DesktopNavLinks />

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/contact" className="btn-primary text-sm">
            Get a Quote
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/contact" className="btn-primary px-4 py-2 text-xs sm:text-sm">
            Get a Quote
          </Link>

          <MobileMenu
            menuIcon={<Icon name="menu" className="h-5 w-5" />}
            closeIcon={<Icon name="close" className="h-5 w-5" />}
            footer={
              <div className="mt-3 border-t border-line pt-3">
                {company.email && (
                  <a href={`mailto:${company.email}`} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-soft">
                    <Icon name="mail" className="h-4 w-4 text-primary-600" />
                    {company.email}
                  </a>
                )}
                {company.phone && (
                  <a href={telHref(company.phone)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-soft">
                    <Icon name="phone" className="h-4 w-4 text-primary-600" />
                    {company.phone}
                  </a>
                )}
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
