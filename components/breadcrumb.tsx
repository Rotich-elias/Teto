import Link from 'next/link';
import { Fragment } from 'react';

export function Breadcrumb({ items, current }: { items: { href: string; label: string }[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        {items.map((item) => (
          <Fragment key={item.href}>
            <li>
              <Link href={item.href} className="hover:text-primary-700 dark:hover:text-primary-300">
                {item.label}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
          </Fragment>
        ))}
        <li aria-current="page" className="font-medium text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}
