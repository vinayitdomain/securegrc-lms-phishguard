import { StatCard } from "./StatCard";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          description="Current phishing campaigns"
          isLoading={isLoadingCampaigns}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatCard
          title="Course Completion"
          value={`${courseCompletion}%`}
          description="Average completion rate"
          isLoading={isLoadingCourses}
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatCard
          title="Compliance Status"
          value={`${complianceStatus}%`}
          description="Overall compliance score"
          isLoading={isLoadingCompliance}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
      </div>
    </Card>
  );
}