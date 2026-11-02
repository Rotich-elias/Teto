@php
    $socialLinks = collect(config('teto.social'))->filter(fn ($item) => filled($item['url']));
    $company = config('teto.company');
@endphp

<footer class="border-t border-line bg-surface-sunken">
    <div class="container-page py-14 sm:py-16">
        <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
                <x-logo />
                <p class="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {{ $company['description'] }}
                </p>
                <p class="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    <span class="h-2 w-2 rounded-full bg-accent-500"></span>
                    {{ $company['secondary_tagline'] }}
                </p>

                <div class="mt-5 flex items-center gap-2">
                    @forelse ($socialLinks as $social)
                        <a href="{{ $social['url'] }}"
                           target="_blank" rel="noopener noreferrer"
                           class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-raised text-ink-soft transition hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300"
                           aria-label="{{ $company['name'] }} on {{ $social['name'] }}">
                            <x-icon :name="$social['icon']" class="h-4 w-4" />
                        </a>
                    @empty
                        <x-todo label="social media links" />
                    @endforelse
                </div>
            </div>

            <nav aria-label="Services">
                <h2 class="text-sm font-bold text-ink">Services</h2>
                <ul class="mt-4 space-y-2.5">
                    @foreach (config('teto.services') as $service)
                        <li>
                            <a href="{{ route('services.show', $service['slug']) }}" class="text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300">
                                {{ $service['name'] }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </nav>

            <nav aria-label="Company">
                <h2 class="text-sm font-bold text-ink">Company</h2>
                <ul class="mt-4 space-y-2.5">
                    <li><a href="{{ route('about') }}" class="text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300">About</a></li>
                    <li><a href="{{ route('portfolio') }}" class="text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300">Portfolio</a></li>
                    <li><a href="{{ route('contact') }}" class="text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300">Contact</a></li>
                    <li><a href="{{ route('privacy') }}" class="text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300">Privacy Policy</a></li>
                    <li><a href="{{ route('terms') }}" class="text-sm text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300">Terms of Use</a></li>
                </ul>
            </nav>

            <div>
                <h2 class="text-sm font-bold text-ink">Contact</h2>
                <ul class="mt-4 space-y-3 text-sm text-ink-soft">
                    <li class="flex items-start gap-2.5">
                        <x-icon name="mail" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        @if ($company['email'])
                            <a href="mailto:{{ $company['email'] }}" class="hover:text-primary-700 dark:hover:text-primary-300">{{ $company['email'] }}</a>
                        @else
                            <x-todo label="email address" />
                        @endif
                    </li>
                    <li class="flex items-start gap-2.5">
                        <x-icon name="phone" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        @if ($company['phone'])
                            <a href="tel:{{ preg_replace('/\s+/', '', $company['phone']) }}" class="hover:text-primary-700 dark:hover:text-primary-300">{{ $company['phone'] }}</a>
                        @else
                            <x-todo label="phone number" />
                        @endif
                    </li>
                    <li class="flex items-start gap-2.5">
                        <x-icon name="pin" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        @if ($company['address'])
                            <span>{{ $company['address'] }}</span>
                        @else
                            <x-todo label="physical address" />
                        @endif
                    </li>
                    <li class="flex items-start gap-2.5">
                        <x-icon name="clock" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        @if ($company['hours'])
                            <span>{{ $company['hours'] }}</span>
                        @else
                            <x-todo label="business hours" />
                        @endif
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {{ now()->year }} {{ $company['name'] }}. All rights reserved.</p>
            <p class="flex flex-wrap items-center gap-2">
                <span>
                    @if ($company['legal_name'])
                        {{ $company['legal_name'] }}
                    @else
                        <x-todo label="registered business name" />
                    @endif
                </span>
                <span class="hidden sm:inline" aria-hidden="true">&middot;</span>
                <span>
                    @if ($company['registration_number'])
                        Reg. {{ $company['registration_number'] }}
                    @else
                        <x-todo label="business registration number" />
                    @endif
                </span>
            </p>
        </div>
    </div>
</footer>
