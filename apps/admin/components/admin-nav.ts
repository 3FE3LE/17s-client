import { CreditCard, Gauge, type AppWorkspaceNavItem, type LucideIcon } from '@17suit/ui';
import { consoleSections, type SectionKey } from '@/lib/sections';
import { Building2Icon, ChartColumnIcon, ToggleRightIcon } from './admin-icons';

export const sectionIcons: Record<SectionKey, LucideIcon> = {
  overview: Gauge,
  tenants: Building2Icon,
  'feature-flags': ToggleRightIcon,
  billing: CreditCard,
  analytics: ChartColumnIcon,
};

export const adminNavItems: AppWorkspaceNavItem[] = consoleSections.map((section) => ({
  href: section.href,
  label: section.label,
  icon: sectionIcons[section.key],
  // Pending sections are grouped under the "Próximamente" divider instead of
  // carrying a per-item badge: the divider already says they are not built.
  ...(section.group ? { group: section.group } : {}),
}));
