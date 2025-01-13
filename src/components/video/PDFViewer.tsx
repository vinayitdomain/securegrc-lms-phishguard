import { VideoProgress } from "./VideoProgress";

interface PDFViewerProps {
  url: string;
  title: string;
}

export const PDFViewer = ({ url, title }: PDFViewerProps) => {
  return (
    <div className="space-y-4">
      <iframe
        src={url}
        className="w-full h-[600px] rounded"
        title={title}
      />
      <VideoProgress progress={100} />
    </div>
  );
};