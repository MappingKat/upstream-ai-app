'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { SystemMode, UserRole, User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { loadPreferences, savePreferences } from '@/lib/auth';
import { users } from '@/data/users';

interface AppContextValue {
  mode: SystemMode;
  setMode: (mode: SystemMode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [mode, setModeState] = useState<SystemMode>('all');
  const [role, setRoleState] = useState<UserRole>('op');
  const [initialized, setInitialized] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs) {
      setModeState(prefs.mode);
      setRoleState(prefs.role);
    }
    setInitialized(true);
  }, []);

  // Derive display user from Supabase user or fallback to hardcoded
  const currentUser: User = user
    ? {
        initials: (user.user_metadata?.full_name || user.email || 'U')
          .split(/\s+/)
          .map((w: string) => w[0]?.toUpperCase() ?? '')
          .join('')
          .slice(0, 2),
        name: user.user_metadata?.full_name || user.email || 'User',
        roleLabel: `${role === 'op' ? 'Operator' : 'Manager'} · signed in`,
      }
    : role === 'op' ? users.operator : users.manager;

  const setMode = useCallback((m: SystemMode) => {
    setModeState(m);
    if (initialized) savePreferences({ mode: m, role });
  }, [initialized, role]);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    if (initialized) savePreferences({ mode, role: r });
  }, [initialized, mode]);

  return (
    <AppContext.Provider value={{ mode, setMode, role, setRole, currentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
