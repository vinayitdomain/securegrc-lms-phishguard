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
  
  const { data: videoData, isLoading: isLoadingVideo } = useVideoData(id);
  const { videoRef, progress, hasCompleted } = useVideoProgress(id);
  const { data: quizAttempt } = useQuizAttempt(videoData?.quiz?.id);

  const handleQuizStart = () => {
    if (!videoData?.quiz?.id) {
      toast({
        title: "No Quiz Available",
        description: "This video doesn't have an associated quiz.",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/learning/quiz/${videoData.quiz.id}`);
  };

  if (isLoadingVideo) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const showQuizButton = hasCompleted && videoData?.quiz;
  const needsToRewatch = quizAttempt && !quizAttempt.passed;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <VideoHeader 
          title={videoData?.title || ''} 
          needsToRewatch={needsToRewatch} 
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          {videoData?.publicUrl && (
            <div className="space-y-4">
              <div className="aspect-video mb-4">
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full rounded"
                  src={videoData.publicUrl}
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

              {showQuizButton && (
                <QuizButton 
                  onQuizStart={handleQuizStart}
                  hasPassed={!!quizAttempt?.passed}
                />
              )}
            </div>
          )}

          <VideoDescription description={videoData?.description} />
        </div>
      </div>
    </DashboardLayout>
  );
}