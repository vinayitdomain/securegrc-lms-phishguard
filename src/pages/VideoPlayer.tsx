import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: video, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!id) throw new Error('No video ID provided');
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error('Invalid video ID format');
      }

      const { data, error } = await supabase
        .from('training_videos')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching video:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Video not found');
      }

      // Get the public URL for the video
      const { data: publicUrlData } = await supabase.storage
        .from('training_videos')
        .createSignedUrl(data.video_url, 3600); // 1 hour signed URL

      if (!publicUrlData?.signedUrl) {
        console.error('Failed to get signed URL for video');
        throw new Error('Failed to get video URL');
      }

      return {
        ...data,
        publicUrl: publicUrlData.signedUrl
      };
    },
    enabled: !!id,
    retry: false,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to load video",
          variant: "destructive",
        });
        navigate('/training/videos');
      }
    }
  });

  useEffect(() => {
    if (video?.video_url) {
      const trackProgress = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('user_video_progress')
          .upsert({
            user_id: user.id,
            video_id: id,
            progress_percentage: Math.round((videoRef.current?.currentTime || 0) / (videoRef.current?.duration || 1) * 100),
            last_watched_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error updating progress:', error);
        }
      };

      const interval = setInterval(trackProgress, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [video, id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!video) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Button
            variant="outline"
            onClick={() => navigate('/training/videos')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p>Video not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/training/videos')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
          
          {video.publicUrl && (
            <div className="aspect-video mb-4">
              <video
                ref={videoRef}
                controls
                className="w-full h-full rounded"
                src={video.publicUrl}
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
          )}

          {video.description && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p>{video.description}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}