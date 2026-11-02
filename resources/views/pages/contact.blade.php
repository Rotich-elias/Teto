@php
    $company = config('teto.company');
    $nonce = request()->attributes->get('csp_nonce');
    $serviceOptions = collect($services)
        ->mapWithKeys(fn ($service) => [$service['slug'] => $service['name']])
        ->all();
    $serviceOptions = ['' => 'Select a service'] + $serviceOptions;
    $whatsappNumber = preg_replace('/\D+/', '', (string) $company['whatsapp']);
    $whatsappText = rawurlencode((string) $company['whatsapp_message']);
@endphp

<x-layout
    title="Contact Teto Technologies | Get a Quote"
    description="Tell Teto Technologies about your website, mobile app, M-Pesa integration, network or ICT support project. Get a practical reply from a Kenyan team."
    :local-business="true"
>
    <section class="relative overflow-hidden border-b border-line/60">
        <div class="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"></div>
        <div class="container-page relative py-14 sm:py-16">
            <p class="eyebrow">Contact</p>
            <h1 class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Let's talk about your project.</h1>
            <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                Tell us what you are trying to build or fix. A short, specific message gets you a more useful reply.
            </p>
        </div>
    </section>

    <section class="container-page py-12 sm:py-16">
        <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            {{-- Form --}}
            <div class="card p-5 sm:p-8">
                @if (session('status'))
                    <div role="status" class="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                        <x-icon name="check-circle" class="mt-0.5 h-5 w-5 shrink-0" />
                        <p>{{ session('status') }}</p>
                    </div>
                @endif

                @if (session('error'))
                    <div role="alert" class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                        <x-icon name="alert" class="mt-0.5 h-5 w-5 shrink-0" />
                        <p>{{ session('error') }}</p>
                    </div>
                @endif

                @if ($errors->any())
                    <div role="alert" class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                        <x-icon name="alert" class="mt-0.5 h-5 w-5 shrink-0" />
                        <p>Please fix the highlighted fields and send again.</p>
                    </div>
                @endif

                <div x-data="contactForm" data-alpine>
                    <div x-show="success"
                         x-cloak
                         x-ref="successPanel"
                         tabindex="-1"
                         role="status"
                         class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                        <span class="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                            <x-icon name="check-circle" class="h-6 w-6" />
                        </span>
                        <h2 class="mt-4 text-xl font-bold text-emerald-950 dark:text-emerald-100">Message sent</h2>
                        <p class="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200" x-text="feedback"></p>
                        <p class="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
                            If it is urgent, use WhatsApp or email below.
                        </p>
                        <button type="button" class="btn-secondary mt-5" x-on:click="reset">Send another message</button>
                    </div>

                    <form x-ref="form"
                          action="{{ route('contact.store') }}"
                          method="POST"
                          x-show="!success"
                          x-on:submit.prevent="submit"
                          data-service="{{ $selectedService }}"
                          class="relative">
                        @csrf

                        <h2 class="text-xl font-bold">Project enquiry</h2>
                        <p class="mt-1 text-sm text-ink-soft">Fields marked <span class="text-red-600 dark:text-red-400">*</span> are required.</p>

                        {{-- Honeypot: hidden from people, tempting to bots. --}}
                        <div class="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                            <label for="company_website">Company website</label>
                            <input type="text" id="company_website" name="company_website" tabindex="-1" autocomplete="off">
                        </div>

                        <div class="mt-6 grid gap-5 sm:grid-cols-2">
                            <x-field
                                name="name"
                                label="Your name"
                                required
                                autocomplete="name"
                                placeholder="e.g. Jane Wanjiku"
                                x-model="name"
                            />

                            <x-field
                                name="email"
                                label="Email address"
                                type="email"
                                required
                                autocomplete="email"
                                inputmode="email"
                                placeholder="you@company.co.ke"
                                x-model="email"
                            />

                            <x-field
                                name="phone"
                                label="Phone number"
                                type="tel"
                                autocomplete="tel"
                                inputmode="tel"
                                placeholder="+254 7XX XXX XXX"
                                hint="Optional. Include the country code if you are outside Kenya."
                                x-model="phone"
                            />

                            <x-field
                                name="service"
                                label="Service you are interested in"
                                type="select"
                                required
                                :options="$serviceOptions"
                                :value="$selectedService"
                                x-model="service"
                            />
                        </div>

                        <div class="mt-5">
                            <x-field
                                name="message"
                                label="Tell us about the project"
                                type="textarea"
                                required
                                placeholder="What are you trying to build or fix? Include any deadline, budget range or existing systems we should know about."
                                hint="A few sentences is enough to start."
                                x-model="message"
                            />
                        </div>

                        <div class="mt-5">
                            <label for="consent" class="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                                <input type="checkbox"
                                       id="consent"
                                       name="consent"
                                       value="1"
                                       required
                                       x-model="consent"
                                       @checked(old('consent'))
                                       class="mt-0.5 h-4 w-4 shrink-0 rounded border-line bg-surface-raised text-primary-700 focus:ring-primary-600">
                                <span>
                                    I agree that {{ $company['name'] }} may use the details I have provided to respond to this enquiry, as described in the
                                    <a href="{{ route('privacy') }}" class="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-2 dark:text-primary-300">Privacy Policy</a>.
                                    <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
                                </span>
                            </label>

                            @error('consent')
                                <p class="field-error">
                                    <x-icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{{ $message }}</span>
                                </p>
                            @enderror
                            <p class="field-error" x-show="errors.consent" x-text="errors.consent" x-cloak></p>
                        </div>

                        @if (config('services.turnstile.enabled') && config('services.turnstile.site_key'))
                            <div class="mt-5">
                                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer nonce="{{ $nonce }}"></script>
                                <div class="cf-turnstile" data-sitekey="{{ config('services.turnstile.site_key') }}"></div>
                                @error('cf-turnstile-response')
                                    <p class="field-error mt-2">{{ $message }}</p>
                                @enderror
                            </div>
                        @endif

                        <div aria-live="polite" aria-atomic="true" class="mt-5">
                            <div x-show="failed" x-cloak class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                                <x-icon name="alert" class="mt-0.5 h-5 w-5 shrink-0" />
                                <p x-text="feedback"></p>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button type="submit" class="btn-primary" x-bind:disabled="sending">
                                <span x-show="!sending">Send message</span>
                                <span x-show="sending" x-cloak>Sending…</span>
                                <x-icon name="arrow-right" class="h-4 w-4" x-show="!sending" />
                            </button>

                            <p class="text-xs leading-relaxed text-ink-muted">
                                We use your details only to reply to this enquiry.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {{-- Sidebar --}}
            <aside class="space-y-6">
                <div class="card p-6">
                    <h2 class="text-lg font-bold">Prefer a direct conversation?</h2>
                    <p class="mt-2 text-sm leading-relaxed text-ink-soft">
                        Email, call or send a WhatsApp message any time — we are available 24/7.
                    </p>

                    <div class="mt-5 space-y-3">
                        <div class="flex items-start gap-3 rounded-xl border border-line p-3.5">
                            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                                <x-icon name="mail" class="h-4 w-4" />
                            </span>
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</p>
                                @if ($company['email'])
                                    <a href="mailto:{{ $company['email'] }}" class="mt-0.5 block break-all text-sm font-semibold text-ink hover:text-primary-700 dark:hover:text-primary-300">{{ $company['email'] }}</a>
                                @else
                                    <div class="mt-1"><x-todo label="company email address" /></div>
                                @endif
                            </div>
                        </div>

                        <div class="flex items-start gap-3 rounded-xl border border-line p-3.5">
                            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                                <x-icon name="phone" class="h-4 w-4" />
                            </span>
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-wider text-ink-muted">Phone</p>
                                @if ($company['phone'])
                                    <a href="tel:{{ preg_replace('/\s+/', '', $company['phone']) }}" class="mt-0.5 block text-sm font-semibold text-ink hover:text-primary-700 dark:hover:text-primary-300">{{ $company['phone'] }}</a>
                                @else
                                    <div class="mt-1"><x-todo label="phone number" /></div>
                                @endif
                            </div>
                        </div>

                        @if ($whatsappNumber)
                            <a href="https://wa.me/{{ $whatsappNumber }}?text={{ $whatsappText }}"
                               target="_blank" rel="noopener noreferrer"
                               class="flex items-center justify-between gap-3 rounded-xl border border-line p-3.5 transition hover:border-[#25D366]">
                                <span class="flex items-center gap-3">
                                    <span class="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366]">
                                        <x-icon name="whatsapp" class="h-4 w-4" />
                                    </span>
                                    <span>
                                        <span class="block text-xs font-semibold uppercase tracking-wider text-ink-muted">WhatsApp</span>
                                        <span class="block text-sm font-semibold text-ink">Chat with us</span>
                                    </span>
                                </span>
                                <x-icon name="arrow-up-right" class="h-4 w-4 text-ink-muted" />
                            </a>
                        @else
                            <div class="rounded-xl border border-dashed border-line p-3.5">
                                <x-todo label="WhatsApp number" />
                            </div>
                        @endif
                    </div>

                    <div class="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
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
                        <p class="mt-2 flex items-start gap-2.5">
                            <x-icon name="pin" class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                            <span>
                                @if ($company['address'])
                                    {{ $company['address'] }}
                                @else
                                    <x-todo label="physical address" />
                                @endif
                            </span>
                        </p>
                    </div>
                </div>

                <div class="card overflow-hidden">
                    @if ($company['map_embed_url'])
                        <iframe src="{{ $company['map_embed_url'] }}"
                                title="Map showing the {{ $company['name'] }} location"
                                class="h-64 w-full border-0"
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                allowfullscreen></iframe>
                    @else
                        <div class="relative h-64 overflow-hidden bg-surface-sunken dot-grid">
                            <div class="absolute inset-0 grid place-items-center p-6 text-center">
                                <div>
                                    <span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-raised text-primary-700 shadow-sm dark:text-primary-300">
                                        <x-icon name="pin" class="h-6 w-6" />
                                    </span>
                                    <p class="mt-3 text-sm font-semibold text-ink">Map placeholder</p>
                                    <p class="mt-1 text-xs text-ink-muted">Add a physical address and map embed URL.</p>
                                    <div class="mt-3"><x-todo label="map embed URL" /></div>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>

                <div class="rounded-2xl border border-line bg-surface-raised p-6">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-ink-muted">What happens next</h2>
                    <ol class="mt-4 space-y-3 text-sm text-ink-soft">
                        <li class="flex gap-3">
                            <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">1</span>
                            <span>We read your message and check whether we are the right fit.</span>
                        </li>
                        <li class="flex gap-3">
                            <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">2</span>
                            <span>We reply with questions, a call or a short scope.</span>
                        </li>
                        <li class="flex gap-3">
                            <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">3</span>
                            <span>If it fits, we agree the work and start.</span>
                        </li>
                    </ol>
                </div>
            </aside>
        </div>
    </section>
</x-layout>
