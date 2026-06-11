import type { NavSection } from '@/lib/types';

export const navSections: NavSection[] = [
  {
    title: 'Compliance',
    items: [
      { icon: '🏠', label: 'Compliance Home', href: '/' },
      { icon: '📅', label: 'Calendar', href: '/calendar' },
      { icon: '📋', label: 'DMR Prep', href: '/dmr-prep', modeVisibility: 'ww', badge: { label: '2 gaps', variant: 'warn' } },
      { icon: '📝', label: 'MOR Prep', href: '/mor-prep', modeVisibility: 'dw' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { icon: '✏️', label: 'Daily Log', href: '/daily-log' },
      { icon: '🧪', label: 'Lab Samples', href: '/lab-samples', isNew: true },
      { icon: '📈', label: 'Trends', href: '/trends' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { icon: '📂', label: 'Documents', href: '/documents' },
      { icon: '💬', label: 'Ask Upstream', href: '/ask' },
      { icon: '🔌', label: 'Integrations', href: '/integrations' },
    ],
  },
];
