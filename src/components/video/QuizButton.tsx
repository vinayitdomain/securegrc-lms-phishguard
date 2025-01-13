import { Button } from "@/components/ui/button";

interface QuizButtonProps {
  onQuizStart: () => void;
  hasPassed: boolean;
}

export const QuizButton = ({ onQuizStart, hasPassed }: QuizButtonProps) => (
  <div className="flex justify-end mt-4">
    <Button onClick={onQuizStart}>
      {hasPassed ? 'Retake Quiz' : 'Take Quiz'}
    </Button>
  </div>
);