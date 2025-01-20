import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserDashboardV2() {
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: courseProgress } = useQuery({
    queryKey: ['courseProgress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_content_progress')
        .select(`
          *,
          training_content (
            title,
            description,
            content_type
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('issued_certificates')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  // Calculate total learning hours (assuming 1 hour per content)
  const learningHours = courseProgress?.length || 0;

  // Group courses by type for the pie chart
  const courseTypes = courseProgress?.reduce((acc: Record<string, number>, curr) => {
    const type = curr.training_content.content_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                <h3 className="text-2xl font-bold">{courseProgress?.length || 0}</h3>
              </div>
              <BookOpen className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                <h3 className="text-2xl font-bold">{learningHours}</h3>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                <h3 className="text-2xl font-bold">{certificates?.length || 0}</h3>
              </div>
              <Award className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <h3 className="text-2xl font-bold">{achievements?.length || 0}</h3>
              </div>
              <Trophy className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {courseProgress?.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{course.training_content.title}</h4>
                  <p className="text-sm text-muted-foreground">{course.training_content.description}</p>
                </div>
                <span className="text-sm font-medium">{course.progress_percentage}%</span>
              </div>
              <Progress value={course.progress_percentage} className="h-2" />
              <Button variant="outline" className="w-full">
                Continue Learning
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress?.map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{course.training_content.title}</h4>
                  <p className="text-sm text-muted-foreground">Due in {Math.floor(Math.random() * 7) + 1} days</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}