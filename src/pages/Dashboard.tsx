import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserDashboardV2 } from "@/components/dashboard/UserDashboardV2";
import { OrgAdminDashboard } from "@/components/dashboard/OrgAdminDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate("/auth");
          return;
        }

        // Fetch profile only if we have a session
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Session Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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