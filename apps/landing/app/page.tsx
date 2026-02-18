'use client';

import Link from 'next/link';
import { AppButton, AppFrame } from '@17suit/ui';

const products = [
  { slug: 'seven-reservations-club', name: 'Seven Reservations Club' },
  { slug: 'six-sense-proof', name: 'Six Sense Proof' },
  { slug: 'five-barber-go', name: 'Five Barber Go' },
  { slug: 'nine-to-nine-nurse', name: 'Nine To Nine Nurse' },
  { slug: 'two-split-bill', name: 'Two Split Bill' },
  { slug: 'one-plan-trip', name: 'One Plan Trip' },
  { slug: 'four-you-closet', name: 'Four You Closet' },
  { slug: 'eight-dream-dishes', name: 'Eight Dream Dishes' },
];

export default function HomePage() {
  return (
    <AppFrame
      appName="Marketing Site"
      subtitle="17suit.com host for SEO and product landing pages."
    >
      <AppButton>Shared Tamagui Button</AppButton>
      {products.map((product) => (
        <Link key={product.slug} href={`/${product.slug}`}>
          {product.name}
        </Link>
      ))}
    </AppFrame>
  );
}
