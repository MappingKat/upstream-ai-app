import type { FocusItem, TrendStat, TimelineSection, SnapshotRow } from '@/lib/types';

export const focusItem: FocusItem = {
  eyebrow: "Today's focus · 7:34 AM",
  title: '2 chlorine readings need a NODI code before the March DMR is ready.',
  subtitle: 'Mar 11 (block 04:00–08:00) unresolved · Mar 19 (block 12:00–16:00) pending review · everything else is on track.',
  ctaLabel: 'Resolve gaps →',
  ctaHref: '/dmr-prep',
  variant: 'warn',
};

export const trendStats: TrendStat[] = [
  {
    label: 'On track YTD',
    value: 7,
    unit: '/ 7 filings',
    delta: { value: '100%', direction: 'up' },
    note: 'All Q1 MOR + DMR + annual reports filed on time',
    accentColor: 'var(--color-green)',
  },
  {
    label: 'Due in 30 days',
    value: 3,
    unit: 'reports',
    delta: { value: 'flat', direction: 'flat' },
    note: 'March MOR · March DMR · Q1 DBP report',
    accentColor: 'var(--color-yellow)',
  },
  {
    label: 'Open data gaps',
    value: 2,
    unit: 'Cl₂ readings',
    delta: { value: '↑ 2', direction: 'down' },
    note: 'Mar 11 unresolved · Mar 19 pending review',
    accentColor: 'var(--color-red)',
    modeVisibility: 'ww',
  },
  {
    label: 'Cl₂ residual trend',
    value: '0.82',
    unit: 'mg/L min',
    delta: { value: '−14%', direction: 'down' },
    note: 'vs. Feb 0.96 · tight to 0.2 limit',
    accentColor: 'var(--color-accent)',
    modeVisibility: 'dw',
  },
];

export const timelineSections: TimelineSection[] = [
  {
    label: 'This week',
    variant: 'imminent',
    items: [
      {
        date: { day: 10, month: 'Apr' },
        title: 'March MOR — Drinking Water',
        subtitle: 'CDPHE · wqcdcompliance.com · Gary submits',
        tag: { label: '7 days', color: 'var(--color-red)', bgColor: 'var(--color-red-bg)' },
        modeVisibility: 'dw',
        href: '/mor-prep',
      },
      {
        date: { day: 8, month: 'Apr' },
        title: 'Weekly BOD₅ + TSS sample pickup',
        subtitle: 'Colorado Analytical · scheduled 8:00 AM',
        tag: { label: 'lab', color: 'var(--color-text-mid)', bgColor: 'var(--color-bg)' },
        modeVisibility: 'ww',
      },
    ],
  },
  {
    label: 'Next 30 days',
    variant: 'upcoming',
    items: [
      {
        date: { day: 28, month: 'Apr' },
        title: 'March DMR — Wastewater',
        subtitle: 'NetDMR · COG591177 · 25 days · ⚠ resolve gaps first',
        tag: { label: '2 gaps', color: 'var(--color-yellow)', bgColor: 'var(--color-yellow-bg)' },
        modeVisibility: 'ww',
        href: '/dmr-prep',
      },
      {
        date: { day: 30, month: 'Apr' },
        title: 'Q1 Disinfection Byproducts',
        subtitle: 'Quarterly · lab results pending from Colorado Analytical',
        tag: { label: 'TTHM·HAA5', color: 'var(--color-yellow)', bgColor: 'var(--color-yellow-bg)' },
        modeVisibility: 'dw',
      },
    ],
  },
  {
    label: 'Future',
    variant: 'future',
    items: [
      {
        date: { day: 1, month: 'Jul' },
        title: 'Consumer Confidence Report (CCR)',
        subtitle: 'Mailed to all 270 residents · public-facing summary',
        tag: { label: 'annual', color: 'var(--color-purple)', bgColor: 'var(--color-purple-bg)' },
        modeVisibility: 'dw',
      },
      {
        date: { day: 15, month: 'Sep' },
        title: 'Operator certification renewal — Bobby',
        subtitle: 'Class D wastewater · CDPHE Operator Certification Program',
        tag: { label: 'cert', color: 'var(--color-purple)', bgColor: 'var(--color-purple-bg)' },
        modeVisibility: 'ww',
      },
    ],
  },
];

export const snapshotRows: SnapshotRow[] = [
  { label: 'Population served', value: '~270 residents' },
  { label: 'DW system class', value: 'CWS · bag/cartridge + Cl₂', modeVisibility: 'dw' },
  { label: 'WW system class', value: '3-cell aerated lagoon', modeVisibility: 'ww' },
  { label: 'Operator on duty', value: 'Bobby J. · since 6:00 AM' },
  { label: 'Last MOR submitted', value: 'Feb · Mar 7 (on time) ✓', status: 'ok', modeVisibility: 'dw' },
  { label: 'Last DMR submitted', value: 'Feb · Mar 26 (2d early) ✓', status: 'ok', modeVisibility: 'ww' },
  { label: 'Next renewal', value: 'CDPS permit · 2028' },
];
