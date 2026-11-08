@php
    $products = collect($products ?? config('teto.products', []));
@endphp

<x-layout
    title="Products | Teto Technologies"
    description="Apps and web products from Teto Technologies — download our apps and explore live websites."
>
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"></div>
        <div class="container-page relative py-14 sm:py-20">
            <p class="eyebrow">Products</p>
            <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Apps and products we’ve built.</h1>
            <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                Download our mobile apps or visit live websites. New releases and links will be added here.
            </p>
        </div>
    </section>

    <div class="container-page py-14 sm:py-16">
        @if ($products->isEmpty())
            <div class="card border-dashed p-8 text-center">
                <p class="text-sm font-semibold text-ink">No products listed yet.</p>
                <p class="mt-2 text-sm text-ink-soft">Add entries in <code class="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">config/teto.php</code> under <code class="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">products</code>.</p>
            </div>
        @else
            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                @foreach ($products as $product)
                    <article class="card flex h-full flex-col overflow-hidden">
                        <div class="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
                            @if (filled($product['image'] ?? null))
                                <img src="{{ asset($product['image']) }}"
                                     alt="{{ filled($product['name'] ?? null) ? $product['name'].' product image' : 'Product image placeholder' }}"
                                     width="1200" height="750" loading="lazy" decoding="async"
                                     class="h-full w-full object-cover">
                            @endif
                            <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                                <span class="rounded-full bg-surface-raised/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted shadow-sm">
                                    {{ ($product['kind'] ?? 'product') === 'website' ? 'Website' : 'App' }}
                                </span>
                                @if (filled($product['status'] ?? null))
                                    <span class="rounded-full bg-primary-50/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary-800 shadow-sm dark:bg-primary-500/20 dark:text-primary-200">
                                        {{ $product['status'] }}
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="flex flex-1 flex-col p-6">
                            <h2 class="text-xl font-extrabold">
                                @if (filled($product['name'] ?? null))
                                    {{ $product['name'] }}
                                @else
                                    <x-todo label="product name" />
                                @endif
                            </h2>

                            <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                                @if (filled($product['summary'] ?? null))
                                    {{ $product['summary'] }}
                                @elseif (filled($product['description'] ?? null))
                                    {{ $product['description'] }}
                                @else
                                    <x-todo label="product summary" />
                                @endif
                            </p>

                            @if (filled($product['description'] ?? null) && filled($product['summary'] ?? null))
                                <p class="mt-3 text-sm leading-relaxed text-ink-muted">{{ $product['description'] }}</p>
                            @endif

                            @if (! empty($product['platforms']))
                                <div class="mt-4 flex flex-wrap gap-2">
                                    @foreach ($product['platforms'] as $platform)
                                        <span class="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">{{ $platform }}</span>
                                    @endforeach
                                </div>
                            @endif

                            <div class="mt-6 flex flex-wrap gap-3 border-t border-line pt-4">
                                @if (filled($product['download_url'] ?? null))
                                    <a href="{{ $product['download_url'] }}" target="_blank" rel="noopener noreferrer" class="btn-primary text-sm">
                                        Download
                                        <x-icon name="arrow-right" class="h-4 w-4" />
                                    </a>
                                @endif
                                @if (filled($product['website_url'] ?? null))
                                    <a href="{{ $product['website_url'] }}" target="_blank" rel="noopener noreferrer" class="btn-secondary text-sm">
                                        Visit website
                                        <x-icon name="arrow-up-right" class="h-4 w-4" />
                                    </a>
                                @endif
                                @if (blank($product['download_url'] ?? null) && blank($product['website_url'] ?? null))
                                    <div class="flex flex-wrap items-center gap-2 text-sm">
                                        <x-todo label="download link" />
                                        <x-todo label="website link" />
                                    </div>
                                @endif
                            </div>
                        </div>
                    </article>
                @endforeach
            </div>

            <p class="mt-8 text-sm text-ink-muted">
                To list a product or update a link, edit <code class="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">config/teto.php</code> → <code class="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">products</code> and supply verified details.
            </p>
        @endif
    </div>

    <x-cta title="Have a product idea?" text="We can help you design, build and launch apps and websites." />
</x-layout>
