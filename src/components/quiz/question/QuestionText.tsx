import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/types/quiz";

interface QuestionTextProps {
  control: Control<QuizFormData>;
  questionIndex: number;
}

export function QuestionText({ control, questionIndex }: QuestionTextProps) {
  return (
    <FormField
      control={control}
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
  );
}