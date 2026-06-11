'use client';

import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';

export function ModeVisible({ show, children }: { show: 'dw' | 'ww'; children: ReactNode }) {
  const { mode } = useApp();
  if (mode === 'all') return <>{children}</>;
  if (mode === show) return <>{children}</>;
  return null;
}
