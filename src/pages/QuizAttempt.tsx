import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  order_number: number;
}

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
        .select('*, training_content(*)')
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
      return data as QuizQuestion[];
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
    const passed = score >= (quiz.passing_score || 80);

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

      if (passed) {
        toast({
          title: "Congratulations!",
          description: `You passed with a score of ${score}%!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Quiz Failed",
          description: `You scored ${score}%. You need ${quiz.passing_score || 80}% to pass. Please review the content again and retry.`,
        });

        // Reset content progress to force rewatching/reviewing
        if (quiz.content_id) {
          const { error: progressError } = await supabase
            .from('user_content_progress')
            .update({
              completed: false,
              progress_percentage: 0
            })
            .eq('content_id', quiz.content_id);

          if (progressError) {
            console.error('Error resetting content progress:', progressError);
          }
        }
      }

      // Navigate back to content if failed, or to quiz list if passed
      navigate(passed ? '/learning/quizzes' : `/learning/video/${quiz.content_id}`);
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

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <Button variant="outline" onClick={() => navigate('/learning/quizzes')}>
            Exit Quiz
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <p className="font-medium mb-4">
                  {index + 1}. {question.question}
                </p>
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) => 
                    setAnswers(prev => ({
                      ...prev,
                      [question.id]: value
                    }))
                  }
                >
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <label htmlFor={`${question.id}-${option}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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