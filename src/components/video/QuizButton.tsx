import { Button } from "@/components/ui/button";

interface QuizButtonProps {
  onQuizStart: () => void;
  hasPassed: boolean;
  isVisible: boolean;
}

export const QuizButton = ({ onQuizStart, hasPassed, isVisible }: QuizButtonProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="flex justify-end mt-4">
      <Button onClick={onQuizStart}>
        {hasPassed ? 'Retake Quiz' : 'Take Quiz'}
      </Button>
    </div>
  );
};