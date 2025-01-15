import { Routes, Route } from "react-router-dom";
import VideoLibrary from "@/pages/VideoLibrary";
import VideoPlayer from "@/pages/VideoPlayer";
import QuizManager from "@/pages/QuizManager";
import QuizAttempt from "@/pages/QuizAttempt";
import Training from "@/pages/Training";

export function TrainingRoutes() {
  return (
    <Routes>
      <Route index element={<Training />} />
      <Route path="videos" element={<VideoLibrary />} />
      <Route path="video/:id" element={<VideoPlayer />} />
      <Route path="quizzes" element={<QuizManager />} />
      <Route path="quiz/:id" element={<QuizAttempt />} />
    </Routes>
  );
}