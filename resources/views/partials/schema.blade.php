@props(['localBusiness' => false])

@php
    $company = config('teto.company');
    $socialUrls = collect(config('teto.social'))->pluck('url')->filter()->values()->all();
    $address = $company['address']
        ? ['@type' => 'PostalAddress', 'streetAddress' => $company['address'], 'addressCountry' => 'KE']
        : null;

    $organization = array_filter([
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        '@id' => url('/').'#organization',
        'name' => $company['name'],
        'url' => url('/'),
        'description' => $company['description'],
        'logo' => asset('images/teto-logo.png'),
        'image' => asset(config('teto.seo.share_image')),
        'email' => $company['email'],
        'telephone' => $company['phone'],
        'foundingDate' => $company['founded'],
        'address' => $address,
        'sameAs' => $socialUrls,
    ], fn ($value) => $value !== null && $value !== []);

    $schemas = [$organization];

    if ($localBusiness) {
        $schemas[] = array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            '@id' => url('/').'#localbusiness',
            'name' => $company['name'],
            'url' => url('/'),
            'description' => $company['description'],
            'image' => asset(config('teto.seo.share_image')),
            'email' => $company['email'],
            'telephone' => $company['phone'],
            'address' => $address,
            'areaServed' => ['@type' => 'Country', 'name' => 'Kenya'],
            'sameAs' => $socialUrls,
        ], fn ($value) => $value !== null && $value !== []);
    }
@endphp

@foreach ($schemas as $schema)
    <script type="application/ld+json" nonce="{{ request()->attributes->get('csp_nonce') }}">{!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
@endforeach
