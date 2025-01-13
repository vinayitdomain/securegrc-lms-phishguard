import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import VideoPlayer from "@/components/video/VideoPlayer";
import { VideoDescription } from "@/components/video/VideoDescription";
import { VideoHeader } from "@/components/video/VideoHeader";
import { VideoProgress } from "@/components/video/VideoProgress";
import { QuizButton } from "@/components/video/QuizButton";
import { useVideoData } from "@/hooks/video/useVideoData";
import { useVideoProgress } from "@/hooks/video/useVideoProgress";
import { useQuizAttempt } from "@/hooks/quiz/useQuizAttempt";
import { useNavigate } from "react-router-dom";

export default function VideoPlayerPage() {
  return <VideoPlayer />;
}