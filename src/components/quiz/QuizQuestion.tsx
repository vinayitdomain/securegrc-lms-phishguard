import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Plus } from "lucide-react";
import { Control } from "react-hook-form";

interface QuizQuestionProps {
  control: Control<any>;
  questionIndex: number;
  onRemoveQuestion: (index: number) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  question: {
    question: string;
    question_type: "multiple_choice" | "true_false";
    options: string[];
    correct_answer: string;
    order_number: number;
  };
}

export function QuizQuestion({
  control,
  questionIndex,
  onRemoveQuestion,
  onAddOption,
  onRemoveOption,
  question
}: QuizQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onRemoveQuestion(questionIndex)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

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

      <FormField
        control={control}
        name={`questions.${questionIndex}.question_type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Type</FormLabel>
            <Select
              onValueChange={(value: "multiple_choice" | "true_false") => {
                field.onChange(value);
                if (value === "true_false") {
                  field.onChange(value);
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
              onClick={() => onAddOption(questionIndex)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
          {question.options.map((option, optionIndex) => (
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
                disabled={question.options.length <= 2}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <FormField
        control={control}
        name={`questions.${questionIndex}.correct_answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correct Answer</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || question.options[0]}
            >
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
    </div>
  );
}