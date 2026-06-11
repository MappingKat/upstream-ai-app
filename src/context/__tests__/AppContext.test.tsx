import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('AppContext', () => {
  it('defaults mode to "all"', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    expect(result.current.mode).toBe('all');
  });

  it('defaults role to "op"', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    expect(result.current.role).toBe('op');
  });

  it('provides currentUser', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    expect(result.current.currentUser).toBeDefined();
    expect(result.current.currentUser.name).toBeTruthy();
  });

  it('changes mode', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    act(() => result.current.setMode('ww'));
    expect(result.current.mode).toBe('ww');
  });

  it('changes role', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    act(() => result.current.setRole('mgr'));
    expect(result.current.role).toBe('mgr');
  });

  it('persists preferences to localStorage', async () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    act(() => result.current.setMode('dw'));
    const prefs = JSON.parse(localStorage.getItem('upstream_preferences')!);
    expect(prefs.mode).toBe('dw');
  });

  it('loads preferences from localStorage', async () => {
    localStorage.setItem('upstream_preferences', JSON.stringify({ mode: 'ww', role: 'mgr' }));
    const { result } = renderHook(() => useApp(), { wrapper });
    await act(async () => {});
    expect(result.current.mode).toBe('ww');
    expect(result.current.role).toBe('mgr');
  });

  it('throws when used outside AppProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useApp());
    }).toThrow('useApp must be used within AppProvider');
    spy.mockRestore();
  });
});
