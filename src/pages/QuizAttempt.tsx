import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuizStepper } from "@/components/quiz/QuizStepper";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { v4 as uuidv4 } from 'uuid';

export default function QuizAttempt() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*, quiz_questions(*)')
        .eq('id', id)
        .single();

      if (quizError) throw quizError;
      return quizData;
    }
  });

  const handleSubmit = async (answers: Record<string, string>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user?.id) {
        throw new Error('User not authenticated');
      }

      const score = calculateScore(answers, quiz?.quiz_questions || []);
      const passed = score >= (quiz?.passing_score || 70);

      const { error } = await supabase
        .from('user_quiz_attempts')
        .insert({
          id: uuidv4(), // Generate UUID for the attempt
          user_id: user.user.id,
          quiz_id: id,
          score,
          passed,
          answers,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: passed ? "Congratulations!" : "Quiz Completed",
        description: `You scored ${score}%. ${passed ? "You passed!" : "Try again to improve your score."}`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-600 mb-8">{quiz.description}</p>
        )}
        <QuizStepper 
          questions={quiz.quiz_questions} 
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}

function calculateScore(
  answers: Record<string, string>, 
  questions: { id: string; correct_answer: string }[]
): number {
  const correctAnswers = questions.filter(
    q => answers[q.id] === q.correct_answer
  ).length;
  return Math.round((correctAnswers / questions.length) * 100);
}