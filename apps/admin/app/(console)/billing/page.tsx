import type { Metadata } from 'next';
import { SectionPending } from '@/components/section-pending';
import { getSection } from '@/lib/sections';
import { isOperator } from '@/lib/operator-access';

const section = getSection('billing');

export const metadata: Metadata = {
  title: section.label,
  description: section.purpose,
};

export default async function BillingPage() {
  if (!(await isOperator())) {
    return null;
  }
  return <SectionPending section="billing" />;
}
