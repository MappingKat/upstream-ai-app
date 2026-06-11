import type { User } from '@/lib/types';

export const users = {
  operator: {
    initials: 'BJ',
    name: 'Bobby Jensen',
    roleLabel: 'Lead Operator · signed in',
  } satisfies User,
  manager: {
    initials: 'KW',
    name: 'Kat White',
    roleLabel: 'Public Works · signed in',
  } satisfies User,
};
