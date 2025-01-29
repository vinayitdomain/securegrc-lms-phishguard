import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseDeadline {
  id: string;
  training_content: {
    title: string;
  };
}

interface DeadlinesListProps {
  courseProgress: CourseDeadline[];
}

export function DeadlinesList({ courseProgress }: DeadlinesListProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => navigate('/calendar')}
    >
      <CardHeader>
        <CardTitle className="text-[#1A1F2C]">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courseProgress?.map((course) => (
            <div key={course.id} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#1A1F2C]">{course.training_content.title}</h4>
                <p className="text-sm text-[#8E9196]">Due in {Math.floor(Math.random() * 7) + 1} days</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-[#9b87f5] text-[#7E69AB] hover:bg-[#E5DEFF] hover:text-[#6E59A5]"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}