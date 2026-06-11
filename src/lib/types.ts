export type SystemMode = 'all' | 'dw' | 'ww';
export type UserRole = 'op' | 'mgr';
export type SyncState = 'synced' | 'offline' | 'stale';

export interface User {
  initials: string;
  name: string;
  roleLabel: string;
}

export interface District {
  name: string;
  pwsId: string;
  cdpsPermit: string;
  population: number;
  dwSystemClass: string;
  wwSystemClass: string;
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  modeVisibility?: 'dw' | 'ww';
  badge?: { label: string; variant: 'default' | 'warn' };
  isNew?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface FocusItem {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  variant: 'warn' | 'ok';
}

export interface TrendStat {
  label: string;
  value: string | number;
  unit: string;
  delta: { value: string; direction: 'up' | 'down' | 'flat' };
  note: string;
  accentColor: string;
  modeVisibility?: 'dw' | 'ww';
}

export interface TimelineItem {
  date: { day: number; month: string };
  title: string;
  subtitle: string;
  tag?: { label: string; color: string; bgColor: string };
  modeVisibility?: 'dw' | 'ww';
  href?: string;
}

export interface TimelineSection {
  label: string;
  variant: 'imminent' | 'upcoming' | 'future';
  items: TimelineItem[];
}

export interface IntegrationHealth {
  name: string;
  status: 'healthy' | 'warn' | 'down';
  statusText: string;
  meta: string[];
}

export interface SnapshotRow {
  label: string;
  value: string;
  status?: 'ok' | 'warn';
  modeVisibility?: 'dw' | 'ww';
}

export interface SyncStateConfig {
  cls: SyncState;
  label: string;
  detail: string;
  count: string;
}

// ── Auth types ──

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  systemPreference: SystemMode;
  role: UserRole;
  roleLabel: string;
}

export interface Session {
  token: string;
  user: AuthUser;
  createdAt: number;
  expiresAt: number;
}

export interface SessionStore {
  sessions: Session[];
  activeSessionId: string | null;
}

export interface UserPreferences {
  mode: SystemMode;
  role: UserRole;
}
