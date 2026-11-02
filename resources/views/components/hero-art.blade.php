{{-- Decorative hero illustration. Abstract on purpose: no stock photography. --}}
<div class="relative mx-auto w-full max-w-[34rem]" aria-hidden="true">
    <div class="absolute -inset-6 rounded-full hero-glow blur-2xl"></div>
    <div class="absolute -right-10 top-16 h-40 w-40 rounded-full accent-glow blur-2xl"></div>

    <svg class="relative w-full" viewBox="0 0 560 470" fill="none" role="presentation">
        <defs>
            <linearGradient id="heroLine" x1="80" y1="80" x2="480" y2="390" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="rgb(13 148 136)" stop-opacity=".55" />
                <stop offset="1" stop-color="rgb(245 158 11)" stop-opacity=".45" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="rgb(20 184 166)" />
                <stop offset="1" stop-color="rgb(15 118 110)" />
            </linearGradient>
            <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="rgb(15 23 42)" flood-opacity=".16" />
            </filter>
        </defs>

        <path d="M78 96 250 180M470 120 330 205M500 330 360 285M122 386 250 305"
              stroke="url(#heroLine)" stroke-width="1.5" stroke-dasharray="5 7" />
        <path d="M78 96 122 386M470 120 500 330M250 180 360 285"
              stroke="rgb(148 163 184)" stroke-opacity=".25" stroke-width="1.2" />

        <g class="fill-surface-raised stroke-line" filter="url(#cardShadow)">
            <rect x="88" y="112" width="308" height="206" rx="24" stroke-width="1.5" />
        </g>

        <rect x="112" y="138" width="34" height="8" rx="4" class="fill-primary-700" />
        <rect x="112" y="154" width="76" height="5" rx="2.5" class="fill-line" />
        <circle cx="368" cy="142" r="6" class="fill-accent-500" />
        <circle cx="350" cy="142" r="6" class="fill-primary-300" />

        <g>
            <rect x="112" y="180" width="252" height="1.5" class="fill-line" />
            <rect x="112" y="196" width="120" height="7" rx="3.5" class="fill-line" />
            <rect x="112" y="214" width="188" height="7" rx="3.5" class="fill-line" />
            <rect x="112" y="232" width="96" height="7" rx="3.5" class="fill-line" />
        </g>

        <g>
            <rect x="112" y="262" width="34" height="34" rx="8" class="fill-primary-50 dark:fill-primary-500/10" />
            <path d="M123 279h12M129 273v12" stroke="rgb(13 148 136)" stroke-width="2" stroke-linecap="round" />
            <rect x="158" y="268" width="88" height="7" rx="3.5" class="fill-line" />
            <rect x="158" y="284" width="56" height="5" rx="2.5" class="fill-line" />
        </g>

        <g class="fill-surface-raised stroke-line" filter="url(#cardShadow)">
            <rect x="306" y="246" width="188" height="142" rx="22" stroke-width="1.5" />
        </g>
        <rect x="330" y="270" width="64" height="6" rx="3" class="fill-line" />
        <rect x="330" y="284" width="96" height="6" rx="3" class="fill-line" />

        <g>
            <rect x="330" y="316" width="16" height="48" rx="4" fill="url(#barGradient)" />
            <rect x="354" y="332" width="16" height="32" rx="4" class="fill-primary-400" />
            <rect x="378" y="306" width="16" height="58" rx="4" fill="url(#barGradient)" />
            <rect x="402" y="324" width="16" height="40" rx="4" class="fill-primary-300" />
            <rect x="426" y="294" width="16" height="70" rx="4" fill="url(#barGradient)" />
            <rect x="450" y="312" width="16" height="52" rx="4" class="fill-accent-400" />
        </g>

        <g>
            <circle cx="78" cy="96" r="13" class="fill-surface-raised stroke-primary-600" stroke-width="2" />
            <circle cx="78" cy="96" r="4" class="fill-primary-600" />
            <circle cx="470" cy="120" r="13" class="fill-surface-raised stroke-accent-500" stroke-width="2" />
            <circle cx="470" cy="120" r="4" class="fill-accent-500" />
            <circle cx="500" cy="330" r="13" class="fill-surface-raised stroke-primary-600" stroke-width="2" />
            <circle cx="500" cy="330" r="4" class="fill-primary-600" />
            <circle cx="122" cy="386" r="13" class="fill-surface-raised stroke-accent-500" stroke-width="2" />
            <circle cx="122" cy="386" r="4" class="fill-accent-500" />
        </g>
    </svg>

    <div class="absolute -left-2 bottom-16 flex items-center gap-2.5 rounded-xl border border-line bg-surface-raised/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:-left-6">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <x-icon name="check-circle" class="h-4 w-4" />
        </span>
        <div>
            <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted">Payments</p>
            <p class="text-xs font-bold text-ink">M-Pesa ready</p>
        </div>
    </div>

    <div class="absolute -right-2 top-8 flex items-center gap-2 rounded-xl border border-line bg-surface-raised/95 px-3 py-2 shadow-lift backdrop-blur sm:-right-4">
        <span class="relative flex h-2.5 w-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
        </span>
        <p class="text-xs font-semibold text-ink">Network online</p>
    </div>
</div>
