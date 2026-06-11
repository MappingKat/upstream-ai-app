'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Get the current authenticated user's profile including tenant/facility info.
 * Returns null if not authenticated.
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const service = createServiceClient();
  const { data: profile } = await service
    .from('user_profiles')
    .select('*, facilities(*), tenants(*)')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Get the current user's tenant_id and facility_id.
 * Used by other server actions for scoped queries.
 */
export async function getUserScope() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const service = createServiceClient();
  const { data: profile } = await service
    .from('user_profiles')
    .select('tenant_id, facility_id, role')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    userId: user.id,
    tenantId: profile.tenant_id as string,
    facilityId: profile.facility_id as string | null,
    role: profile.role as string,
  };
}
