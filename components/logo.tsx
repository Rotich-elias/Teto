import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images/teto-logo.png';

export function Logo({ className = 'h-12 w-auto' }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center rounded-lg" aria-label="Teto Technologies — home">
      <Image src={logo} alt="Teto Technologies" className={`${className} rounded-md object-contain`} priority />
    </Link>
  );
}
