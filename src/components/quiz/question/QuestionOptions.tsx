import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { Control } from "react-hook-form";
import { QuizFormData } from "@/types/quiz";

interface QuestionOptionsProps {
  control: Control<QuizFormData>;
  questionIndex: number;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  options: string[];
}

export function QuestionOptions({ 
  control, 
  questionIndex, 
  onAddOption, 
  onRemoveOption,
  options 
}: QuestionOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Options</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAddOption(questionIndex)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
      {options.map((option, optionIndex) => (
        <div key={optionIndex} className="flex gap-2">
          <FormField
            control={control}
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
            onClick={() => onRemoveOption(questionIndex, optionIndex)}
            disabled={options.length <= 2}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}