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
  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      // First check if we have an authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get user profile, using maybeSingle() to handle no profile case
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return [];
      }

      if (!profile) {
        console.warn('No profile found for user');
        return [];
      }

      // Get role permissions
      const { data: rolePermissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('organization_id', profile.organization_id)
        .eq('role', profile.role);

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        return [];
      }

      return rolePermissions?.map(p => p.permission) || [];
    },
  });

  const hasPermission = (permission: PermissionType) => {
    if (isLoading || !permissions) return false;
    return permissions.includes(permission);
  };

  return {
    hasPermission,
    isLoading,
    permissions
  };
}