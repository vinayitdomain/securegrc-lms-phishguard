import { VideoControls } from "./VideoControls";
import { PDFViewer } from "./PDFViewer";

interface ContentViewerProps {
  contentType: 'video' | 'pdf';
  url: string;
  title: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  progress: number;
}

export const ContentViewer = ({ contentType, url, title, videoRef, progress }: ContentViewerProps) => {
  if (!url) return null;

  return contentType === 'video' ? (
    <VideoControls 
      videoRef={videoRef!}
      progress={progress}
      contentUrl={url}
    />
  ) : (
    <PDFViewer url={url} title={title} />
  );
};