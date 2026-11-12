/** Clearly marked placeholder for details the owner has not supplied yet. */
export function Todo({ label = 'details', className = '' }: { label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-dashed border-accent-600/70 bg-accent-50 px-2 py-0.5 align-middle text-[0.7rem] font-semibold leading-5 text-accent-900 dark:border-accent-400/60 dark:bg-accent-500/10 dark:text-accent-300 ${className}`}
    >
      <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 8v5M12 16.5h.01" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      TODO(owner): {label}
    </span>
  );
}

/** Render the value when present, otherwise a TODO placeholder. */
export function OrTodo({ value, label }: { value: string | null | undefined; label: string }) {
  return value ? <>{value}</> : <Todo label={label} />;
}
