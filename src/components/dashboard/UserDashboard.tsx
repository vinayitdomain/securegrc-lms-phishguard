import { StatCard } from "./StatCard";
import { MetricsChart } from "./MetricsChart";
import { AchievementsGrid } from "./AchievementsGrid";
import { Leaderboard } from "./Leaderboard";
import { ComplianceOverview } from "../compliance/ComplianceOverview";

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
          <h2 className="text-2xl font-bold tracking-tight mb-4">Achievements</h2>
          <AchievementsGrid
            achievements={achievements}
            earnedAchievements={earnedAchievements}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Leaderboard</h2>
          <Leaderboard entries={leaderboard} />
        </div>
      </div>
    </div>
  );
}