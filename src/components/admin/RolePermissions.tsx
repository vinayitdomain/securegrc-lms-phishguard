import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type PermissionType = 
  | "policy_view" | "policy_create" | "policy_edit" | "policy_delete" | "policy_approve"
  | "document_view" | "document_create" | "document_edit" | "document_delete" | "document_approve"
  | "audit_view" | "audit_create" | "audit_manage";

interface RolePermissionsProps {
  organizationId: string;
}

export function RolePermissions({ organizationId }: RolePermissionsProps) {
  const { data: rolePermissions, isLoading } = useQuery({
    queryKey: ['role-permissions', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_default_permissions')
        .select('*')
        .eq('organization_id', organizationId);

      if (error) throw error;
      return data;
    },
  });

  const handlePermissionToggle = async (roleId: string, permission: PermissionType, enabled: boolean) => {
    const currentRole = rolePermissions?.find(r => r.id === roleId);
    if (!currentRole) return;

    const updatedPermissions = enabled
      ? [...(currentRole.permissions as PermissionType[]), permission]
      : (currentRole.permissions as PermissionType[]).filter(p => p !== permission);

    const { error } = await supabase
      .from('role_default_permissions')
      .update({ permissions: updatedPermissions })
      .eq('id', roleId);

    if (error) {
      console.error('Error updating role permissions:', error);
    }
  };

  if (isLoading) {
    return <div>Loading role permissions...</div>;
  }

  const availablePermissions: PermissionType[] = [
    'policy_view', 'policy_create', 'policy_edit', 'policy_delete', 'policy_approve',
    'document_view', 'document_create', 'document_edit', 'document_delete', 'document_approve',
    'audit_view', 'audit_create', 'audit_manage'
  ];

  return (
    <div className="space-y-4">
      {rolePermissions?.map((rolePermission) => (
        <Card key={rolePermission.id}>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">{rolePermission.role}</h3>
            <div className="grid grid-cols-3 gap-4">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${rolePermission.id}-${permission}`}
                    checked={(rolePermission.permissions as PermissionType[]).includes(permission)}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(rolePermission.id, permission, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${rolePermission.id}-${permission}`}>
                    {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}