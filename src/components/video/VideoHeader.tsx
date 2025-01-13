import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoHeaderProps {
  title: string;
  needsToRewatch?: boolean;
}

export const VideoHeader = ({ title, needsToRewatch }: VideoHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => navigate('/learning/videos')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>

      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      
      {needsToRewatch && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">
            You need to watch the video again before retaking the quiz.
          </p>
        </div>
      )}
    </>
  );
};