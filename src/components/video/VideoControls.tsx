import { useToast } from "@/hooks/use-toast";
import { VideoProgress } from "./VideoProgress";

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  progress: number;
  contentUrl: string;
}

export const VideoControls = ({ videoRef, progress, contentUrl }: VideoControlsProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="aspect-video mb-4">
        <video
          ref={videoRef}
          controls
          className="w-full h-full rounded"
          src={contentUrl}
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
  );
};