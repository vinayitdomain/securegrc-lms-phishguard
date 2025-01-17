import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

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

  const handlePermissionToggle = async (roleId: string, permission: string, enabled: boolean) => {
    const { error } = await supabase
      .from('role_default_permissions')
      .update({
        permissions: enabled ? [...(rolePermissions?.find(r => r.id === roleId)?.permissions || []), permission]
          : rolePermissions?.find(r => r.id === roleId)?.permissions.filter(p => p !== permission)
      })
      .eq('id', roleId);

    if (error) {
      console.error('Error updating role permissions:', error);
    }
  };

  if (isLoading) {
    return <div>Loading role permissions...</div>;
  }

  return (
    <div className="space-y-4">
      {rolePermissions?.map((rolePermission) => (
        <Card key={rolePermission.id}>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">{rolePermission.role}</h3>
            <div className="grid grid-cols-3 gap-4">
              {['view', 'create', 'edit', 'delete', 'approve'].map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${rolePermission.id}-${permission}`}
                    checked={rolePermission.permissions.includes(permission)}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(rolePermission.id, permission, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${rolePermission.id}-${permission}`}>
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
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