import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardCharts } from "./DashboardCharts";
import { AchievementsGrid } from "./AchievementsGrid";
import { Leaderboard } from "./Leaderboard";
import { RecentIncidents } from "../incidents/RecentIncidents";

interface UserDashboardProps {
  activeCampaigns: number;
  courseCompletion: number;
  complianceStatus: number;
  isLoadingCampaigns: boolean;
  isLoadingCourses: boolean;
  isLoadingCompliance: boolean;
  campaignMetrics: Array<{ name: string; value: number }>;
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
  return (
    <div className="space-y-8">
      <DashboardMetrics
        activeCampaigns={activeCampaigns}
        courseCompletion={courseCompletion}
        complianceStatus={complianceStatus}
        isLoadingCampaigns={isLoadingCampaigns}
        isLoadingCourses={isLoadingCourses}
        isLoadingCompliance={isLoadingCompliance}
      />

      <DashboardCharts campaignMetrics={campaignMetrics} />

      <div className="grid gap-4 md:grid-cols-2">
        <RecentIncidents />
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