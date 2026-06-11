'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="text-center">
          <div className="text-xl font-semibold text-navy tracking-tight mb-2">
            <em className="font-serif italic font-bold text-accent">Upstream</em> AI
          </div>
          <div className="text-xs text-text-mid">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-[22px] py-5 max-[900px]:px-3.5 max-[900px]:py-3.5">
          {children}
        </div>
      </main>
    </div>
  );
}
