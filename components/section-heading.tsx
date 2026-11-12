type Props = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
  level?: 'h1' | 'h2';
};

export function SectionHeading({ eyebrow, title, text, align = 'left', level: Heading = 'h2' }: Props) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className={`eyebrow ${centered ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <Heading className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</Heading>
      {text && <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{text}</p>}
    </div>
  );
}
