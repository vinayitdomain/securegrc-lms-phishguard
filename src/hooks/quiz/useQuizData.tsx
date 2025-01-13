import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useQuizData(id: string | undefined) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('Fetching quiz data for ID:', id);
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (*)
        `)
        .eq('id', id)
        .single();

      if (quizError) {
        console.error('Error fetching quiz:', quizError);
        throw quizError;
      }

      console.log('Quiz data fetched:', quiz);
      return quiz;
    },
    enabled: !!id
  });
}