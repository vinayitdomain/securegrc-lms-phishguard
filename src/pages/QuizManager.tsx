import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QuizForm } from "@/components/quiz/QuizForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function QuizManager() {
  const navigate = useNavigate();
  
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          description,
          passing_score,
          status,
          content_id,
          training_content!left (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Quiz Manager</h1>
          <Button onClick={() => navigate('/training')}>Back to Training</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
            <QuizForm />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Quizzes</h2>
            <div className="space-y-4">
              {quizzes?.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                    {quiz.training_content && (
                      <p className="text-sm text-gray-500 mb-2">
                        Associated Content: {quiz.training_content.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">
                      Passing Score: {quiz.passing_score}%
                    </p>
                    <Button 
                      onClick={() => navigate(`/training/quiz/${quiz.id}`)}
                      className="w-full"
                    >
                      View Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}