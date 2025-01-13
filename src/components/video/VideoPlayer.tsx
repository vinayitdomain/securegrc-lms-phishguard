import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { VideoProgress } from "@/components/video/VideoProgress";
import { QuizButton } from "@/components/video/QuizButton";
import { VideoDescription } from "@/components/video/VideoDescription";
import { VideoHeader } from "@/components/video/VideoHeader";
import { useVideoData } from "@/hooks/video/useVideoData";
import { useVideoProgress } from "@/hooks/video/useVideoProgress";
import { useQuizAttempt } from "@/hooks/quiz/useQuizAttempt";
import { useNavigate } from "react-router-dom";

export default function VideoPlayer() {
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

  const showQuizButton = hasCompleted && contentData?.quiz;
  const needsToRewatch = quizAttempt && !quizAttempt.passed;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <VideoHeader 
          title={contentData?.title || ''} 
          needsToRewatch={needsToRewatch} 
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          {contentData?.publicUrl && contentData.content_type === 'video' && (
            <div className="space-y-4">
              <div className="aspect-video mb-4">
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full rounded"
                  src={contentData.publicUrl}
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    toast({
                      title: "Error",
                      description: "Failed to play video. Please try again later.",
                      variant: "destructive",
                    });
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <VideoProgress progress={progress} />
            </div>
          )}

          {contentData?.publicUrl && contentData.content_type === 'pdf' && (
            <div className="space-y-4">
              <iframe
                src={contentData.publicUrl}
                className="w-full h-[600px] rounded"
                title={contentData.title}
              />
              <VideoProgress progress={100} />
            </div>
          )}

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
}