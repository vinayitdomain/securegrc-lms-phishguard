import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

  const { data: trainingContent } = useQuery({
    queryKey: ['training-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .eq('status', 'published');
      
      if (error) throw error;
      return data;
    }
  });

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
          question_type: "multiple_choice",
          options: ["", ""],
          correct_answer: "",
          order_number: 0,
        },
      ],
    },
  });

  const onSubmit = async (values: QuizFormValues) => {
    try {
      // Insert quiz
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

      // Insert questions
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
        question_type: "multiple_choice",
        options: ["", ""],
        correct_answer: "",
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
    form.setValue(`questions.${questionIndex}.options`, [...question.options, ""]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues("questions");
    const question = questions[questionIndex];
    form.setValue(
      `questions.${questionIndex}.options`,
      question.options.filter((_, i) => i !== optionIndex)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach to Training Content</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select training content" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainingContent?.map((content) => (
                        <SelectItem key={content.id} value={content.id}>
                          {content.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passing_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passing Score (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {form.watch("questions").map((question, questionIndex) => (
            <Card key={questionIndex}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.question_type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select
                        onValueChange={(value: "multiple_choice" | "true_false") => {
                          field.onChange(value);
                          if (value === "true_false") {
                            form.setValue(`questions.${questionIndex}.options`, ["True", "False"]);
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {question.question_type === "multiple_choice" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Options</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                    {question.options.map((_, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.options.${optionIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder={`Option ${optionIndex + 1}`} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOption(questionIndex, optionIndex)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.correct_answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {question.options.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
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