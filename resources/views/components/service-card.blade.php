@props(['service'])

<a href="{{ route('services.show', $service['slug']) }}"
   class="group card relative flex h-full flex-col p-6 transition duration-200 hover:-translate-y-1 hover:border-primary-600/60 hover:shadow-lift">
    <span class="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-400/20">
        <x-icon :name="$service['icon']" class="h-6 w-6" />
    </span>

    <h3 class="mt-5 text-lg font-bold">{{ $service['name'] }}</h3>
    <p class="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{{ $service['short'] }}</p>

    <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300">
        Explore service
        <x-icon name="arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </span>
</a>
