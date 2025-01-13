import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/types/quiz";

interface QuestionAnswerProps {
  control: Control<QuizFormData>;
  questionIndex: number;
  options: string[];
}

export function QuestionAnswer({ control, questionIndex, options }: QuestionAnswerProps) {
  // Filter out empty or whitespace-only options
  const validOptions = options.filter(option => option && option.trim() !== '');

  return (
    <FormField
      control={control}
      name={`questions.${questionIndex}.correct_answer`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Correct Answer</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validOptions.map((option, index) => (
                <SelectItem 
                  key={`${option}-${index}`} 
                  value={option}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}