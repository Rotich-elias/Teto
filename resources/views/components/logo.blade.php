@props(['class' => 'h-12 w-auto'])

<a href="{{ route('home') }}"
   {{ $attributes->merge(['class' => 'inline-flex items-center rounded-lg']) }}
   aria-label="Teto Technologies — home">
    <img src="{{ asset('images/teto-logo.png') }}"
         alt="Teto Technologies"
         width="439"
         height="540"
         class="{{ $class }} rounded-md object-contain" />
</a>
