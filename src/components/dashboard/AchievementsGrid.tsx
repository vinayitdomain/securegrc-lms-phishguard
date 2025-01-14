import { AchievementCard } from "./AchievementCard";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AchievementsGridProps {
  achievements: Achievement[];
  earnedAchievements: string[];
}

export function AchievementsGrid({ achievements, earnedAchievements }: AchievementsGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          earned={earnedAchievements.includes(achievement.id)}
        />
      ))}
    </div>
  );
}