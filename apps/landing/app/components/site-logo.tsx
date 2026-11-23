import Image from 'next/image';
import Link from 'next/link';

/** Logo link to home. Safe in client components (no server-only imports). */
export function SiteLogo() {
  return (
    <Link href="/" className="inline-flex min-h-11 shrink-0 items-center rounded-md no-underline">
      <Image
        src="/logo-17suit@4x.svg"
        alt="17Suit, inicio"
        width={196}
        height={62}
        className="h-[32px] w-auto md:h-[40px] dark:brightness-0 dark:invert"
        priority
      />
    </Link>
  );
}
