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
  content_id: string | null;
}

interface ContentData {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  content_type: 'video' | 'pdf';
  duration: number | null;
  organization_id: string | null;
  created_by: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  quiz?: Quiz | null;
  publicUrl?: string;
}

export const useVideoData = (contentId: string | undefined) => {
  return useQuery({
    queryKey: ['content', contentId],
    queryFn: async () => {
      if (!contentId) throw new Error('No content ID provided');
      
      const { data: content, error } = await supabase
        .from('training_content')
        .select(`
          *,
          quiz:quizzes!quizzes_content_id_fkey (*)
        `)
        .eq('id', contentId)
        .maybeSingle();

      if (error) throw error;
      if (!content) throw new Error('Content not found');

      let publicUrl = null;
      if (content.content_type === 'video' && content.video_url) {
        const { data: signedUrlData } = await supabase.storage
          .from('training_videos')
          .createSignedUrl(content.video_url, 3600);
        publicUrl = signedUrlData?.signedUrl;
      } else if (content.content_type === 'pdf' && content.pdf_url) {
        const { data: signedUrlData } = await supabase.storage
          .from('training_videos')
          .createSignedUrl(content.pdf_url, 3600);
        publicUrl = signedUrlData?.signedUrl;
      }

      if (!publicUrl) {
        throw new Error('Failed to get content URL');
      }

      const transformedData: ContentData = {
        ...content,
        quiz: content.quiz?.[0] || null,
        publicUrl
      };

      return transformedData;
    },
    enabled: !!contentId
  });
};