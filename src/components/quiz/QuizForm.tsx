import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { QuizBasicInfo } from "./QuizBasicInfo";
import { QuizQuestion } from "./QuizQuestion";

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  question_type: z.enum(["multiple_choice", "true_false"]),
  options: z.array(z.string()).min(2, "At least two options are required"),
  correct_answer: z.string().min(1, "Correct answer is required"),
  order_number: z.number(),
});

const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content_id: z.string().optional(),
  passing_score: z.number().min(0).max(100),
  preview_enabled: z.boolean(),
  questions: z.array(questionSchema),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export function QuizForm() {
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      passing_score: 70,
      preview_enabled: false,
      questions: [
        {
          question: "",
          question_type: "multiple_choice" as const,
          options: ["Option 1", "Option 2"],
          correct_answer: "Option 1",
          order_number: 0,
        },
      ],
    },
  });

  const onSubmit = async (values: QuizFormValues) => {
    try {
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title: values.title,
          description: values.description,
          content_id: values.content_id,
          passing_score: values.passing_score,
          preview_enabled: values.preview_enabled,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(
          values.questions.map((q, index) => ({
            quiz_id: quiz.id,
            question: q.question,
            question_type: q.question_type,
            options: q.options,
            correct_answer: q.correct_answer,
            order_number: index + 1,
          }))
        );

      if (questionsError) throw questionsError;

      toast({
        title: "Success",
        description: "Quiz created successfully",
      });

      form.reset();
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create quiz. Please try again.",
      });
    }
  };

  const addQuestion = () => {
    const questions = form.getValues("questions");
    form.setValue("questions", [
      ...questions,
      {
        question: "",
        question_type: "multiple_choice" as const,
        options: ["Option 1", "Option 2"],
        correct_answer: "Option 1",
        order_number: questions.length,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const questions = form.getValues("questions");
    form.setValue(
      "questions",
      questions.filter((_, i) => i !== index)
    );
  };

  const addOption = (questionIndex: number) => {
    const questions = form.getValues("questions");
    const question = questions[questionIndex];
    const newOptionNumber = question.options.length + 1;
    form.setValue(
      `questions.${questionIndex}.options`, 
      [...question.options, `Option ${newOptionNumber}`]
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues("questions");
    const question = questions[questionIndex];
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, newOptions);
    
    if (question.correct_answer === question.options[optionIndex] && newOptions.length > 0) {
      form.setValue(`questions.${questionIndex}.correct_answer`, newOptions[0]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <QuizBasicInfo control={form.control} />
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
          <Button type="submit">Create Quiz</Button>
        </div>
      </form>
    </Form>
  );
}