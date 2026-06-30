import { ReviewScreen } from '@/components/fifteen-ac-data';

export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  return <ReviewScreen focus={view === 'focus'} />;
}
