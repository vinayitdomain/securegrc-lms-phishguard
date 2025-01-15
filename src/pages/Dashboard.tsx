import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { OrgAdminDashboard } from "@/components/dashboard/OrgAdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  // First fetch the user profile
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations (
            name,
            brand_logo_url,
            brand_primary_color
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Profile not found');
      return data;
    },
  });

  if (isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </DashboardLayout>
    );
  }

  if (profileError) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading dashboard: {profileError.message}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No profile found. Please contact support.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {profile.full_name || 'User'}
          </h1>
          {profile.organizations?.name && (
            <p className="text-muted-foreground">
              Organization: {profile.organizations.name}
            </p>
          )}
        </div>

        {profile.role === 'super_admin' && <SuperAdminDashboard />}
        {profile.role === 'org_admin' && <OrgAdminDashboard />}
        {profile.role === 'user' && <UserDashboard />}
      </div>
    </DashboardLayout>
  );
}