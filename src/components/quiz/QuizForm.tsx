import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { QuizBasicInfo } from "./QuizBasicInfo";
import { QuizQuestion } from "./QuizQuestion";
import { useQuizForm } from "@/hooks/quiz/useQuizForm";

export function QuizForm() {
  const { form, onSubmit, addQuestion, removeQuestion, addOption, removeOption } = useQuizForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
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