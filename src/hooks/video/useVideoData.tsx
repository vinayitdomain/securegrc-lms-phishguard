import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const useVideoData = (videoId: string | undefined) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      if (!videoId) throw new Error('No video ID provided');
      
      const { data: video, error } = await supabase
        .from('training_videos')
        .select(`
          *,
          quiz:quizzes!quizzes_video_id_fkey (*)
        `)
        .eq('id', videoId)
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
        quiz: video.quiz?.[0],
        publicUrl: signedUrlData.signedUrl
      };

      return transformedData;
    },
    enabled: !!videoId
  });
};