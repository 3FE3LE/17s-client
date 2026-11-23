import type { Metadata } from 'next';
import { SectionPending } from '@/components/section-pending';
import { getSection } from '@/lib/sections';
import { isOperator } from '@/lib/operator-access';

const section = getSection('tenants');

export const metadata: Metadata = {
  title: section.label,
  description: section.purpose,
};

export default async function TenantsPage() {
  if (!(await isOperator())) {
    return null;
  }
  return <SectionPending section="tenants" />;
}
