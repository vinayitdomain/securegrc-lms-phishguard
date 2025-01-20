import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Shield, Award, Zap, AlertCircle, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  type: string;
  icon: string;
}

const iconMap = {
  trophy: Trophy,
  shield: Shield,
  award: Award,
  zap: Zap,
  'alert-circle': AlertCircle,
  calendar: Calendar,
};

interface AchievementCardProps {
  achievement: Achievement;
  earned?: boolean;
}

export function AchievementCard({ achievement, earned = false }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap];

  return (
    <Card className={`transition-all duration-200 ${
      earned 
        ? 'bg-gradient-to-br from-[#E5DEFF] to-[#D6BCFA] border-[#9b87f5] hover:shadow-lg' 
        : 'bg-[#F1F0FB]/50 hover:bg-[#F1F0FB]'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#1A1F2C]">
          {achievement.name}
        </CardTitle>
        {Icon && (
          <Icon className={`h-5 w-5 ${
            earned ? 'text-[#6E59A5]' : 'text-[#8E9196]'
          }`} />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#1A1F2C]/80">{achievement.description}</p>
        <div className="mt-2 text-sm font-semibold text-[#7E69AB]">
          {achievement.points} points
        </div>
      </CardContent>
    </Card>
  );
}