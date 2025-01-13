import { Progress } from "@/components/ui/progress";

interface VideoProgressProps {
  progress: number;
}

export const VideoProgress = ({ progress }: VideoProgressProps) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-gray-500">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <Progress value={progress} className="w-full" />
  </div>
);