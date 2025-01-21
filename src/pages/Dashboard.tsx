import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserDashboardV2 } from "@/components/dashboard/UserDashboardV2";
import { OrgAdminDashboard } from "@/components/dashboard/OrgAdminDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
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
        <Skeleton className="h-[600px]" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {profile?.role === 'super_admin' ? (
        <SuperAdminDashboard />
      ) : profile?.role === 'org_admin' ? (
        <OrgAdminDashboard />
      ) : (
        <UserDashboardV2 />
      )}
    </DashboardLayout>
  );
}