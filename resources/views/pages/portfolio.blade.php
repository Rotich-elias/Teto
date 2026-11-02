@php
    $portfolio = config('teto.portfolio');
@endphp

<x-layout
    title="Our Work | Teto Technologies"
    description="Case studies from Teto Technologies. Project details are published only with client permission."
>
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"></div>
        <div class="container-page relative py-14 sm:py-20">
            <p class="eyebrow">Portfolio</p>
            <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Work we can talk about.</h1>
            <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                We publish client work only with permission. The entries below are placeholders until approved project details are supplied.
            </p>

            <div class="mt-6 inline-flex items-center gap-2 rounded-xl border border-dashed border-accent-600/60 bg-accent-50 px-3.5 py-2 text-xs font-medium text-accent-900 dark:border-accent-400/50 dark:bg-accent-500/10 dark:text-accent-300">
                <x-icon name="alert" class="h-4 w-4 shrink-0" />
                Placeholder content — no client, result or statistic on this page is real yet.
            </div>
        </div>
    </section>

    <div class="container-page space-y-10 py-14 sm:py-16">
        @foreach ($portfolio as $index => $project)
            <article class="card overflow-hidden">
                <div class="grid lg:grid-cols-[0.85fr_1.15fr]">
                    <div class="relative min-h-64 overflow-hidden bg-surface-sunken">
                        <img src="{{ asset($project['image']) }}"
                             alt="Abstract placeholder artwork for an unconfirmed case study"
                             width="1200" height="750" loading="lazy" decoding="async"
                             class="h-full w-full object-cover">
                        <span class="absolute left-4 top-4 rounded-full bg-surface-raised/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted shadow-sm">
                            Case study {{ $index + 1 }}
                        </span>
                    </div>

                    <div class="p-6 sm:p-8">
                        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                            <span class="rounded-md bg-primary-50 px-2 py-1 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200">
                                {{ $project['sector'] ?? 'Sector pending' }}
                            </span>
                            <span class="text-ink-muted">Client: {{ $project['client'] }}</span>
                        </div>

                        <h2 class="mt-3 text-2xl font-extrabold">
                            @if ($project['title'])
                                {{ $project['title'] }}
                            @else
                                <x-todo label="project title" />
                            @endif
                        </h2>

                        <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                            @if ($project['summary'])
                                {{ $project['summary'] }}
                            @else
                                <x-todo label="one-line project summary" />
                            @endif
                        </p>

                        <dl class="mt-6 grid gap-4 sm:grid-cols-3">
                            <div>
                                <dt class="text-xs font-bold uppercase tracking-wider text-ink-muted">Problem</dt>
                                <dd class="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                    @if ($project['problem'])
                                        {{ $project['problem'] }}
                                    @else
                                        <x-todo label="the problem" />
                                    @endif
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs font-bold uppercase tracking-wider text-ink-muted">Solution</dt>
                                <dd class="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                    @if ($project['solution'])
                                        {{ $project['solution'] }}
                                    @else
                                        <x-todo label="the solution" />
                                    @endif
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs font-bold uppercase tracking-wider text-ink-muted">Result</dt>
                                <dd class="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                    @if ($project['result'])
                                        {{ $project['result'] }}
                                    @else
                                        <x-todo label="verified result" />
                                    @endif
                                </dd>
                            </div>
                        </dl>

                        <div class="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                            <span class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tech used:</span>
                            @forelse ($project['tech'] as $tool)
                                <span class="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">{{ $tool }}</span>
                            @empty
                                <x-todo label="tech used" />
                            @endforelse
                        </div>
                    </div>
                </div>
            </article>
        @endforeach

        <p class="text-sm text-ink-muted">
            To discuss a reference or a project similar to yours, <a href="{{ route('contact') }}" class="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-2 dark:text-primary-300">get in touch</a>.
        </p>
    </div>

    <x-cta />
</x-layout>
