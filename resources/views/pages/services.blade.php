@php
    $services = config('teto.services');
@endphp

<x-layout
    title="Software, Payments & Network Services | Teto Technologies"
    description="Explore Teto Technologies services: web development, Flutter mobile apps, M-Pesa Daraja integration, MikroTik networking and ICT support in Kenya."
>
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"></div>
        <div class="container-page relative py-14 sm:py-20">
            <p class="eyebrow">Services</p>
            <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
                Software, payments and networks — built to work together.
            </h1>
            <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                We keep the team small and the scope honest. Each engagement starts with the problem, not a template.
            </p>

            <nav aria-label="Jump to a service" class="mt-8 flex flex-wrap gap-2">
                @foreach ($services as $service)
                    <a href="#{{ $service['slug'] }}" class="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300">
                        <x-icon :name="$service['icon']" class="h-3.5 w-3.5" />
                        {{ $service['name'] }}
                    </a>
                @endforeach
            </nav>
        </div>
    </section>

    <div class="container-page">
        @foreach ($services as $service)
            <article id="{{ $service['slug'] }}" class="scroll-mt-24 border-b border-line py-14 last:border-b-0 sm:py-16">
                <div class="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    <div>
                        <div class="flex items-center gap-3">
                            <span class="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300">
                                <x-icon :name="$service['icon']" class="h-6 w-6" />
                            </span>
                            <span class="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">{{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                        </div>

                        <h2 class="mt-5 text-2xl font-extrabold sm:text-3xl">{{ $service['name'] }}</h2>

                        <div class="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
                            @foreach ($service['intro'] as $paragraph)
                                <p>{{ $paragraph }}</p>
                            @endforeach
                        </div>

                        <a href="{{ route('services.show', $service['slug']) }}" class="btn-link mt-6">
                            Full {{ strtolower($service['name']) }} details
                            <x-icon name="arrow-right" class="h-4 w-4" />
                        </a>
                    </div>

                    <div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            @foreach ($service['features'] as $feature)
                                <div class="rounded-xl border border-line bg-surface-raised p-4">
                                    <div class="flex items-start gap-2.5">
                                        <x-icon name="check-circle" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                                        <div>
                                            <h3 class="text-sm font-bold text-ink">{{ $feature['title'] }}</h3>
                                            <p class="mt-1 text-sm leading-relaxed text-ink-soft">{{ $feature['text'] }}</p>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <div class="mt-5 flex flex-wrap items-center gap-2">
                            <span class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tech:</span>
                            @foreach ($service['tech'] as $tool)
                                <span class="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">{{ $tool }}</span>
                            @endforeach
                        </div>
                    </div>
                </div>
            </article>
        @endforeach
    </div>

    <x-cta title="Not sure which service fits?" text="Describe the problem in a short message. We will tell you what we would do first — and whether we are the right team for it." />
</x-layout>
