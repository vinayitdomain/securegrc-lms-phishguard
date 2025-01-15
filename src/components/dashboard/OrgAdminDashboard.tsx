import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardMetrics } from "./DashboardMetrics";
import { ComplianceOverview } from "../compliance/ComplianceOverview";
import { UserSegments } from "./UserSegments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCharts } from "./DashboardCharts";

export function OrgAdminDashboard() {
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['org-metrics'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .maybeSingle();

      if (!profile?.organization_id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      return data;
    },
  });

  const { data: campaignMetrics } = useQuery({
    queryKey: ['campaign-metrics'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .maybeSingle();

      if (!profile?.organization_id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('phishing_campaigns')
        .select('name, campaign_targets(count)')
        .eq('organization_id', profile.organization_id)
        .limit(5);

      if (error) throw error;
      return data.map(campaign => ({
        name: campaign.name,
        value: campaign.campaign_targets?.[0]?.count || 0
      }));
    },
  });

  if (isLoadingMetrics) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  const aggregatedMetrics = {
    activeCampaigns: metrics?.length || 0,
    courseCompletion: metrics?.reduce((acc, m) => acc + (m.courses_completed || 0), 0) / (metrics?.length || 1),
    complianceStatus: metrics?.reduce((acc, m) => acc + (m.security_score || 0), 0) / (metrics?.length || 1),
    isLoadingCampaigns: false,
    isLoadingCourses: isLoadingMetrics,
    isLoadingCompliance: isLoadingMetrics,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Organization Dashboard</h1>
      
      <DashboardMetrics {...aggregatedMetrics} />

      <DashboardCharts campaignMetrics={campaignMetrics || []} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <UserSegments />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}