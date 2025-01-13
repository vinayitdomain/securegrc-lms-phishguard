import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { VideoProgress } from "@/components/video/VideoProgress";
import { QuizButton } from "@/components/video/QuizButton";
import { VideoDescription } from "@/components/video/VideoDescription";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  organization_id: string;
  passing_score: number;
  status: string;
  created_at: string;
  updated_at: string;
  video_id: string;
}

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: number | null;
  organization_id: string | null;
  created_by: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  quiz?: Quiz;
  publicUrl?: string;
}

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const { data: videoData, isLoading: isLoadingVideo } = useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!id) throw new Error('No video ID provided');
      
      const { data: video, error } = await supabase
        .from('training_videos')
        .select(`
          *,
          quiz:quizzes!quizzes_video_id_fkey (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!video) throw new Error('Video not found');

      const { data: signedUrlData } = await supabase.storage
        .from('training_videos')
        .createSignedUrl(video.video_url, 3600);

      if (!signedUrlData?.signedUrl) {
        throw new Error('Failed to get video URL');
      }

      const transformedData: VideoData = {
        ...video,
        quiz: video.quiz?.[0] || null,
        publicUrl: signedUrlData.signedUrl
      };

      return transformedData;
    }
  });

  const { data: progress_data } = useQuery({
    queryKey: ['video-progress', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_video_progress')
        .select('*')
        .eq('video_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: quizAttempt } = useQuery({
    queryKey: ['quiz-attempt', videoData?.quiz?.id],
    queryFn: async () => {
      if (!videoData?.quiz?.id) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .select('*')
        .eq('quiz_id', videoData.quiz.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!videoData?.quiz?.id
  });

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(Math.round(currentProgress));
        
        if (currentProgress >= 95 && !hasCompleted) {
          setHasCompleted(true);
          updateProgress(true);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [hasCompleted]);

  const updateProgress = async (completed: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) return;

    const { error } = await supabase
      .from('user_video_progress')
      .upsert({
        user_id: user.id,
        video_id: id,
        progress_percentage: progress,
        completed,
        last_watched_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

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

  const showQuizButton = hasCompleted || progress_data?.completed;
  const needsToRewatch = quizAttempt && !quizAttempt.passed && progress_data?.completed;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/learning/videos')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{videoData?.title}</h1>
          
          {needsToRewatch && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-yellow-700">
                You need to watch the video again before retaking the quiz.
              </p>
            </div>
          )}

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

              {showQuizButton && videoData?.quiz && (
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