@php
    $company = config('teto.company');
@endphp

<x-layout
    :title="$service['meta_title']"
    :description="$service['meta_description']"
    :canonical="route('services.show', $service['slug'])"
>
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"></div>
        <div class="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full hero-glow blur-3xl"></div>

        <div class="container-page relative py-12 sm:py-16">
            <nav aria-label="Breadcrumb">
                <ol class="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                    <li><a href="{{ route('home') }}" class="hover:text-primary-700 dark:hover:text-primary-300">Home</a></li>
                    <li aria-hidden="true">/</li>
                    <li><a href="{{ route('services.index') }}" class="hover:text-primary-700 dark:hover:text-primary-300">Services</a></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" class="font-medium text-ink">{{ $service['name'] }}</li>
                </ol>
            </nav>

            <div class="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
                <div>
                    <span class="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300">
                        <x-icon :name="$service['icon']" class="h-7 w-7" />
                    </span>

                    <h1 class="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">{{ $service['name'] }}</h1>

                    <div class="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
                        @foreach ($service['intro'] as $paragraph)
                            <p>{{ $paragraph }}</p>
                        @endforeach
                    </div>

                    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="{{ route('contact', ['service' => $service['slug']]) }}" class="btn-primary">
                            Get a Quote
                            <x-icon name="arrow-right" class="h-4 w-4" />
                        </a>
                        <a href="{{ route('services.index') }}" class="btn-secondary">All services</a>
                    </div>
                </div>

                <aside class="card p-6">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-ink-muted">At a glance</h2>
                    <ul class="mt-4 space-y-3">
                        @foreach ($service['features'] as $feature)
                            <li class="flex items-start gap-2.5 text-sm text-ink-soft">
                                <x-icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                                <span>{{ $feature['title'] }}</span>
                            </li>
                        @endforeach
                    </ul>

                    <div class="mt-6 border-t border-line pt-4">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-ink-muted">Typical stack</h3>
                        <div class="mt-3 flex flex-wrap gap-2">
                            @foreach ($service['tech'] as $tool)
                                <span class="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">{{ $tool }}</span>
                            @endforeach
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </section>

    <section class="container-page py-14 sm:py-16">
        <x-section-heading
            eyebrow="What's included"
            title="The work behind the deliverable."
            text="Scope is agreed in writing before we start. These are the areas we usually cover."
        />

        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ($service['features'] as $feature)
                <div class="card p-6">
                    <span class="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                        <x-icon name="check-circle" class="h-5 w-5" />
                    </span>
                    <h3 class="mt-4 text-base font-bold">{{ $feature['title'] }}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ $feature['text'] }}</p>
                </div>
            @endforeach
        </div>
    </section>

    <section class="border-y border-line bg-surface-sunken">
        <div class="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
            <div>
                <x-section-heading eyebrow="Deliverables" title="What you end up with." />
                <ul class="mt-6 space-y-3">
                    @foreach ($service['deliverables'] as $deliverable)
                        <li class="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                            <x-icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                            <span>{{ $deliverable }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="card p-6">
                <h2 class="text-base font-bold">Working with Teto</h2>
                <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                    Every engagement starts with a short discovery conversation. If we are not the right fit, we will say so rather than stretch the scope.
                </p>
                <div class="mt-5 space-y-3 border-t border-line pt-5 text-sm text-ink-soft">
                    <p class="flex items-start gap-2.5">
                        <x-icon name="pin" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        <span>Based in Kenya, working with clients locally and internationally.</span>
                    </p>
                    <p class="flex items-start gap-2.5">
                        <x-icon name="clock" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        <span>
                            @if ($company['hours'])
                                {{ $company['hours'] }}
                            @else
                                <x-todo label="business hours" />
                            @endif
                        </span>
                    </p>
                </div>
                <a href="{{ route('contact', ['service' => $service['slug']]) }}" class="btn-primary mt-6 w-full">
                    Start a conversation
                </a>
            </div>
        </div>
    </section>

    @if ($related->isNotEmpty())
        <section class="container-page py-14 sm:py-16">
            <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <x-section-heading eyebrow="Related" title="Other services" />
                <a href="{{ route('services.index') }}" class="btn-link">View all services <x-icon name="arrow-right" class="h-4 w-4" /></a>
            </div>

            <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($related as $item)
                    <x-service-card :service="$item" />
                @endforeach
            </div>
        </section>
    @endif

    <x-cta />
</x-layout>
