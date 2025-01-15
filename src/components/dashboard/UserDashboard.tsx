import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardMetrics } from "./DashboardMetrics";
import { TrainingPaths } from "./TrainingPaths";
import { AchievementsGrid } from "./AchievementsGrid";
import { Leaderboard } from "./Leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDashboard() {
  const { data: userMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['user-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: leaderboardEntries } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (!profile?.organization_id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('organization_leaderboard')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
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

  const metrics = {
    activeCampaigns: 0,
    courseCompletion: userMetrics?.courses_completed || 0,
    complianceStatus: userMetrics?.security_score || 0,
    isLoadingCampaigns: false,
    isLoadingCourses: isLoadingMetrics,
    isLoadingCompliance: isLoadingMetrics,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      
      <DashboardMetrics {...metrics} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Training Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <TrainingPaths />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsGrid 
              achievements={achievements?.map(a => a.achievements) || []}
              earnedAchievements={achievements?.map(a => a.id) || []}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Leaderboard entries={leaderboardEntries || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}