import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['quiz-questions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order_number');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async () => {
    if (!questions || !quiz) return;

    const totalQuestions = questions.length;
    let correctAnswers = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= (quiz.passing_score || 70);

    try {
      const { error } = await supabase
        .from('user_quiz_attempts')
        .insert({
          quiz_id: id,
          score,
          passed,
          answers
        });

      if (error) throw error;

      toast({
        title: passed ? "Congratulations!" : "Quiz Completed",
        description: `You scored ${score}%. ${passed ? "You passed!" : "Try again to improve your score."}`,
      });

      navigate('/training/quizzes');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
      });
    }
  };

  if (quizLoading || questionsLoading) {
    return <div>Loading...</div>;
  }

  if (!quiz || !questions) {
    return <div>Quiz not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <Button variant="outline" onClick={() => navigate('/training/quizzes')}>
            Exit Quiz
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <p className="font-medium mb-4">
                  {index + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option: string) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        id={`${question.id}-${option}`}
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => 
                          setAnswers(prev => ({
                            ...prev,
                            [question.id]: e.target.value
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`${question.id}-${option}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}