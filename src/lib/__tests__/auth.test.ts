import {
  generateToken,
  storePendingToken,
  verifyToken,
  createSession,
  getActiveSession,
  isSessionExpired,
  setActiveSession,
  removeSession,
  getAllSessions,
  savePreferences,
  loadPreferences,
  deriveInitials,
  deriveRoleLabel,
  SESSION_DURATION_MS,
} from '@/lib/auth';
import type { AuthUser } from '@/lib/types';

const mockUser: AuthUser = {
  id: 'test-123',
  email: 'test@example.com',
  name: 'Test User',
  initials: 'TU',
  systemPreference: 'all',
  role: 'op',
  roleLabel: 'Lead Operator',
};

beforeEach(() => {
  localStorage.clear();
});

describe('deriveInitials', () => {
  it('derives initials from two-word name', () => {
    expect(deriveInitials('Bobby Jensen')).toBe('BJ');
  });

  it('derives initials from single name', () => {
    expect(deriveInitials('Bobby')).toBe('B');
  });

  it('handles extra whitespace', () => {
    expect(deriveInitials('  Bobby   Jensen  ')).toBe('BJ');
  });

  it('handles three-word name (takes first two)', () => {
    expect(deriveInitials('Mary Jane Watson')).toBe('MJ');
  });

  it('handles empty string', () => {
    expect(deriveInitials('')).toBe('');
  });
});

describe('deriveRoleLabel', () => {
  it('returns Lead Operator for "op"', () => {
    expect(deriveRoleLabel('op')).toBe('Lead Operator');
  });

  it('returns Public Works Manager for "mgr"', () => {
    expect(deriveRoleLabel('mgr')).toBe('Public Works Manager');
  });
});

describe('generateToken', () => {
  it('returns a string', () => {
    expect(typeof generateToken()).toBe('string');
  });

  it('returns unique tokens', () => {
    const t1 = generateToken();
    const t2 = generateToken();
    expect(t1).not.toBe(t2);
  });
});

describe('storePendingToken + verifyToken', () => {
  it('stores and verifies a token', () => {
    const token = 'test-token';
    storePendingToken(token, mockUser);
    const result = verifyToken(token);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.user.email).toBe('test@example.com');
    }
  });

  it('returns invalid for unknown token', () => {
    const result = verifyToken('unknown');
    expect(result.valid).toBe(false);
  });

  it('token is one-time use', () => {
    const token = 'one-time';
    storePendingToken(token, mockUser);
    expect(verifyToken(token).valid).toBe(true);
    expect(verifyToken(token).valid).toBe(false);
  });

  it('handles multiple pending tokens', () => {
    storePendingToken('a', mockUser);
    storePendingToken('b', { ...mockUser, email: 'b@test.com' });
    expect(verifyToken('a').valid).toBe(true);
    expect(verifyToken('b').valid).toBe(true);
  });
});

describe('session management', () => {
  it('createSession adds session and sets active', () => {
    const session = createSession(mockUser);
    expect(session.token).toBeTruthy();
    expect(session.user.email).toBe('test@example.com');
    expect(session.expiresAt).toBe(session.createdAt + SESSION_DURATION_MS);

    const active = getActiveSession();
    expect(active).not.toBeNull();
    expect(active!.token).toBe(session.token);
  });

  it('getActiveSession returns null when no sessions', () => {
    expect(getActiveSession()).toBeNull();
  });

  it('isSessionExpired returns false for fresh session', () => {
    const session = createSession(mockUser);
    expect(isSessionExpired(session)).toBe(false);
  });

  it('isSessionExpired returns true for expired session', () => {
    const session = createSession(mockUser);
    session.expiresAt = Date.now() - 1000;
    expect(isSessionExpired(session)).toBe(true);
  });

  it('setActiveSession switches active session', () => {
    const s1 = createSession(mockUser);
    const s2 = createSession({ ...mockUser, email: 's2@test.com' });
    expect(getActiveSession()!.token).toBe(s2.token);

    setActiveSession(s1.token);
    expect(getActiveSession()!.token).toBe(s1.token);
  });

  it('setActiveSession does nothing for unknown token', () => {
    const s1 = createSession(mockUser);
    setActiveSession('nonexistent');
    expect(getActiveSession()!.token).toBe(s1.token);
  });

  it('removeSession removes session and clears active', () => {
    const session = createSession(mockUser);
    removeSession(session.token);
    expect(getActiveSession()).toBeNull();
  });

  it('removeSession falls back to first remaining session', () => {
    const s1 = createSession(mockUser);
    const s2 = createSession({ ...mockUser, email: 's2@test.com' });
    removeSession(s2.token);
    expect(getActiveSession()!.token).toBe(s1.token);
  });

  it('getAllSessions filters expired sessions', () => {
    const s1 = createSession(mockUser);
    const s2 = createSession({ ...mockUser, email: 's2@test.com' });
    // Manually expire s1
    const raw = JSON.parse(localStorage.getItem('upstream_sessions')!);
    raw.sessions[0].expiresAt = Date.now() - 1000;
    localStorage.setItem('upstream_sessions', JSON.stringify(raw));

    const all = getAllSessions();
    expect(all).toHaveLength(1);
    expect(all[0].token).toBe(s2.token);
  });
});

describe('preferences', () => {
  it('saves and loads preferences', () => {
    savePreferences({ mode: 'dw', role: 'mgr' });
    const prefs = loadPreferences();
    expect(prefs).toEqual({ mode: 'dw', role: 'mgr' });
  });

  it('returns null when no preferences saved', () => {
    expect(loadPreferences()).toBeNull();
  });

  it('overwrites previous preferences', () => {
    savePreferences({ mode: 'dw', role: 'op' });
    savePreferences({ mode: 'ww', role: 'mgr' });
    expect(loadPreferences()).toEqual({ mode: 'ww', role: 'mgr' });
  });
});
