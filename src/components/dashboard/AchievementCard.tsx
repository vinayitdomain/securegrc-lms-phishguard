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
        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg' 
        : 'bg-accent/10 hover:bg-accent/20'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {achievement.name}
        </CardTitle>
        {Icon && (
          <Icon className={`h-5 w-5 ${
            earned ? 'text-yellow-600' : 'text-muted-foreground'
          }`} />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80">{achievement.description}</p>
        <div className="mt-2 text-sm font-semibold text-primary dark:text-white">
          {achievement.points} points
        </div>
      </CardContent>
    </Card>
  );
}