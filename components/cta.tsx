import Link from 'next/link';
import { AnimatedBackground } from '@/components/animated-background';
import { Icon } from '@/components/icon';
import { getCompany } from '@/lib/content';

type Props = { title?: string; text?: string; button?: string };

export async function Cta({
  title = 'Have a project in mind?',
  text = 'Tell us what you are trying to build or fix. We will reply with practical next steps.',
  button = 'Get a Quote',
}: Props) {
  const company = await getCompany();

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-4xl bg-primary-950 px-6 py-12 text-white shadow-soft sm:px-12 sm:py-16">
        <AnimatedBackground tone="dark" mask={false} />

        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Start a conversation</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-100/90">{text}</p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="btn-accent">
              {button}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="text-sm font-semibold text-primary-100 underline decoration-primary-400/60 underline-offset-4 hover:text-white"
              >
                {company.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
