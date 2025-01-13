import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuizFormData, Question } from "@/types/quiz";

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

export const useQuizForm = () => {
  const { toast } = useToast();

  const form = useForm<QuizFormData>({
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

  const onSubmit = async (values: QuizFormData) => {
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

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
  };
};