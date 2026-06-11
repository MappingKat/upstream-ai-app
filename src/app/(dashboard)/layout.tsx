'use client';

import { AppShell } from '@/components/layout/AppShell';
import { ChatDrawer } from '@/components/chat/ChatDrawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <ChatDrawer />
    </>
  );
}
