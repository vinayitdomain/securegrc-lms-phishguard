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

  // Mock data for course distribution
  const courseDistributionData = [
    { name: "Completed", value: userMetrics?.courses_completed || 0 },
    { name: "In Progress", value: 2 },
    { name: "Not Started", value: 1 },
  ];

  // Mock data for video content
  const videoContentData = [
    {
      id: "1",
      training_content: { title: "Introduction to Security" },
      progress_percentage: 75
    },
    {
      id: "2",
      training_content: { title: "Data Privacy Basics" },
      progress_percentage: 30
    }
  ];

  // Mock data for course progress
  const courseProgressData = [
    {
      id: "1",
      training_content: {
        title: "Security Fundamentals",
        description: "Learn the basics of cybersecurity"
      },
      progress_percentage: 60
    },
    {
      id: "2",
      training_content: {
        title: "Compliance Training",
        description: "Understanding compliance requirements"
      },
      progress_percentage: 40
    }
  ];

  const metrics = {
    courseCount: userMetrics?.courses_completed || 0,
    learningHours: Math.round(Math.random() * 100), // Mock data
    certificateCount: 3, // Mock data
    achievementCount: achievements?.length || 0
  };

  return (
    <div className="space-y-6">
      <DashboardStats {...metrics} />

      <div className="grid gap-6 md:grid-cols-2">
        <CourseDistributionChart data={courseDistributionData} />
        <VideoContentList videoContent={videoContentData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CourseProgressList courseProgress={courseProgressData} />
        <DeadlinesList courseProgress={courseProgressData} />
      </div>
    </div>
  );
}