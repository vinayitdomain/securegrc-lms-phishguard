import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from "./stats/DashboardStats";
import { CourseDistributionChart } from "./charts/CourseDistributionChart";
import { VideoContentList } from "./training/VideoContentList";
import { CourseProgressList } from "./courses/CourseProgressList";
import { DeadlinesList } from "./deadlines/DeadlinesList";
import { useUserMetrics } from "@/hooks/dashboard/useUserMetrics";
import { useUserProfile } from "@/hooks/dashboard/useUserProfile";
import { useUserAchievements } from "@/hooks/dashboard/useUserAchievements";
import { useLeaderboard } from "@/hooks/dashboard/useLeaderboard";
import { toast } from "sonner";

export function UserDashboardV2() {
  const { data: userMetrics, isLoading: isLoadingMetrics } = useUserMetrics();
  const { data: profile } = useUserProfile();
  const { data: achievements } = useUserAchievements();
  const { data: leaderboardEntries } = useLeaderboard();

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
      <DashboardStats {...metrics} />

      <div className="grid gap-6 md:grid-cols-2">
        <CourseDistributionChart />
        <VideoContentList />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CourseProgressList />
        <DeadlinesList />
      </div>
    </div>
  );
}