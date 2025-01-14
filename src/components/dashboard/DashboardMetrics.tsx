import { StatCard } from "./StatCard";

interface DashboardMetricsProps {
  activeCampaigns: number;
  courseCompletion: number;
  complianceStatus: number;
  isLoadingCampaigns: boolean;
  isLoadingCourses: boolean;
  isLoadingCompliance: boolean;
}

export function DashboardMetrics({
  activeCampaigns,
  courseCompletion,
  complianceStatus,
  isLoadingCampaigns,
  isLoadingCourses,
  isLoadingCompliance,
}: DashboardMetricsProps) {
  return (
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
  );
}