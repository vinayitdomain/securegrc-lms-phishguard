import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/types/quiz";

interface QuizFormScoreProps {
  control: Control<QuizFormData>;
}

export function QuizFormScore({ control }: QuizFormScoreProps) {
  return (
    <FormField
      control={control}
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
  );
}