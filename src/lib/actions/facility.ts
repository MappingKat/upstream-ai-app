'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserScope } from './auth';

/**
 * Get the current user's facility details.
 */
export async function getFacility() {
  const scope = await getUserScope();
  if (!scope?.facilityId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', scope.facilityId)
    .single();

  return data;
}

/**
 * Get parameter configs for the user's facility.
 */
export async function getParameterConfigs(systemType?: 'dw' | 'ww') {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  let query = supabase
    .from('parameter_configs')
    .select('*')
    .eq('tenant_id', scope.tenantId);

  if (scope.facilityId) {
    query = query.eq('facility_id', scope.facilityId);
  }
  if (systemType) {
    query = query.eq('system_type', systemType);
  }

  const { data } = await query.order('parameter_key');
  return data ?? [];
}

/**
 * Get integration statuses for the user's tenant.
 */
export async function getIntegrations() {
  const scope = await getUserScope();
  if (!scope) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('integrations')
    .select('*')
    .eq('tenant_id', scope.tenantId)
    .order('name');

  return data ?? [];
}
