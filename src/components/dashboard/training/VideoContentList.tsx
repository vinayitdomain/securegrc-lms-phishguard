import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoContent {
  id: string;
  training_content: {
    title: string;
  };
  progress_percentage: number;
}

interface VideoContentListProps {
  videoContent: VideoContent[];
}

export function VideoContentList({ videoContent }: VideoContentListProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => navigate('/training/videos')}
    >
      <CardHeader>
        <CardTitle className="text-[#1A1F2C]">Training Videos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videoContent.map((content) => (
          <div key={content.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#F1F0FB]">
            <Video className="h-8 w-8 text-[#7E69AB]" />
            <div className="flex-1">
              <h4 className="font-medium text-[#1A1F2C]">{content.training_content.title}</h4>
              <Progress value={content.progress_percentage} className="h-2 mt-2 bg-[#F1F0FB]" />
            </div>
            <span className="text-sm font-medium text-[#7E69AB]">
              {content.progress_percentage}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}