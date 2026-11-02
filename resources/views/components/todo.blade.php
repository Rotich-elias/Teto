@props(['label' => 'details'])

<span {{ $attributes->merge([
    'class' => 'inline-flex items-center gap-1.5 rounded-md border border-dashed border-accent-600/70 bg-accent-50 px-2 py-0.5 align-middle text-[0.7rem] font-semibold leading-5 text-accent-900 dark:border-accent-400/60 dark:bg-accent-500/10 dark:text-accent-300',
]) }}>
    <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 8v5M12 16.5h.01" stroke-linecap="round" />
        <circle cx="12" cy="12" r="9" />
    </svg>
    TODO(owner): {{ $label }}
</span>
