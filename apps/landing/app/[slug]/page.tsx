import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const products = {
  'seven-reservations-club': 'Seven Reservations Club',
  'six-sense-proof': 'Six Sense Proof',
  'five-barber-go': 'Five Barber Go',
  'nine-to-nine-nurse': 'Nine To Nine Nurse',
  'two-split-bill': 'Two Split Bill',
  'one-plan-trip': 'One Plan Trip',
  'four-you-closet': 'Four You Closet',
  'eight-dream-dishes': 'Eight Dream Dishes',
} as const;

type ProductSlug = keyof typeof products;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: ProductSlug }>> {
  const slugs = await Promise.resolve(Object.keys(products) as ProductSlug[]);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = products[slug as ProductSlug];

  if (!name) {
    return { title: 'Product not found | 17Suit' };
  }

  return {
    title: `${name} | 17Suit`,
    description: `${name} product overview on 17suit.com/${slug}`,
  };
}

export default async function ProductLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const name = products[slug as ProductSlug];

  if (!name) {
    notFound();
  }

  return (
    <main
      style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px', fontFamily: 'system-ui' }}
    >
      <a href="/" style={{ color: '#0E7490' }}>
        Back to 17Suit
      </a>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>{name}</h1>
      <p style={{ color: '#475569' }}>
        This route is reserved for product marketing content, SEO pages, and campaign-specific
        pages.
      </p>
    </main>
  );
}
