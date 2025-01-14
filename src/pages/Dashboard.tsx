import { ComplianceOverview } from "@/components/compliance/ComplianceOverview";
import { ComplianceDocumentList } from "@/components/compliance/documents/ComplianceDocumentList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { data: profile } = useQuery({
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

  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['metrics', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) return null;

      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id,
  });

  const activeCampaigns = metricsData?.active_campaigns || 0;
  const courseCompletion = metricsData?.courses_completed || 0;
  const complianceStatus = metricsData?.security_score || 0;
  const isLoadingCampaigns = isLoadingMetrics;
  const isLoadingCourses = isLoadingMetrics;
  const isLoadingCompliance = isLoadingMetrics;
  const campaignMetrics = metricsData?.campaign_metrics || [];
  const achievements = metricsData?.achievements || [];
  const earnedAchievements = metricsData?.earned_achievements || [];
  const leaderboard = metricsData?.leaderboard || [];

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      <div className="grid gap-8">
        <UserDashboard
          activeCampaigns={activeCampaigns}
          courseCompletion={courseCompletion}
          complianceStatus={complianceStatus}
          isLoadingCampaigns={isLoadingCampaigns}
          isLoadingCourses={isLoadingCourses}
          isLoadingCompliance={isLoadingCompliance}
          campaignMetrics={campaignMetrics}
          achievements={achievements}
          earnedAchievements={earnedAchievements}
          leaderboard={leaderboard}
        />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Compliance Overview
          </h2>
          <ComplianceOverview />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Compliance Documents
          </h2>
          <ComplianceDocumentList />
        </div>
      </div>
    </div>
  );
}
