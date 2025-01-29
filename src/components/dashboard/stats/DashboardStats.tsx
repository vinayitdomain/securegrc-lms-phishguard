import { BookOpen, Clock, Award, Trophy } from "lucide-react";
import { StatisticCard } from "./StatisticCard";

interface DashboardStatsProps {
  courseCount: number;
  learningHours: number;
  certificateCount: number;
  achievementCount: number;
}

export function DashboardStats({
  courseCount,
  learningHours,
  certificateCount,
  achievementCount
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        title="Enrolled Courses"
        value={courseCount}
        icon={BookOpen}
        className="bg-gradient-to-br from-[#E5DEFF] to-[#D6BCFA]"
      />
      <StatisticCard
        title="Learning Hours"
        value={learningHours}
        icon={Clock}
        className="bg-gradient-to-br from-[#F2FCE2] to-[#FEF7CD]"
      />
      <StatisticCard
        title="Certificates"
        value={certificateCount}
        icon={Award}
        className="bg-gradient-to-br from-[#D3E4FD] to-[#FFDEE2]"
      />
      <StatisticCard
        title="Achievements"
        value={achievementCount}
        icon={Trophy}
        className="bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1]"
      />
    </div>
  );
}