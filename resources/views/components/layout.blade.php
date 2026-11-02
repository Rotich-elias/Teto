@props([
    'title' => null,
    'description' => null,
    'canonical' => null,
    'image' => null,
    'noindex' => false,
    'localBusiness' => false,
])

@php
    $company = config('teto.company');
    $seo = config('teto.seo');
    $pageTitle = $title ?? $seo['default_title'];
    $pageDescription = $description ?? $seo['default_description'];
    $canonicalUrl = $canonical ?? url()->current();
    $shareImage = $image ?? asset($seo['share_image']);
@endphp

<!DOCTYPE html>
<html lang="en-KE">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $pageTitle }}</title>
    <meta name="description" content="{{ $pageDescription }}">
    <meta name="author" content="{{ $company['name'] }}">
    <link rel="canonical" href="{{ $canonicalUrl }}">

    @if ($noindex)
        <meta name="robots" content="noindex, follow">
    @else
        <meta name="robots" content="index, follow, max-image-preview:large">
    @endif

    <link rel="alternate" hreflang="en-KE" href="{{ $canonicalUrl }}">
    <link rel="alternate" hreflang="x-default" href="{{ $canonicalUrl }}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $company['name'] }}">
    <meta property="og:locale" content="en_KE">
    <meta property="og:title" content="{{ $pageTitle }}">
    <meta property="og:description" content="{{ $pageDescription }}">
    <meta property="og:url" content="{{ $canonicalUrl }}">
    <meta property="og:image" content="{{ $shareImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ $company['name'] }} — {{ $company['tagline'] }}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageTitle }}">
    <meta name="twitter:description" content="{{ $pageDescription }}">
    <meta name="twitter:image" content="{{ $shareImage }}">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#0F766E" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#08111A" media="(prefers-color-scheme: dark)">

    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('favicon-32.png') }}" sizes="32x32" type="image/png">
    <link rel="icon" href="{{ asset('favicon-192.png') }}" sizes="192x192" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">

    <link rel="preload" href="{{ asset('fonts/inter.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="{{ asset('fonts/plus-jakarta-sans.woff2') }}" as="font" type="font/woff2" crossorigin>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    @include('partials.schema', ['localBusiness' => $localBusiness])

    @stack('head')
</head>
<body class="min-h-screen bg-surface text-ink">
    <a href="#main" class="skip-link">Skip to main content</a>

    <x-nav />

    <main id="main" tabindex="-1" class="focus:outline-none">
        {{ $slot }}
    </main>

    <x-footer />
    <x-whatsapp-button />
</body>
</html>
