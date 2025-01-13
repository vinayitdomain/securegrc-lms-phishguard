import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoPlayer as VideoPlayerComponent } from "@/components/video/VideoPlayer";
import { VideoDescription } from "@/components/video/VideoDescription";
import { VideoHeader } from "@/components/video/VideoHeader";
import { VideoProgress } from "@/components/video/VideoProgress";
import { QuizButton } from "@/components/video/QuizButton";
import { useVideoData } from "@/hooks/video/useVideoData";
import { useVideoProgress } from "@/hooks/video/useVideoProgress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  content_id: string;
  organization_id: string | null;
  passing_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const { data: video, isLoading: isLoadingVideo } = useQuery({
    queryKey: ['training_content', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error loading video",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['quizzes', video?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('content_id', video?.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          toast({
            title: "Error loading quiz",
            description: error.message,
            variant: "destructive",
          });
        }
        return null;
      }

      return data as Quiz;
    },
    enabled: !!video?.id,
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['user_content_progress', video?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_content_progress')
        .select('*')
        .eq('content_id', video?.id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          toast({
            title: "Error loading progress",
            description: error.message,
            variant: "destructive",
          });
        }
        return null;
      }

      return data;
    },
    enabled: !!video?.id,
  });

  const { data: quizAttempt, isLoading: isLoadingQuizAttempt } = useQuery({
    queryKey: ['user_quiz_attempts', quiz?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .select('*')
        .eq('quiz_id', quiz?.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          toast({
            title: "Error loading quiz attempt",
            description: error.message,
            variant: "destructive",
          });
        }
        return null;
      }

      return data;
    },
    enabled: !!quiz?.id,
  });

  const updateProgress = async (progressPercentage: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isComplete = progressPercentage >= 100;
    const { error } = await supabase
      .from('user_content_progress')
      .upsert({
        user_id: user.id,
        content_id: video?.id,
        progress_percentage: progressPercentage,
        completed: isComplete,
        last_watched_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoadingVideo || isLoadingProgress || isLoadingQuiz || isLoadingQuizAttempt) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!video) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Video not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <VideoHeader title={video.title} />
        <div className="aspect-video">
          <VideoPlayerComponent
            url={video.video_url}
            onProgress={updateProgress}
            initialProgress={progress?.progress_percentage || 0}
          />
        </div>
        <VideoProgress progress={progress?.progress_percentage || 0} />
        <VideoDescription description={video.description || ''} />
        {quiz && (
          <QuizButton
            onQuizStart={() => setIsQuizStarted(true)}
            hasPassed={!!quizAttempt?.passed}
            isVisible={!isQuizStarted && progress?.completed}
          />
        )}
      </div>
    </DashboardLayout>
  );
}