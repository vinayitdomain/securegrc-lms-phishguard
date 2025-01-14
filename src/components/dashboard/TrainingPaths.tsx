import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TrainingPaths() {
  const navigate = useNavigate();
  
  const { data: paths, isLoading } = useQuery({
    queryKey: ['training-paths'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!profile?.role) throw new Error('No role found');

      const { data: paths, error } = await supabase
        .from('training_paths')
        .select(`
          *,
          user_training_progress (
            completed_items,
            completed_at
          ),
          training_path_items (
            id,
            content_id,
            quiz_id,
            training_content (
              is_global
            )
          )
        `)
        .eq('target_role', profile.role)
        .eq('status', 'active');

      if (error) throw error;
      return paths;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Paths</CardTitle>
        </CardHeader>
        <CardContent>
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (!paths?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No training paths assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Paths</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {paths.map((path) => {
          const totalItems = path.training_path_items?.length || 0;
          const completedItems = Array.isArray(path.user_training_progress?.[0]?.completed_items) 
            ? path.user_training_progress[0].completed_items.length 
            : 0;
          const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
          const isCompleted = path.user_training_progress?.[0]?.completed_at;

          return (
            <div key={path.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{path.title}</h3>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>
                <Button 
                  variant={isCompleted ? "secondary" : "default"}
                  onClick={() => navigate(`/training/path/${path.id}`)}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      {progress > 0 ? 'Continue' : 'Start'} Training
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>
                    {path.training_path_items?.filter(item => item.content_id)?.length || 0} Videos
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {path.training_path_items?.filter(item => item.quiz_id)?.length || 0} Quizzes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}