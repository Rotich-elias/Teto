@php
    $links = [
        ['label' => 'Services', 'route' => 'services.index', 'active' => 'services.*'],
        ['label' => 'Portfolio', 'route' => 'portfolio', 'active' => 'portfolio'],
        ['label' => 'About', 'route' => 'about', 'active' => 'about'],
        ['label' => 'Contact', 'route' => 'contact', 'active' => 'contact'],
    ];
@endphp

<header class="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-md">
    <div class="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <x-logo />

        <nav class="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            @foreach ($links as $link)
                <a href="{{ route($link['route']) }}"
                   @if (request()->routeIs($link['active'])) aria-current="page" @endif
                   class="rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors {{ request()->routeIs($link['active']) ? 'bg-primary-50 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200' : 'text-ink-soft hover:bg-surface-sunken hover:text-ink' }}">
                    {{ $link['label'] }}
                </a>
            @endforeach
        </nav>

        <div class="hidden items-center gap-2 lg:flex">
            <a href="{{ route('contact') }}" class="btn-primary text-sm">
                Get a Quote
                <x-icon name="arrow-right" class="h-4 w-4" />
            </a>
        </div>

        <div class="flex items-center gap-2 lg:hidden">
            <a href="{{ route('contact') }}" class="btn-primary px-4 py-2 text-xs sm:text-sm">Get a Quote</a>

            <details class="group">
                <summary class="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line bg-surface-raised text-ink [&::-webkit-details-marker]:hidden"
                         aria-label="Toggle navigation menu">
                    <x-icon name="menu" class="h-5 w-5 group-open:hidden" />
                    <x-icon name="close" class="hidden h-5 w-5 group-open:block" />
                </summary>

                <div id="mobile-nav"
                     class="fixed inset-x-0 top-[4.5rem] z-40 border-b border-line bg-surface-raised shadow-lift">
                    <nav class="container-page flex flex-col gap-1 py-4" aria-label="Mobile navigation">
                        @foreach ($links as $link)
                            <a href="{{ route($link['route']) }}"
                               @if (request()->routeIs($link['active'])) aria-current="page" @endif
                               class="rounded-lg px-3 py-2.5 text-base font-semibold {{ request()->routeIs($link['active']) ? 'bg-primary-50 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200' : 'text-ink-soft hover:bg-surface-sunken hover:text-ink' }}">
                                {{ $link['label'] }}
                            </a>
                        @endforeach

                        <div class="mt-3 border-t border-line pt-3">
                            @if (config('teto.company.email'))
                                <a href="mailto:{{ config('teto.company.email') }}" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-soft">
                                    <x-icon name="mail" class="h-4 w-4 text-primary-600" />
                                    {{ config('teto.company.email') }}
                                </a>
                            @endif
                            @if (config('teto.company.phone'))
                                <a href="tel:{{ preg_replace('/\s+/', '', config('teto.company.phone')) }}" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-soft">
                                    <x-icon name="phone" class="h-4 w-4 text-primary-600" />
                                    {{ config('teto.company.phone') }}
                                </a>
                            @endif
                        </div>
                    </nav>
                </div>
            </details>
        </div>
    </div>
</header>
