import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Control } from "react-hook-form";
import { Question } from "@/types/quiz";
import { QuestionText } from "./question/QuestionText";
import { QuestionType } from "./question/QuestionType";
import { QuestionOptions } from "./question/QuestionOptions";
import { QuestionAnswer } from "./question/QuestionAnswer";

interface QuizQuestionProps {
  control: Control<any>;
  questionIndex: number;
  onRemoveQuestion: (index: number) => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  question: Question;
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

      <QuestionText control={control} questionIndex={questionIndex} />
      <QuestionType control={control} questionIndex={questionIndex} />

      {question.question_type === "multiple_choice" && (
        <QuestionOptions
          control={control}
          questionIndex={questionIndex}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
          options={question.options}
        />
      )}

      <QuestionAnswer
        control={control}
        questionIndex={questionIndex}
        options={question.options}
      />
    </div>
  );
}