@php
    $company = config('teto.company');
    $values = config('teto.values');
    $process = config('teto.process');
    $tech = config('teto.tech');
@endphp

<x-layout
    title="Teto Technologies | Software and Networks That Work in Kenya"
    description="Teto Technologies builds web apps, mobile apps, M-Pesa Daraja integrations and MikroTik network solutions for Kenyan businesses. Get a quote."
    :local-business="true"
>
    {{-- Hero --}}
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"></div>
        <div class="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full hero-glow blur-3xl"></div>

        <div class="container-page relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:py-24">
            <div class="animate-fade-up">
                <p class="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1.5 text-xs font-semibold text-ink-soft shadow-sm">
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-60"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-primary-600"></span>
                    </span>
                    Kenyan software &amp; networking company
                </p>

                <h1 class="mt-6 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.1rem]">
                    Software and networks that
                    <span class="relative inline-block whitespace-nowrap text-primary-700 dark:text-primary-300">
                        work.
                        <svg class="absolute -bottom-2 left-0 h-3 w-full text-accent-500" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                            <path d="M3 8.5c38-5 84-6.5 194-3" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
                        </svg>
                    </span>
                </h1>

                <p class="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                    Teto Technologies builds web apps, mobile apps, payment integrations and network solutions for Kenyan businesses.
                </p>

                <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href="{{ route('contact') }}" class="btn-primary">
                        Get a Quote
                        <x-icon name="arrow-right" class="h-4 w-4" />
                    </a>
                    <a href="{{ route('portfolio') }}" class="btn-secondary">
                        View Our Work
                    </a>
                </div>

                <ul class="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
                    <li class="inline-flex items-center gap-1.5">
                        <x-icon name="check" class="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        Web &amp; mobile
                    </li>
                    <li class="inline-flex items-center gap-1.5">
                        <x-icon name="check" class="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        M-Pesa Daraja
                    </li>
                    <li class="inline-flex items-center gap-1.5">
                        <x-icon name="check" class="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        MikroTik &amp; Cisco
                    </li>
                </ul>
            </div>

            <div class="animate-fade-up-delay">
                <x-hero-art />
            </div>
        </div>
    </section>

    {{-- Services --}}
    <section id="services" class="container-page py-16 sm:py-20 lg:py-24">
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <x-section-heading
                eyebrow="What we do"
                title="One team for software, payments and networks."
                text="Five focused services that cover the path from a first website to the infrastructure behind it."
            />
            <a href="{{ route('services.index') }}" class="btn-link shrink-0">
                All services
                <x-icon name="arrow-right" class="h-4 w-4" />
            </a>
        </div>

        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @foreach (config('teto.services') as $service)
                <x-service-card :service="$service" />
            @endforeach

            <a href="{{ route('contact') }}"
               class="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-primary-600/40 bg-primary-50/60 p-6 transition hover:-translate-y-1 hover:border-primary-600 hover:shadow-lift dark:bg-primary-500/5">
                <span class="grid h-12 w-12 place-items-center rounded-xl bg-surface-raised text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300">
                    <x-icon name="spark" class="h-6 w-6" />
                </span>
                <div class="mt-5">
                    <h3 class="text-lg font-bold">Not sure where to start?</h3>
                    <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                        Tell us what you are trying to solve. We will point you to the right service — or say if we are not the right fit.
                    </p>
                    <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300">
                        Talk to us
                        <x-icon name="arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </a>
        </div>
    </section>

    {{-- Why Teto --}}
    <section class="border-y border-line bg-surface-sunken">
        <div class="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
            <div>
                <x-section-heading
                    eyebrow="Why Teto"
                    title="Built by people who understand the environment it runs in."
                    text="Good software is only half the job. The payment callback, the router, the server and the support behind it all have to hold together."
                />

                <div class="mt-8 rounded-2xl border border-line bg-surface-raised p-5">
                    <p class="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                        <x-icon name="quote" class="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                        <span>
                            We build for Kenyan users and networks, and hold the work to the engineering standards expected anywhere.
                        </span>
                    </p>
                </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
                @foreach ($values as $value)
                    <div class="card p-6">
                        <span class="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                            <x-icon :name="$value['icon']" class="h-5 w-5" />
                        </span>
                        <h3 class="mt-4 text-base font-bold">{{ $value['title'] }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ $value['text'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- Process --}}
    <section class="container-page py-16 sm:py-20 lg:py-24">
        <x-section-heading
            eyebrow="How we work"
            title="A clear process, without the theatre."
            text="You always know what stage the work is at, what is next, and what we need from you."
        />

        <ol class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            @foreach ($process as $step)
                <li class="relative rounded-2xl border border-line bg-surface-raised p-5 lg:border-0 lg:bg-transparent lg:p-0">
                    <div class="flex items-center gap-3 lg:block">
                        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary-600/20 bg-primary-50 font-display text-sm font-extrabold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                            {{ $step['step'] }}
                        </span>
                        <span class="hidden h-px flex-1 bg-line lg:mt-5 lg:block" aria-hidden="true"></span>
                    </div>
                    <h3 class="mt-3 text-base font-bold lg:mt-4">{{ $step['title'] }}</h3>
                    <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{{ $step['text'] }}</p>
                </li>
            @endforeach
        </ol>
    </section>

    {{-- Featured work --}}
    <section class="border-y border-line bg-surface-sunken">
        <div class="container-page py-16 sm:py-20 lg:py-24">
            <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <x-section-heading
                    eyebrow="Selected work"
                    title="Case studies, once the details are approved."
                    text="We publish client work only with permission. These entries are placeholders for approved project details."
                />
                <a href="{{ route('portfolio') }}" class="btn-link shrink-0">
                    View all work
                    <x-icon name="arrow-right" class="h-4 w-4" />
                </a>
            </div>

            <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                @foreach (config('teto.portfolio') as $index => $project)
                    <x-work-card :project="$project" :index="$index" />
                @endforeach
            </div>
        </div>
    </section>

    {{-- Tech --}}
    <section class="container-page py-16 sm:py-20">
        <div class="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div class="max-w-xl">
                <p class="eyebrow">Tools we work with</p>
                <h2 class="mt-3 text-2xl font-extrabold sm:text-3xl">A practical stack, chosen for maintainability.</h2>
            </div>
            <p class="max-w-md text-sm leading-relaxed text-ink-soft">
                Proven tools with large communities, so your team is never locked in to one developer or one vendor.
            </p>
        </div>

        <ul class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            @foreach ($tech as $tool)
                <li class="flex items-center gap-3 rounded-xl border border-line bg-surface-raised px-4 py-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-sunken font-display text-xs font-extrabold text-primary-700 dark:text-primary-300">
                        {{ strtoupper(substr($tool['name'], 0, 2)) }}
                    </span>
                    <span class="min-w-0">
                        <span class="block truncate text-sm font-semibold text-ink">{{ $tool['name'] }}</span>
                        <span class="block truncate text-[0.7rem] text-ink-muted">{{ $tool['hint'] }}</span>
                    </span>
                </li>
            @endforeach
        </ul>
    </section>

    <x-cta />
</x-layout>
