import { render, type RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import type { ReactElement, ReactNode } from 'react';
import type { AuthUser, Session } from '@/lib/types';

// Default mock session for authenticated tests
export const mockAuthUser: AuthUser = {
  id: 'test-user-id',
  email: 'bobby@townofAlma.co',
  name: 'Bobby Jensen',
  initials: 'BJ',
  systemPreference: 'all',
  role: 'op',
  roleLabel: 'Lead Operator',
};

export const mockSession: Session = {
  token: 'test-token-123',
  user: mockAuthUser,
  createdAt: Date.now(),
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
};

// Seed localStorage with a mock session before rendering
function seedSession(session: Session) {
  const store = {
    sessions: [session],
    activeSessionId: session.token,
  };
  localStorage.setItem('upstream_sessions', JSON.stringify(store));
}

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}

function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { authenticated?: boolean; session?: Session }
) {
  const { authenticated = true, session, ...renderOptions } = options ?? {};

  // Clear localStorage before each render
  localStorage.clear();

  if (authenticated) {
    seedSession(session ?? mockSession);
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
