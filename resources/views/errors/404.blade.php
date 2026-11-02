<x-layout
    title="Page Not Found | Teto Technologies"
    description="The page you were looking for could not be found."
    :noindex="true"
>
    <section class="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p class="font-display text-7xl font-extrabold text-primary-700 dark:text-primary-300 sm:text-8xl">404</p>
        <h1 class="mt-4 text-3xl font-extrabold sm:text-4xl">That page is not here.</h1>
        <p class="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            The link may be old, or the page may have moved. Try one of these instead.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="{{ route('home') }}" class="btn-primary">
                Back to home
                <x-icon name="arrow-right" class="h-4 w-4" />
            </a>
            <a href="{{ route('services.index') }}" class="btn-secondary">Browse services</a>
            <a href="{{ route('contact') }}" class="btn-secondary">Contact us</a>
        </div>
    </section>
</x-layout>
