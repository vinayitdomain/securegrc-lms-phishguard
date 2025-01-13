import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/types/quiz";

interface QuestionTypeProps {
  control: Control<QuizFormData>;
  questionIndex: number;
}

export function QuestionType({ control, questionIndex }: QuestionTypeProps) {
  return (
    <FormField
      control={control}
      name={`questions.${questionIndex}.question_type`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Question Type</FormLabel>
          <Select
            onValueChange={(value: "multiple_choice" | "true_false") => {
              field.onChange(value);
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
  );
}