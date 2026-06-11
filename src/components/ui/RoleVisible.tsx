'use client';

import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';

export function RoleVisible({ show, children }: { show: 'op' | 'mgr'; children: ReactNode }) {
  const { role } = useApp();
  if (role === show) return <>{children}</>;
  return null;
}
