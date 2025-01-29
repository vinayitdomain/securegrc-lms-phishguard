import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseProgress {
  id: string;
  training_content: {
    title: string;
    description: string;
  };
  progress_percentage: number;
}

interface CourseProgressListProps {
  courseProgress: CourseProgress[];
}

export function CourseProgressList({ courseProgress }: CourseProgressListProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => navigate('/training')}
    >
      <CardHeader>
        <CardTitle className="text-[#1A1F2C]">My Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {courseProgress?.map((course) => (
          <div key={course.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-[#1A1F2C]">{course.training_content.title}</h4>
                <p className="text-sm text-[#8E9196]">{course.training_content.description}</p>
              </div>
              <span className="text-sm font-medium text-[#7E69AB]">{course.progress_percentage}%</span>
            </div>
            <Progress value={course.progress_percentage} className="h-2 bg-[#F1F0FB]" />
            <Button 
              variant="outline" 
              className="w-full border-[#9b87f5] text-[#7E69AB] hover:bg-[#E5DEFF] hover:text-[#6E59A5]"
            >
              Continue Learning
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}