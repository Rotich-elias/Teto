type Tone = 'light' | 'dark';

/**
 * Decorative animated background: a slowly drifting dot grid plus three
 * blurred "aurora" orbs (teal, amber, deep teal). Purely presentational —
 * hidden from assistive tech and never intercepts pointer events. The
 * animation is transform-only and disabled by the global
 * `prefers-reduced-motion` rule.
 *
 * Place inside a `relative overflow-hidden` section, behind the content.
 */
export function AnimatedBackground({
  tone = 'light',
  mask = true,
  className = '',
}: {
  tone?: Tone;
  mask?: boolean;
  className?: string;
}) {
  const gridOpacity = tone === 'dark' ? 'opacity-[0.14]' : 'opacity-50';
  const orbOpacity = tone === 'dark' ? 'opacity-60' : 'opacity-40';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        mask ? '[mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]' : ''
      } ${className}`}
    >
      <div className={`absolute -inset-[22px] animate-grid-drift dot-grid-drift ${gridOpacity}`} />

      <div className={`absolute -left-[12%] -top-[16%] h-[26rem] w-[26rem] rounded-full aurora-teal blur-3xl animate-drift-a ${orbOpacity}`} />
      <div className={`absolute -right-[10%] top-[4%] h-[22rem] w-[22rem] rounded-full aurora-amber blur-3xl animate-drift-b ${orbOpacity}`} />
      <div className={`absolute -bottom-[18%] left-[22%] h-[24rem] w-[24rem] rounded-full aurora-deep blur-3xl animate-drift-c ${orbOpacity}`} />
    </div>
  );
}
