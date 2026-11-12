/** Shared hero for inner pages (dot grid, eyebrow, title, lead text). */
export function PageHero({
  eyebrow,
  title,
  lead,
  glow,
  compact = false,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  glow?: 'accent';
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/60">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      {glow === 'accent' && <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full accent-glow blur-3xl" />}
      <div className={`container-page relative ${compact ? 'py-14 sm:py-16' : 'py-14 sm:py-20'}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{lead}</p>
        {children}
      </div>
    </section>
  );
}
