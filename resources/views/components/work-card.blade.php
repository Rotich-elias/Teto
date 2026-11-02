@props(['project', 'index' => 0])

<article class="group card overflow-hidden transition duration-200 hover:border-primary-600/50 hover:shadow-lift">
    <div class="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
        <img src="{{ asset($project['image']) }}"
             alt="Abstract placeholder artwork for an unconfirmed case study"
             width="1200" height="750" loading="lazy" decoding="async"
             class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]">
        <span class="absolute left-3 top-3 rounded-full bg-surface-raised/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted shadow-sm">
            Case study {{ $index + 1 }}
        </span>
    </div>

    <div class="p-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            {{ $project['sector'] ?? 'Sector pending' }}
        </p>

        <h3 class="mt-2 text-lg font-bold leading-snug">
            @if ($project['title'])
                {{ $project['title'] }}
            @else
                <x-todo label="project title" />
            @endif
        </h3>

        <p class="mt-2 text-sm leading-relaxed text-ink-soft">
            @if ($project['summary'])
                {{ $project['summary'] }}
            @else
                <x-todo label="one-line project summary" />
            @endif
        </p>

        <div class="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
            <span class="text-xs font-medium text-ink-muted">Client: {{ $project['client'] }}</span>
            <a href="{{ route('portfolio') }}" class="btn-link text-xs">
                View case study
                <x-icon name="arrow-up-right" class="h-3.5 w-3.5" />
            </a>
        </div>
    </div>
</article>
