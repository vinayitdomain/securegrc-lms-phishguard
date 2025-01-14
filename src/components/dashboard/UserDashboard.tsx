import { MetricsChart } from "./MetricsChart";
import { AchievementsGrid } from "./AchievementsGrid";
import { UserStats } from "./UserStats";
import { Leaderboard } from "./Leaderboard";
import { UserSegments } from "./UserSegments";
import { TrainingPaths } from "./TrainingPaths";

interface UserDashboardProps {
  activeCampaigns: number;
  courseCompletion: number;
  complianceStatus: number;
  isLoadingCampaigns: boolean;
  isLoadingCourses: boolean;
  isLoadingCompliance: boolean;
  campaignMetrics: Array<{ name: string; value: number }>;
  achievements: any[];
  userAchievements: string[];
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
  userAchievements,
  leaderboard,
}: UserDashboardProps) {
  return (
    <>
      <UserStats
        activeCampaigns={activeCampaigns}
        courseCompletion={courseCompletion}
        complianceStatus={complianceStatus}
        isLoadingCampaigns={isLoadingCampaigns}
        isLoadingCourses={isLoadingCourses}
        isLoadingCompliance={isLoadingCompliance}
      />
      
      <div className="grid gap-6 mt-6">
        <TrainingPaths />
        
        <AchievementsGrid 
          achievements={achievements}
          earnedAchievements={userAchievements}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MetricsChart data={campaignMetrics} />
          </div>
          <UserSegments />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Leaderboard entries={leaderboard} />
        </div>
      </div>
    </>
  );
}