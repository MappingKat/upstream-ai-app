'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserScope } from './auth';

/**
 * Get compliance reports for the current facility.
 */
export async function getComplianceReports(filters?: {
  reportType?: string;
  status?: string;
}) {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  let query = supabase
    .from('compliance_reports')
    .select('*, compliance_report_values(*), data_gaps(*)')
    .eq('tenant_id', scope.tenantId)
    .order('due_date', { ascending: true });

  if (scope.facilityId) {
    query = query.eq('facility_id', scope.facilityId);
  }
  if (filters?.reportType) {
    query = query.eq('report_type', filters.reportType);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data } = await query;
  return data ?? [];
}

/**
 * Get upcoming compliance deadlines.
 */
export async function getUpcomingDeadlines(daysAhead: number = 90) {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const future = new Date(Date.now() + daysAhead * 86400000).toISOString().split('T')[0];

  const { data } = await supabase
    .from('compliance_deadlines')
    .select('*')
    .eq('tenant_id', scope.tenantId)
    .gte('due_date', today)
    .lte('due_date', future)
    .order('due_date');

  return data ?? [];
}

/**
 * Resolve a data gap with a NODI code.
 */
export async function resolveDataGap(gapId: string, nodiCode: string) {
  const scope = await getUserScope();
  if (!scope) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('data_gaps')
    .update({
      nodi_code: nodiCode,
      status: 'resolved',
      resolved_by: scope.userId,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', gapId);

  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Update compliance report status (draft → review → approved → submitted).
 */
export async function updateReportStatus(reportId: string, status: string) {
  const scope = await getUserScope();
  if (!scope) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const update: Record<string, unknown> = { status };

  if (status === 'submitted') {
    update.submitted_by = scope.userId;
    update.submitted_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('compliance_reports')
    .update(update)
    .eq('id', reportId);

  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Get data gaps for a specific compliance report.
 */
export async function getDataGaps(reportId: string) {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('data_gaps')
    .select('*')
    .eq('report_id', reportId)
    .order('gap_date');

  return data ?? [];
}
