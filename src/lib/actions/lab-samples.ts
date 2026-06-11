'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserScope } from './auth';

/**
 * Get lab samples, optionally filtered by system type and disposition.
 */
export async function getLabSamples(filters?: {
  systemType?: 'dw' | 'ww';
  disposition?: string;
  startDate?: string;
  endDate?: string;
}) {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  let query = supabase
    .from('lab_samples')
    .select('*')
    .eq('tenant_id', scope.tenantId)
    .order('collected_date', { ascending: false });

  if (scope.facilityId) {
    query = query.eq('facility_id', scope.facilityId);
  }
  if (filters?.disposition) {
    query = query.eq('disposition', filters.disposition);
  }
  if (filters?.startDate) {
    query = query.gte('collected_date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('collected_date', filters.endDate);
  }

  const { data } = await query;

  // Filter by system type client-side (based on parameter mapping)
  if (filters?.systemType && data) {
    const dwParams = ['cl2_residual', 'cfe_turbidity', 'tthm', 'haa5'];
    const wwParams = ['bod5', 'tss', 'nh3n', 'do', 'ph', 'ecoli', 'flow'];
    const paramSet = filters.systemType === 'dw' ? dwParams : wwParams;
    return data.filter(s => paramSet.some(p => s.parameter_key?.includes(p)));
  }

  return data ?? [];
}

/**
 * Create a new lab sample.
 */
export async function createLabSample(input: {
  collected_date: string;
  collected_time?: string;
  parameter_key: string;
  parameter_label: string;
  method?: string;
  value: number | null;
  unit: string;
  source: 'inhouse' | 'extlab' | 'scada' | 'field';
  source_label?: string;
  lab_id?: string;
  disposition: 'reported' | 'held' | 'excluded' | 'resampled' | 'qc';
  disposition_reason?: string;
  hold_time_hours?: number;
}) {
  const scope = await getUserScope();
  if (!scope) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lab_samples')
    .insert({
      tenant_id: scope.tenantId,
      facility_id: scope.facilityId,
      collected_by: scope.userId,
      ...input,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

/**
 * Get disposition summary counts for the current facility.
 */
export async function getDispositionSummary(systemType?: 'dw' | 'ww') {
  const samples = await getLabSamples(systemType ? { systemType } : undefined);

  const counts = {
    reported: 0,
    held: 0,
    excluded: 0,
    resampled: 0,
    qc: 0,
    total: samples.length,
  };

  for (const s of samples) {
    const d = s.disposition as keyof typeof counts;
    if (d in counts) counts[d]++;
  }

  return counts;
}
