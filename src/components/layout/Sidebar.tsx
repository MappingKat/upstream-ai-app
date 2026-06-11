'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useConnectivity } from '@/lib/useConnectivity';
import { district } from '@/data/district';
import { navSections } from '@/data/navigation';
import type { SystemMode, UserRole } from '@/lib/types';

function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <button
      onClick={() => signOut()}
      className="mt-2 w-full text-[10px] text-white/45 hover:text-white/80 font-medium cursor-pointer bg-transparent border-none text-left px-0 py-1 transition-colors"
    >
      Sign out
    </button>
  );
}

// Routes that are mode-specific — if user is on one of these and switches mode, redirect to home
const modeRoutes: Record<string, 'dw' | 'ww'> = {
  '/dmr-prep': 'ww',
  '/mor-prep': 'dw',
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode, role, setRole, currentUser } = useApp();
  const { status, queuedCount, lastSyncLabel } = useConnectivity();

  const syncLabel = status === 'online'
    ? 'Synced'
    : status === 'offline'
    ? `Working offline${queuedCount > 0 ? ` · ${queuedCount} queued` : ''}${lastSyncLabel ? ` · ${lastSyncLabel}` : ''}`
    : `Offline 6h+${lastSyncLabel ? ` · ${lastSyncLabel}` : ''}`;

  const syncColor = status === 'online' ? 'text-water' : status === 'offline' ? 'text-yellow' : 'text-red';

  return (
    <aside className="w-[220px] h-full bg-navy flex flex-col shrink-0 overflow-y-auto max-[900px]:hidden">
      {/* Brand */}
      <div className="px-5 pt-[22px] pb-4 border-b border-white/[0.12]">
        <div className="text-xl font-semibold text-white tracking-tight">
          <em className="font-serif italic font-bold text-water not-italic">Upstream</em> AI
        </div>
        <div className="text-[10px] text-white/55 mt-0.5 uppercase tracking-[1.2px]">
          Compliance Intelligence
        </div>
      </div>

      {/* District */}
      <div className="mx-3.5 my-3 bg-white/[0.08] rounded-lg px-3 py-2.5">
        <div className="text-sm font-semibold text-white">{district.name}</div>
        <div className="text-[10px] text-white/55 mt-px">PWS {district.pwsId} · {district.cdpsPermit}</div>
        <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-medium ${syncColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'pulse-dot 2s infinite' }} />
          {syncLabel}
        </div>
      </div>

      {/* System Mode Toggle */}
      <div className="px-3.5 py-3 border-b border-white/[0.08]">
        <div className="text-[9px] font-bold text-white/50 uppercase tracking-[1.2px] mb-1.5 flex items-center gap-1.5">
          System view
        </div>
        <div className="flex bg-black/25 rounded-[7px] p-[3px] gap-px">
          {([['all', '⚭', 'All'], ['dw', '💧', 'DW'], ['ww', '🌊', 'WW']] as const).map(([m, icon, label]) => (
            <button
              key={m}
              onClick={() => {
                setMode(m as SystemMode);
                // If current page is hidden by the new mode, redirect to home
                const currentRouteMode = modeRoutes[pathname];
                if (currentRouteMode && m !== 'all' && currentRouteMode !== m) {
                  router.push('/');
                }
              }}
              className={`flex-1 py-[7px] px-1.5 text-[10px] font-semibold rounded-[5px] uppercase tracking-[0.6px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none ${
                mode === m
                  ? 'bg-water/15 text-water shadow-[inset_0_0_0_1px_rgba(168,230,207,0.3)]'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              <span className="text-[11px]">{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>

      {/* Role Toggle */}
      <div className="px-3.5 pt-2.5 pb-3 border-b border-white/[0.08]">
        <div className="text-[9px] font-bold text-white/50 uppercase tracking-[1.2px] mb-1.5">Role view</div>
        <div className="flex bg-black/25 rounded-[7px] p-[3px] gap-px">
          {([['op', '🔧', 'Operator'], ['mgr', '📊', 'Manager']] as const).map(([r, icon, label]) => (
            <button
              key={r}
              onClick={() => setRole(r as UserRole)}
              className={`flex-1 py-[7px] px-1.5 text-[10px] font-semibold rounded-[5px] uppercase tracking-[0.6px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none ${
                role === r
                  ? 'bg-water/[0.18] text-water shadow-[inset_0_0_0_1px_rgba(168,230,207,0.35)]'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              <span className="text-[11px]">{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>

      {/* Nav Sections */}
      {navSections.map((section) => (
        <div key={section.title}>
          <div className="px-4 pt-3.5 pb-1 text-[10px] font-bold text-white/45 uppercase tracking-[1.5px]">
            {section.title}
          </div>
          {section.items.map((item) => {
            // Hide items based on mode
            if (item.modeVisibility === 'dw' && mode === 'ww') return null;
            if (item.modeVisibility === 'ww' && mode === 'dw') return null;

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 py-2.5 px-3.5 mx-2 rounded-lg text-base font-medium no-underline select-none ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/75 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span className="text-base w-4 text-center shrink-0">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-[10px] font-bold rounded-[10px] px-1.5 py-0.5 ${
                    item.badge.variant === 'warn'
                      ? 'bg-[#f59e0b] text-white'
                      : 'bg-water text-navy-dark'
                  }`}>
                    {item.badge.label}
                  </span>
                )}
                {item.isNew && (
                  <span className="ml-auto bg-purple text-white text-[9px] font-bold rounded-[10px] px-1.5 py-0.5 tracking-[0.5px]">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* User Footer */}
      <div className="mt-auto px-4 py-3.5 border-t border-white/[0.12]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-water flex items-center justify-center text-xs font-bold text-navy-dark shrink-0">
            {currentUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{currentUser.name}</div>
            <div className="text-[10px] text-white/55">{currentUser.roleLabel}</div>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
