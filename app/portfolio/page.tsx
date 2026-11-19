import Image from 'next/image';
import Link from 'next/link';
import { Cta } from '@/components/cta';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { OrTodo, Todo } from '@/components/todo';
import { getPortfolio } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

const FALLBACK_IMAGE = '/images/logo.png';

export const metadata = pageMetadata({
  title: 'Our Work | Teto Technologies',
  description: 'Case studies from Teto Technologies. Project details are published only with client permission.',
  path: '/portfolio',
});

export default async function PortfolioPage() {
  const portfolio = await getPortfolio();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work we can talk about."
        lead="A selection of client projects and our own products. We publish client work only with permission."
      />

      <div className="container-page space-y-10 py-14 sm:py-16">
        {portfolio.map((project, index) => (
          <article key={index} className="card overflow-hidden">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative min-h-64 overflow-hidden bg-surface-sunken">
                <Image
                  src={project.image || FALLBACK_IMAGE}
                  alt={`Screenshot of ${project.title ?? 'a Teto case study'}`}
                  width={1200}
                  height={750}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-surface-raised/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted shadow-sm">
                  Case study {index + 1}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span className="rounded-md bg-primary-50 px-2 py-1 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200">
                    {project.sector ?? 'Sector pending'}
                  </span>
                  <span className="text-ink-muted">Client: {project.client}</span>
                </div>

                <h2 className="mt-3 text-2xl font-extrabold">
                  <OrTodo value={project.title} label="project title" />
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  <OrTodo value={project.summary} label="one-line project summary" />
                </p>

                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">Problem</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      <OrTodo value={project.problem} label="the problem" />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">Solution</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      <OrTodo value={project.solution} label="the solution" />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">Result</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      <OrTodo value={project.result} label="verified result" />
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tech used:</span>
                  {project.tech.length > 0 ? (
                    project.tech.map((tool) => (
                      <span key={tool} className="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">
                        {tool}
                      </span>
                    ))
                  ) : (
                    <Todo label="tech used" />
                  )}
                </div>

                {project.url ? (
                  <div className="mt-4">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                      Visit site
                      <Icon name="arrow-up-right" className="h-4 w-4" />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}

        <p className="text-sm text-ink-muted">
          To discuss a reference or a project similar to yours,{' '}
          <Link
            href="/contact"
            className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-2 dark:text-primary-300"
          >
            get in touch
          </Link>
          .
        </p>
      </div>

      <Cta />
    </>
  );
}
