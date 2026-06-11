# Upstream AI — Compliance Dashboard v2

> Persistent project memory for Claude Code. Read this file at the start of every session.

---

## What This Is

Upstream AI is an operator-first compliance dashboard for small water & wastewater utilities (1–5 staff). This is v2 — a ground-up rebuild with a compliance reporting focus, replacing the v1 at `/Documents/upstream-ai/mvp-dashboardv1`.

**Pilot utility:** Town of Alma, Colorado (PWS CO0147001, CDPS COG591177, ~270 residents)
- DW system: CWS · bag/cartridge + Cl₂
- WW system: 3-cell aerated lagoon

**Design reference:** `/reference/mockup.html` (3,816-line interactive prototype, v13 operator-first redesign)

---

## Current Status

### Phase 1: UI Foundation ✅ COMPLETE
- Next.js 16 + React 19 + Tailwind CSS 4 scaffolded
- Custom design tokens (navy/water/accent color system, Inter/Playfair/DM Mono fonts)
- React Context for global state (AppContext + AuthContext)
- ModeVisible/RoleVisible conditional rendering components
- AppShell layout (Sidebar with DW/WW toggle + Operator/Manager toggle, TopBar with sync state)

### Phase 2: Home Page ✅ COMPLETE
All 8 sections from mockup implemented:
- FocusHero (today's focus banner)
- StateFormCard (one-click DMR/MOR form status)
- TrendsStrip (4 KPI stat cards)
- ForecastChart (SVG 6-month trend + 8-week forecast with violation prediction)
- IntegrationsStrip (5-system health status)
- Timeline (coming up: this week / 30 days / future)
- AtAGlance (facility snapshot)
- QuickActions (shortcut grid)

### Phase 3: Auth + Offline Caching ✅ COMPLETE (localStorage stub)
- Magic link login flow (email + name + system pref + role)
- Token generation + verification (one-time use)
- 30-day sessions in localStorage
- Preferences persistence (mode/role)
- Auth guard in AppShell (redirect to /login if no session)
- Expired session banner (non-blocking)
- Sign out in sidebar

### Phase 4: All Dashboard Pages ✅ COMPLETE
All 9 additional pages built matching mockup:
- `/calendar` — Month grid with DW/WW event chips
- `/dmr-prep` — 3-step WW workflow (gaps → calculations → certify)
- `/mor-prep` — DW parameter table + operator certification
- `/daily-log` — SCADA auto-fill grid with DW/WW sections
- `/lab-samples` — Disposition summary + filterable sample table
- `/trends` — 12-month SVG charts with permit limits
- `/documents` — Facility docs + CDPHE references
- `/ask` — AI chat placeholder with demo conversation
- `/integrations` — 5 integration cards with health/stats

### Phase 5: Supabase Integration ✅ COMPLETE
- Supabase client/server/service setup (`lib/supabase/`)
- Middleware for server-side session refresh + auth redirects
- Supabase magic link OTP replacing localStorage auth
- `/auth/callback` route for code exchange
- `.env.local` with all credentials (Supabase, Anthropic, Voyage, PostHog)
- Fresh database schema (`supabase/migrations/00001_initial_schema.sql`) — adapted from v1 with compliance-specific tables (lab_samples, compliance_reports, data_gaps, compliance_deadlines)
- Full RLS policies + hybrid search function

### Phase 6: AI Agent Integration ✅ COMPLETE
- `/api/document-chat` — Claude API + Voyage AI hybrid RAG (Mode A/B)
- `/api/extract` — PDF/DOCX text extraction + chunking + Voyage embeddings
- ChatDrawer UI component (floating pill → expandable chat panel on all dashboard pages)
- System prompts: document-grounded (Mode A) vs general knowledge fallback (Mode B)
- PostHog event tracking on chat responses

### Phase 7: PostHog Analytics ✅ COMPLETE
- PostHog client-side init (`instrumentation-client.ts`)
- PostHog server-side (`lib/posthog-server.ts`)
- Self-hosted proxy via `/ingest` rewrites in next.config.ts
- Exception capture enabled

### Phase 8: Real Data Wiring ✅ COMPLETE
- Server actions for all data: auth, facility, daily-log, lab-samples, compliance, documents (`lib/actions/`)
- Document upload modal + `/api/upload-document` route → Supabase Storage → extraction pipeline
- Daily log save with offline queue (saves to localStorage when offline, syncs when back)
- DMR Prep: interactive gap resolution with NODI codes, dynamic certify bar (blocked → ready), NetDMR XML export
- Lab samples: DW/WW system filtering synced with sidebar mode toggle
- All pages gracefully fall back to hardcoded data when Supabase has no records

### Phase 9: External Integrations 🔲 FUTURE
- [ ] SCADA integration (Wonderware Historian)
- [ ] Lab inbox (IMAP parser for Colorado Analytical PDFs)
- [ ] CDPHE portal submission (MOR via wqcdcompliance.com)
- [ ] NetDMR submission (DMR via EPA CDX)
- [ ] Email notifications (SendGrid)

---

## Tech Stack

| Layer | Technology | Status |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | ✅ Installed |
| Styling | Tailwind CSS 4 (CSS-first config) | ✅ Configured |
| Auth | localStorage stub (→ Supabase OTP) | ⚠ Stub only |
| Database | None (→ Supabase Postgres + pgvector) | 🔲 Not started |
| AI | None (→ Anthropic Claude + Voyage AI) | 🔲 Not started |
| Analytics | None (→ PostHog) | 🔲 Not started |
| Testing | Jest + React Testing Library | ✅ 188 tests passing |

---

## Project Structure

```
src/
  app/
    layout.tsx              # Root: AuthProvider → AppProvider → children
    globals.css             # Tailwind directives + design tokens + animations
    login/                  # Public routes (no AppShell)
      page.tsx              # Magic link form
      verify/page.tsx       # Token verification → redirect
      layout.tsx            # Minimal wrapper
    (dashboard)/            # Protected routes (wrapped in AppShell)
      layout.tsx            # AppShell wrapper
      page.tsx              # Compliance Home (all 8 sections)
      calendar/             # Compliance calendar
      dmr-prep/             # DMR prep (WW only)
      mor-prep/             # MOR prep (DW only)
      daily-log/            # Daily field readings
      lab-samples/          # Lab sample tracking
      trends/               # 12-month parameter trends
      documents/            # Document repository
      ask/                  # Ask Upstream AI
      integrations/         # Integration health
  components/
    layout/                 # AppShell, Sidebar, TopBar
    home/                   # 8 home page section components
    ui/                     # Card, Tag, ModeVisible, RoleVisible, SnapshotRow
  context/
    AuthContext.tsx          # Session management (localStorage)
    AppContext.tsx           # Mode (DW/WW/All) + Role (Op/Mgr) + Sync
  lib/
    auth.ts                 # Token/session/preferences helpers
    types.ts                # All TypeScript interfaces
  data/                     # Hardcoded mock data (Town of Alma)
  test/                     # Test utilities + setup
```

---

## Design System

### Colors (CSS variables in globals.css)
```
Navy:    #1a3a5c (sidebar, primary buttons)
Accent:  #1b6a8a (links, actions, hover)
Water:   #a8e6cf (mint green, secondary accent)
Purple:  #6d28d9 (AI features, special)
Green:   #15803d / bg #eafaf2 (success, healthy)
Yellow:  #a16207 / bg #fffbeb (Tier 1 design range alert)
Red:     #b91c1c / bg #fff5f5 (Tier 2 permit limit alert)
```

### Typography
- **Body/UI:** Inter (weights 300–700)
- **Display/branding:** Playfair Display (700, italic)
- **Data/metrics:** DM Mono (400, 500)

### Key Patterns
- Card: `bg-surface border border-border rounded-xl p-4`
- Label: `text-[10px] font-bold uppercase tracking-[1px] text-text-dim`
- Primary button: `bg-navy text-white hover:bg-accent rounded-lg`
- Tag: `text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase`

---

## Two Toggle Systems

### System Mode (DW / WW / All)
Controls which content is visible. Sidebar toggle sets `mode` in AppContext.
- `<ModeVisible show="dw">` — renders when mode is 'all' or 'dw'
- `<ModeVisible show="ww">` — renders when mode is 'all' or 'ww'
- Nav items: DMR Prep = WW only, MOR Prep = DW only

### Role (Operator / Manager)
Controls role-specific content. Sidebar toggle sets `role` in AppContext.
- `<RoleVisible show="op">` — operator-only content
- `<RoleVisible show="mgr">` — manager-only content
- Currently UI-only (no server-side access control yet)

---

## V1 Reference

The previous MVP at `/Documents/upstream-ai/mvp-dashboardv1` has working implementations of:
- Supabase client/server/service setup (`lib/supabase/`)
- Supabase middleware for session refresh
- Magic link OTP auth with callback handler
- Document extraction + chunking + Voyage AI embeddings
- Hybrid RAG search (pgvector cosine + FTS)
- Claude API chat with Mode A/B (document-grounded vs general)
- PostHog analytics (client + server + proxy)
- Database schema (7 migrations)
- Multi-tenant RLS policies

Port from v1 when implementing Phases 5–8. Do not add OpenAI, Pinecone, or any dependency not in the v1 stack.

---

## Environment Variables (needed for Phase 5+)

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
VOYAGE_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

---

## Commands

```bash
npm run dev           # Dev server on localhost:3000
npm run build         # Production build
npm test              # Run all 188 tests
npm run test:coverage # Tests with coverage report
```

---

## Rules

- Always read this file before writing code
- Do not add dependencies not listed in the tech stack without asking
- Use the design system tokens — do not hardcode hex colors
- All new components must support DW/WW mode toggle where relevant
- Port from v1 rather than rebuilding from scratch where possible
- Keep hardcoded data in `src/data/` until Supabase is wired up
- Test new features (Jest + React Testing Library)
