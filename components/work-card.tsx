import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/icon';
import { OrTodo } from '@/components/todo';
import type { Project } from '@/lib/site';

export function WorkCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group card overflow-hidden transition duration-200 hover:border-primary-600/50 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
        <Image
          src={project.image}
          alt="Abstract placeholder artwork for an unconfirmed case study"
          width={1200}
          height={750}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface-raised/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted shadow-sm">
          Case study {index + 1}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          {project.sector ?? 'Sector pending'}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug">
          <OrTodo value={project.title} label="project title" />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          <OrTodo value={project.summary} label="one-line project summary" />
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="text-xs font-medium text-ink-muted">Client: {project.client}</span>
          <Link href="/portfolio" className="btn-link text-xs">
            View case study
            <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
