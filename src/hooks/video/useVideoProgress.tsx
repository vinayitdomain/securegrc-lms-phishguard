import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVideoProgress = (videoId: string | undefined) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { toast } = useToast();

  // Fetch initial progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!videoId) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_video_progress')
        .select('*')
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setProgress(data.progress_percentage || 0);
        setHasCompleted(data.completed || false);
      }
    };

    fetchProgress();
  }, [videoId]);

  const updateProgress = async (completed: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !videoId) return;

    const { error } = await supabase
      .from('user_video_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
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

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        if (video.duration) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          const roundedProgress = Math.round(currentProgress);
          setProgress(roundedProgress);
          
          if (currentProgress >= 95 && !hasCompleted) {
            setHasCompleted(true);
            updateProgress(true);
          }
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [hasCompleted, videoId]);

  return {
    videoRef,
    progress,
    hasCompleted,
    updateProgress
  };
};