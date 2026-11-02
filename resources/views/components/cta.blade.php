@props(['title' => 'Have a project in mind?', 'text' => 'Tell us what you are trying to build or fix. We will reply with practical next steps.', 'button' => 'Get a Quote'])

<section class="container-page py-16 sm:py-20">
    <div class="relative overflow-hidden rounded-4xl bg-primary-950 px-6 py-12 text-white shadow-soft sm:px-12 sm:py-16">
        <div class="pointer-events-none absolute inset-0 opacity-20 dot-grid"></div>
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full accent-glow"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full hero-glow"></div>

        <div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div class="max-w-2xl">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Start a conversation</p>
                <h2 class="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{{ $title }}</h2>
                <p class="mt-4 max-w-xl text-base leading-relaxed text-primary-100/90">{{ $text }}</p>
            </div>

            <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <a href="{{ route('contact') }}" class="btn-accent">
                    {{ $button }}
                    <x-icon name="arrow-right" class="h-4 w-4" />
                </a>
                @if (config('teto.company.email'))
                    <a href="mailto:{{ config('teto.company.email') }}"
                       class="text-sm font-semibold text-primary-100 underline decoration-primary-400/60 underline-offset-4 hover:text-white">
                        {{ config('teto.company.email') }}
                    </a>
                @endif
            </div>
        </div>
    </div>
</section>
