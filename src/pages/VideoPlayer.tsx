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
      
      const { data, error } = await supabase
        .from('training_videos')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!id
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
          
          {video.video_url && (
            <div className="aspect-video mb-4">
              <video
                ref={videoRef}
                controls
                className="w-full h-full rounded"
                src={supabase.storage.from('training_videos').getPublicUrl(video.video_url).data.publicUrl}
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