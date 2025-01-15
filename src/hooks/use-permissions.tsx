import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PermissionType = 
  | 'policy_view' 
  | 'policy_create'
  | 'policy_edit'
  | 'policy_delete'
  | 'policy_approve'
  | 'document_view'
  | 'document_create'
  | 'document_edit'
  | 'document_delete'
  | 'document_approve'
  | 'audit_view'
  | 'audit_create'
  | 'audit_manage';

export function usePermissions() {
  // First get the profile to ensure we have organization_id
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Then fetch permissions only if we have a valid organization_id
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id || !profile?.role) {
        return [];
      }

      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('organization_id', profile.organization_id)
        .eq('role', profile.role);

      if (error) throw error;
      return data?.map(p => p.permission) || [];
    },
    enabled: !!profile?.organization_id && !!profile?.role,
  });

  const hasPermission = (permission: PermissionType) => {
    if (isLoadingProfile || isLoadingPermissions || !permissions) return false;
    return permissions.includes(permission);
  };

  return {
    hasPermission,
    isLoading: isLoadingProfile || isLoadingPermissions,
    permissions
  };
}