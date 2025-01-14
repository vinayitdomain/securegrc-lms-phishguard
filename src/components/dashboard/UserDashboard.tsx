import { StatCard } from "./StatCard";
import { MetricsChart } from "./MetricsChart";
import { AchievementsGrid } from "./AchievementsGrid";
import { Leaderboard } from "./Leaderboard";
import { ComplianceOverview } from "../compliance/ComplianceOverview";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle } from "lucide-react";

interface UserDashboardProps {
  activeCampaigns: number;
  courseCompletion: number;
  complianceStatus: number;
  isLoadingCampaigns: boolean;
  isLoadingCourses: boolean;
  isLoadingCompliance: boolean;
  campaignMetrics: { name: string; value: number }[];
  achievements: any[];
  earnedAchievements: string[];
  leaderboard: any[];
}

export function UserDashboard({
  activeCampaigns,
  courseCompletion,
  complianceStatus,
  isLoadingCampaigns,
  isLoadingCourses,
  isLoadingCompliance,
  campaignMetrics,
  achievements,
  earnedAchievements,
  leaderboard,
}: UserDashboardProps) {
  const { data: recentIncidents = [], isLoading: isLoadingIncidents } = useQuery({
    queryKey: ['recentIncidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          id,
          title,
          priority,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          description="Current phishing campaigns"
          isLoading={isLoadingCampaigns}
        />
        <StatCard
          title="Course Completion"
          value={`${courseCompletion}%`}
          description="Average completion rate"
          isLoading={isLoadingCourses}
        />
        <StatCard
          title="Compliance Status"
          value={`${complianceStatus}%`}
          description="Overall compliance score"
          isLoading={isLoadingCompliance}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Compliance Frameworks</h2>
          <ComplianceOverview />
        </div>
        <div className="col-span-3">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Campaign Activity</h2>
          <MetricsChart data={campaignMetrics} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Incidents</h2>
          <div className="space-y-4">
            {isLoadingIncidents ? (
              <div className="animate-pulse space-y-3">
                <div className="h-16 bg-muted rounded-lg" />
                <div className="h-16 bg-muted rounded-lg" />
                <div className="h-16 bg-muted rounded-lg" />
              </div>
            ) : recentIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold">No Recent Incidents</h3>
                <p className="text-sm text-muted-foreground">
                  All systems are operating normally
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        incident.priority === 'critical' ? 'text-destructive' :
                        incident.priority === 'high' ? 'text-warning' :
                        'text-muted-foreground'
                      }`} />
                      <div>
                        <h4 className="font-medium">{incident.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(incident.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      incident.status === 'open' ? 'bg-destructive/10 text-destructive' :
                      incident.status === 'investigating' ? 'bg-warning/10 text-warning' :
                      incident.status === 'resolved' ? 'bg-success/10 text-success' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Achievements</h2>
          <AchievementsGrid
            achievements={achievements}
            earnedAchievements={earnedAchievements}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Leaderboard</h2>
        <Leaderboard entries={leaderboard} />
      </div>
    </div>
  );
}