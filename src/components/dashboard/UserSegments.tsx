import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserSegments } from "@/hooks/useUserSegments";
import { Brain, Shield, Target, BookOpen } from "lucide-react";

const segmentIcons = {
  lms: BookOpen,
  compliance: Shield,
  risk: Target,
  governance: Brain,
};

const segmentTitles = {
  lms: "Learning Progress",
  compliance: "Compliance Status",
  risk: "Risk Assessment",
  governance: "Governance Score",
};

export function UserSegments() {
  const { data: segments = [], isLoading } = useUserSegments();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading segments...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-t-4 border-t-purple-400">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle>Behavioral Segments</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        {segments.map((segment) => {
          const Icon = segmentIcons[segment.segment_type as keyof typeof segmentIcons];
          const title = segmentTitles[segment.segment_type as keyof typeof segmentTitles];
          
          return (
            <div key={segment.segment_type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">{title}</span>
                </div>
                <span className="text-sm font-bold">{segment.segment_score}%</span>
              </div>
              <Progress value={segment.segment_score} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}