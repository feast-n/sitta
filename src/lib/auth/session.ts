import { createSupabaseServerClient } from '@/lib/supabase/server';

export type Role = 'admin' | 'staff';

export interface SessionContext {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
  organizationId: string;
  organizationName: string;
}

/**
 * Resolves the signed-in user together with their tenant and role.
 * Returns null when there is no session or the profile is missing
 * (which means the tenant bootstrap trigger did not run).
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id, full_name, role')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  const { data: organization } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', profile.organization_id)
    .single();

  return {
    userId: user.id,
    email: user.email ?? '',
    fullName: profile.full_name,
    role: profile.role as Role,
    organizationId: profile.organization_id,
    organizationName: organization?.name ?? 'Unknown',
  };
}