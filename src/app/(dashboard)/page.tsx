'use client';

import Link from 'next/link';
import { FocusHero } from '@/components/home/FocusHero';
import { StateFormCard } from '@/components/home/StateFormCard';
import { TrendsStrip } from '@/components/home/TrendsStrip';
import { ForecastChart } from '@/components/home/ForecastChart';
import { IntegrationsStrip } from '@/components/home/IntegrationsStrip';
import { Timeline } from '@/components/home/Timeline';
import { AtAGlance } from '@/components/home/AtAGlance';
import { QuickActions } from '@/components/home/QuickActions';

export default function Home() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight leading-tight">
            Compliance <em className="font-serif italic font-bold">Home</em>
          </h1>
          <p className="text-sm text-text-dim mt-[3px]">
            Town of Alma · PWS CO0147001 + CDPS COG591177 · Apr 3, 2026 · Last data pull 7:34 AM
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Link
            href="/calendar"
            className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-bg hover:border-text-dim no-underline inline-flex items-center min-h-[38px]"
          >
            📅 View calendar →
          </Link>
          <Link
            href="/ask"
            className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-semibold hover:bg-accent no-underline inline-flex items-center min-h-[38px]"
          >
            💬 Ask Upstream
          </Link>
        </div>
      </div>

      {/* Today's Focus */}
      <FocusHero />

      {/* One-Click State Form */}
      <StateFormCard />

      {/* Compliance Trends Strip */}
      <TrendsStrip />

      {/* Predictive Forecast Chart */}
      <ForecastChart />

      {/* Integrations Health */}
      <IntegrationsStrip />

      {/* Bottom Split: Timeline + At-a-Glance */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-3.5 mb-3.5 max-[900px]:grid-cols-1">
        <Timeline />
        <div>
          <AtAGlance />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
