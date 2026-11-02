@props(['eyebrow' => null, 'title', 'text' => null, 'align' => 'left', 'level' => 'h2'])

<div class="{{ $align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl' }}">
    @if ($eyebrow)
        <p class="eyebrow {{ $align === 'center' ? 'justify-center' : '' }}">{{ $eyebrow }}</p>
    @endif

    <{{ $level }} class="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
        {{ $title }}
    </{{ $level }}>

    @if ($text)
        <p class="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{{ $text }}</p>
    @endif
</div>
