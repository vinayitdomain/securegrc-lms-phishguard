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
    <Card className="p-6 bg-[#F1F0FB]/50 backdrop-blur supports-[backdrop-filter]:bg-[#F1F0FB]/50">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          description="Current phishing campaigns"
          isLoading={isLoadingCampaigns}
          className="bg-gradient-to-br from-[#E5DEFF] to-[#D6BCFA]"
        />
        <StatCard
          title="Course Completion"
          value={`${courseCompletion}%`}
          description="Average completion rate"
          isLoading={isLoadingCourses}
          className="bg-gradient-to-br from-[#F2FCE2] to-[#FEF7CD]"
        />
        <StatCard
          title="Compliance Status"
          value={`${complianceStatus}%`}
          description="Overall compliance score"
          isLoading={isLoadingCompliance}
          className="bg-gradient-to-br from-[#D3E4FD] to-[#FFDEE2]"
        />
      </div>
    </Card>
  );
}