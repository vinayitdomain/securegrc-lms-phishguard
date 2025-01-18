import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Trash2 } from "lucide-react";

interface UserManagementProps {
  organizationId: string;
}

type UserRole = "super_admin" | "org_admin" | "user";

interface Profile {
  id: string;
  user_id: string;
  organization_id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  users: {
    email: string;
  } | null;
}

export function UserManagement({ organizationId }: UserManagementProps) {
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ['org-users', organizationId],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          organization_id,
          full_name,
          role,
          created_at,
          updated_at,
          users:auth.users(email)
        `)
        .eq('organization_id', organizationId);

      if (error) throw error;
      return profiles as Profile[];
    },
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Users</h3>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.users?.email}</TableCell>
              <TableCell>
                <select
                  className="border rounded p-1"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                >
                  <option value="user">User</option>
                  <option value="org_admin">Admin</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`view-${user.id}`} />
                    <label htmlFor={`view-${user.id}`}>View</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`edit-${user.id}`} />
                    <label htmlFor={`edit-${user.id}`}>Edit</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`delete-${user.id}`} />
                    <label htmlFor={`delete-${user.id}`}>Delete</label>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}