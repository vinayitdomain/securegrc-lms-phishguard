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
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .single();

      if (!profile) throw new Error('No profile found');

      const { data: rolePermissions } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('organization_id', profile.organization_id)
        .eq('role', profile.role);

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