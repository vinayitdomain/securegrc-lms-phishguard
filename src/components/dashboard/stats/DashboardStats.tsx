import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Award, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
}

const StatCard = ({ title, value, icon, gradient, onClick }: StatCardProps) => (
  <Card 
    className={`${gradient} cursor-pointer hover:shadow-lg transition-all duration-200`}
    onClick={onClick}
  >
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#1A1F2C]">{title}</p>
          <h3 className="text-2xl font-bold text-[#7E69AB]">{value}</h3>
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
);

export function DashboardStats({ 
  courseCount = 0,
  learningHours = 0,
  certificateCount = 0,
  achievementCount = 0 
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Enrolled Courses"
        value={courseCount}
        icon={<BookOpen className="h-8 w-8 text-[#6E59A5] opacity-75" />}
        gradient="bg-gradient-to-br from-[#E5DEFF] to-[#D6BCFA]"
        onClick={() => navigate('/training')}
      />
      <StatCard
        title="Learning Hours"
        value={learningHours}
        icon={<Clock className="h-8 w-8 text-[#6E59A5] opacity-75" />}
        gradient="bg-gradient-to-br from-[#F2FCE2] to-[#FEF7CD]"
        onClick={() => navigate('/training')}
      />
      <StatCard
        title="Certificates"
        value={certificateCount}
        icon={<Award className="h-8 w-8 text-[#6E59A5] opacity-75" />}
        gradient="bg-gradient-to-br from-[#D3E4FD] to-[#FFDEE2]"
        onClick={() => navigate('/training/certificates')}
      />
      <StatCard
        title="Achievements"
        value={achievementCount}
        icon={<Trophy className="h-8 w-8 text-[#6E59A5] opacity-75" />}
        gradient="bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1]"
        onClick={() => navigate('/training/achievements')}
      />
    </div>
  );
}