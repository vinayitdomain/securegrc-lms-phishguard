import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVideoProgress = (videoId: string | undefined) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { toast } = useToast();

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
  }, [hasCompleted, videoId]);

  return {
    videoRef,
    progress,
    hasCompleted,
    updateProgress
  };
};