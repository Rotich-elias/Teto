@php
    $company = config('teto.company');
    $values = config('teto.values');
@endphp

<x-layout
    title="About Teto Technologies | Kenyan Software & Networking Company"
    description="Teto Technologies is a Kenyan technology company delivering custom software, mobile apps, M-Pesa integrations and network infrastructure."
>
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"></div>
        <div class="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full accent-glow blur-3xl"></div>

        <div class="container-page relative py-14 sm:py-20">
            <p class="eyebrow">About</p>
            <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
                A Kenyan technology company built around delivery.
            </h1>
            <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                We combine full-stack development with hands-on networking experience, so your systems are built well and run reliably.
            </p>
        </div>
    </section>

    <section class="container-page py-14 sm:py-16">
        <div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
                <x-section-heading eyebrow="Our story" title="Software and infrastructure, from the same team." />

                <div class="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
                    <p>
                        Teto Technologies is a Kenyan technology company delivering custom software, mobile apps, M-Pesa integrations and network infrastructure.
                    </p>
                    <p>
                        We combine full-stack development with hands-on networking experience, so your systems are built well and run reliably.
                    </p>
                    <p>
                        That combination matters in practice: a payment integration is only useful if the callback is handled correctly, the server stays up and someone can diagnose a failed transaction. A hotspot is only useful if the billing, vouchers and support behind it work too.
                    </p>
                    <p>
                        We work in clear stages, document what we build and keep the scope honest.
                    </p>
                </div>

                <div class="mt-6 rounded-xl border border-dashed border-accent-600/60 bg-accent-50 p-4 text-sm text-accent-900 dark:border-accent-400/50 dark:bg-accent-500/10 dark:text-accent-200">
                    <p class="font-semibold">Owner-supplied history goes here.</p>
                    <p class="mt-1 flex flex-wrap items-center gap-2">
                        <x-todo label="founding year" />
                        <x-todo label="real mission statement" />
                    </p>
                </div>
            </div>

            <aside class="card h-fit p-6">
                <h2 class="text-sm font-bold uppercase tracking-wider text-ink-muted">Company details</h2>
                <dl class="mt-4 space-y-4 text-sm">
                    <div>
                        <dt class="font-semibold text-ink">Registered name</dt>
                        <dd class="mt-1 text-ink-soft">
                            @if ($company['legal_name'])
                                {{ $company['legal_name'] }}
                            @else
                                <x-todo label="registered business name" />
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="font-semibold text-ink">Registration number</dt>
                        <dd class="mt-1 text-ink-soft">
                            @if ($company['registration_number'])
                                {{ $company['registration_number'] }}
                            @else
                                <x-todo label="business registration number" />
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="font-semibold text-ink">Founded</dt>
                        <dd class="mt-1 text-ink-soft">
                            @if ($company['founded'])
                                {{ $company['founded'] }}
                            @else
                                <x-todo label="founding year" />
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="font-semibold text-ink">Location</dt>
                        <dd class="mt-1 text-ink-soft">
                            @if ($company['address'])
                                {{ $company['address'] }}
                            @else
                                <x-todo label="physical address" />
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="font-semibold text-ink">Business hours</dt>
                        <dd class="mt-1 text-ink-soft">
                            @if ($company['hours'])
                                {{ $company['hours'] }}
                            @else
                                <x-todo label="business hours" />
                            @endif
                        </dd>
                    </div>
                </dl>
            </aside>
        </div>
    </section>

    <section class="border-y border-line bg-surface-sunken">
        <div class="container-page py-14 sm:py-16">
            <x-section-heading
                eyebrow="What we value"
                title="How we approach the work."
                text="These are working principles, not posters on a wall."
            />

            <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

    <section class="container-page py-14 sm:py-16">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <x-section-heading
                eyebrow="The team"
                title="Small team, direct communication."
                text="Team names, photos and short bios are pending owner input. We will not invent people."
            />
            <x-todo label="team names, photos and bios" class="shrink-0" />
        </div>

        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ([1, 2, 3] as $member)
                <div class="card p-6">
                    <div class="grid h-14 w-14 place-items-center rounded-full bg-surface-sunken text-ink-muted">
                        <x-icon name="code" class="h-6 w-6" />
                    </div>
                    <h3 class="mt-4 text-base font-bold">
                        <x-todo label="team member name" />
                    </h3>
                    <p class="mt-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                        <x-todo label="role" />
                    </p>
                    <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                        <x-todo label="short bio" />
                    </p>
                </div>
            @endforeach
        </div>
    </section>

    <x-cta title="Want to work with us?" text="Send a short description of the problem. We will reply with practical next steps." />
</x-layout>
