'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserScope } from './auth';

/**
 * Get or create a log entry for a specific date.
 */
export async function getLogEntry(date: string) {
  const scope = await getUserScope();
  if (!scope) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('log_entries')
    .select('*, log_readings(*)')
    .eq('tenant_id', scope.tenantId)
    .eq('log_date', date)
    .maybeSingle();

  return data;
}

/**
 * Save a draft log entry with readings.
 */
export async function saveLogEntry(input: {
  date: string;
  weather?: string;
  notes?: string;
  readings: {
    parameter_key: string;
    time_block?: string;
    value: number | null;
    source: 'manual' | 'scada' | 'override';
    operator_initials?: string;
    notes?: string;
  }[];
}) {
  const scope = await getUserScope();
  if (!scope) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // Upsert log entry
  const { data: entry, error: entryError } = await supabase
    .from('log_entries')
    .upsert({
      tenant_id: scope.tenantId,
      facility_id: scope.facilityId,
      log_date: input.date,
      status: 'draft',
      weather: input.weather,
      notes: input.notes,
    }, {
      onConflict: 'tenant_id,facility_id,log_date',
    })
    .select()
    .single();

  if (entryError || !entry) {
    return { error: entryError?.message ?? 'Failed to save log entry' };
  }

  // Delete existing readings and insert new ones
  await supabase
    .from('log_readings')
    .delete()
    .eq('log_entry_id', entry.id);

  if (input.readings.length > 0) {
    const { error: readingsError } = await supabase
      .from('log_readings')
      .insert(
        input.readings.map(r => ({
          log_entry_id: entry.id,
          parameter_key: r.parameter_key,
          time_block: r.time_block,
          value: r.value,
          source: r.source,
          operator_initials: r.operator_initials,
          notes: r.notes,
        }))
      );

    if (readingsError) {
      return { error: readingsError.message };
    }
  }

  return { data: entry };
}

/**
 * Submit a log entry (changes status from draft to submitted).
 */
export async function submitLogEntry(logEntryId: string) {
  const scope = await getUserScope();
  if (!scope) return { error: 'Not authenticated' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('log_entries')
    .update({
      status: 'submitted',
      submitted_by: scope.userId,
      submitted_at: new Date().toISOString(),
    })
    .eq('id', logEntryId);

  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Get log entries for a date range (for compliance report generation).
 */
export async function getLogEntriesRange(startDate: string, endDate: string) {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('log_entries')
    .select('*, log_readings(*)')
    .eq('tenant_id', scope.tenantId)
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date');

  return data ?? [];
}
