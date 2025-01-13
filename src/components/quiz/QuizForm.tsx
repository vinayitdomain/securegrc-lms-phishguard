import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { QuizQuestion } from "./QuizQuestion";
import { useQuizForm } from "@/hooks/quiz/useQuizForm";
import { QuizFormHeader } from "./form/QuizFormHeader";
import { QuizFormContent } from "./form/QuizFormContent";
import { QuizFormScore } from "./form/QuizFormScore";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function QuizForm() {
  const { id } = useParams();
  const { form, onSubmit, addQuestion, removeQuestion, addOption, removeOption } = useQuizForm();

  // Fetch quiz data if we have an ID
  const { data: quizData, isLoading } = useQuery({
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

  // Set form values when quiz data is loaded
  React.useEffect(() => {
    if (quizData && !isLoading) {
      form.reset({
        title: quizData.title,
        description: quizData.description,
        content_id: quizData.content_id,
        passing_score: quizData.passing_score,
        preview_enabled: quizData.preview_enabled,
        questions: quizData.quiz_questions.map((q: any) => ({
          question: q.question,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          order_number: q.order_number
        }))
      });
    }
  }, [quizData, isLoading, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <QuizFormHeader control={form.control} />
            <QuizFormContent control={form.control} />
            <QuizFormScore control={form.control} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {form.watch("questions").map((question, questionIndex) => (
            <Card key={questionIndex}>
              <CardContent className="pt-6">
                <QuizQuestion
                  control={form.control}
                  questionIndex={questionIndex}
                  onRemoveQuestion={removeQuestion}
                  onAddOption={addOption}
                  onRemoveOption={removeOption}
                  question={question}
                />
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            {id ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </Form>
  );
}