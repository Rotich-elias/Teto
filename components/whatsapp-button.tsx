import { Icon } from '@/components/icon';
import { whatsappHref } from '@/lib/site';

export function WhatsappButton() {
  const href = whatsappHref();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] print:hidden"
      aria-label="Chat with Teto Technologies on WhatsApp"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-surface shadow-soft group-hover:block group-focus-visible:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
