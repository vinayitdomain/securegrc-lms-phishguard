import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { OrgAdminDashboard } from "@/components/dashboard/OrgAdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        {profile?.role === 'super_admin' && <SuperAdminDashboard />}
        {profile?.role === 'org_admin' && <OrgAdminDashboard />}
        {profile?.role === 'user' && <UserDashboard />}
      </div>
    </DashboardLayout>
  );
}