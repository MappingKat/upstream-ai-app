import type { IntegrationHealth } from '@/lib/types';

export const integrations: IntegrationHealth[] = [
  {
    name: 'SCADA',
    status: 'healthy',
    statusText: 'Healthy · streaming',
    meta: ['Last sync: 0:02 ago', '8,928 points / day'],
  },
  {
    name: 'Lab inbox (CAL)',
    status: 'warn',
    statusText: 'Slow · 2 pending',
    meta: ['Last return: 18h ago', 'Expected by Apr 4 EOD'],
  },
  {
    name: 'CDPHE portal',
    status: 'healthy',
    statusText: 'Healthy',
    meta: ['Last submit: 8d ago', 'wqcdcompliance.com'],
  },
  {
    name: 'NetDMR',
    status: 'healthy',
    statusText: 'Healthy',
    meta: ['Last submit: 9d ago', 'EPA · COG591177'],
  },
  {
    name: 'Email',
    status: 'healthy',
    statusText: 'Healthy',
    meta: ['Last alert: 2d ago', '3 recipients'],
  },
];
