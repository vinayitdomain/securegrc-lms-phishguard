import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_points: number;
  achievements_count: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <Card className="border-t-4 border-t-yellow-400">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={entry.user_id}
              className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                <span className="font-medium">{entry.full_name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{entry.achievements_count} achievements</span>
                <span className="font-bold text-primary">{entry.total_points} points</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}