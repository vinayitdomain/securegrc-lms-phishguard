import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuizButton } from "@/components/video/QuizButton";
import { VideoDescription } from "@/components/video/VideoDescription";
import { VideoHeader } from "@/components/video/VideoHeader";
import { ContentViewer } from "@/components/video/ContentViewer";
import { useVideoData } from "@/hooks/video/useVideoData";
import { useVideoProgress } from "@/hooks/video/useVideoProgress";
import { useQuizAttempt } from "@/hooks/quiz/useQuizAttempt";
import { useNavigate } from "react-router-dom";

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: contentData, isLoading: isLoadingContent } = useVideoData(id);
  const { videoRef, progress, hasCompleted } = useVideoProgress(id);
  const { data: quizAttempt } = useQuizAttempt(contentData?.quiz?.id);

  const handleQuizStart = () => {
    if (!contentData?.quiz?.id) {
      toast({
        title: "No Quiz Available",
        description: "This content doesn't have an associated quiz.",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/learning/quiz/${contentData.quiz.id}`);
  };

  if (isLoadingContent) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  // Only show quiz button if video is completed AND there is a quiz available
  const showQuizButton = hasCompleted && !!contentData?.quiz;
  const needsToRewatch = quizAttempt && !quizAttempt.passed;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <VideoHeader 
          title={contentData?.title || ''} 
          needsToRewatch={needsToRewatch} 
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <ContentViewer
            contentType={contentData?.content_type || 'video'}
            url={contentData?.publicUrl || ''}
            title={contentData?.title || ''}
            videoRef={videoRef}
            progress={progress}
          />

          <QuizButton 
            onQuizStart={handleQuizStart}
            hasPassed={!!quizAttempt?.passed}
            isVisible={showQuizButton}
          />

          <VideoDescription description={contentData?.description} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoPlayer;