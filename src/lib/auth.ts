import type { AuthUser, Session, SessionStore, UserPreferences, UserRole } from './types';

// ── Config ──

export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const STORAGE_SESSIONS = 'upstream_sessions';
const STORAGE_PREFERENCES = 'upstream_preferences';
const STORAGE_PENDING = 'upstream_pending_tokens';

// ── SSR guard ──

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// ── Helpers ──

export function deriveInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

export function deriveRoleLabel(role: UserRole): string {
  return role === 'op' ? 'Lead Operator' : 'Public Works Manager';
}

// ── Token functions ──

export function generateToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

interface PendingToken {
  token: string;
  user: AuthUser;
  createdAt: number;
}

function getPendingTokens(): PendingToken[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_PENDING);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingTokens(tokens: PendingToken[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_PENDING, JSON.stringify(tokens));
}

export function storePendingToken(token: string, user: AuthUser): void {
  const tokens = getPendingTokens();
  tokens.push({ token, user, createdAt: Date.now() });
  savePendingTokens(tokens);
}

export function verifyToken(token: string): { valid: true; user: AuthUser } | { valid: false } {
  const tokens = getPendingTokens();
  const idx = tokens.findIndex((t) => t.token === token);
  if (idx === -1) return { valid: false };
  const pending = tokens[idx];
  // Remove token (one-time use)
  tokens.splice(idx, 1);
  savePendingTokens(tokens);
  return { valid: true, user: pending.user };
}

// ── Session functions ──

export function getSessionStore(): SessionStore {
  if (!hasStorage()) return { sessions: [], activeSessionId: null };
  try {
    const raw = localStorage.getItem(STORAGE_SESSIONS);
    return raw ? JSON.parse(raw) : { sessions: [], activeSessionId: null };
  } catch {
    return { sessions: [], activeSessionId: null };
  }
}

function saveSessionStore(store: SessionStore): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(store));
}

export function createSession(user: AuthUser): Session {
  const now = Date.now();
  const session: Session = {
    token: generateToken(),
    user,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
  const store = getSessionStore();
  store.sessions.push(session);
  store.activeSessionId = session.token;
  saveSessionStore(store);
  return session;
}

export function getActiveSession(): Session | null {
  const store = getSessionStore();
  if (!store.activeSessionId) return null;
  return store.sessions.find((s) => s.token === store.activeSessionId) ?? null;
}

export function isSessionExpired(session: Session): boolean {
  return Date.now() > session.expiresAt;
}

export function setActiveSession(token: string): void {
  const store = getSessionStore();
  const exists = store.sessions.some((s) => s.token === token);
  if (!exists) return;
  store.activeSessionId = token;
  saveSessionStore(store);
}

export function removeSession(token: string): void {
  const store = getSessionStore();
  store.sessions = store.sessions.filter((s) => s.token !== token);
  if (store.activeSessionId === token) {
    store.activeSessionId = store.sessions[0]?.token ?? null;
  }
  saveSessionStore(store);
}

export function getAllSessions(): Session[] {
  const store = getSessionStore();
  return store.sessions.filter((s) => !isSessionExpired(s));
}

// ── Preferences ──

export function savePreferences(prefs: UserPreferences): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_PREFERENCES, JSON.stringify(prefs));
}

export function loadPreferences(): UserPreferences | null {
  if (!hasStorage()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFERENCES);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
