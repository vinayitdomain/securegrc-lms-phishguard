import { StatCard } from "./StatCard";

interface UserStatsProps {
  activeCampaigns: number;
  courseCompletion: number;
  complianceStatus: number;
  isLoadingCampaigns: boolean;
  isLoadingCourses: boolean;
  isLoadingCompliance: boolean;
}

export function UserStats({ 
  activeCampaigns, 
  courseCompletion, 
  complianceStatus,
  isLoadingCampaigns,
  isLoadingCourses,
  isLoadingCompliance 
}: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Campaigns"
        value={isLoadingCampaigns ? "Loading..." : activeCampaigns}
        className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
      />
      <StatCard
        title="Course Completion"
        value={isLoadingCourses ? "Loading..." : `${courseCompletion}%`}
        className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
      />
      <StatCard
        title="Risk Score"
        value={courseCompletion >= 75 ? "Low" : courseCompletion >= 50 ? "Medium" : "High"}
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
      />
      <StatCard
        title="Compliance Status"
        value={isLoadingCompliance ? "Loading..." : `${complianceStatus}%`}
        className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
      />
    </div>
  );
}