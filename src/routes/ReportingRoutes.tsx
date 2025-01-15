import { Routes, Route } from "react-router-dom";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import { CourseProgressReport } from "@/components/reports/CourseProgressReport";
import { QuizPerformanceReport } from "@/components/reports/QuizPerformanceReport";

export function ReportingRoutes() {
  return (
    <Routes>
      <Route index element={<Analytics />} />
      <Route path="reports" element={<Reports />} />
      <Route path="course-progress" element={<CourseProgressReport />} />
      <Route path="quiz-performance" element={<QuizPerformanceReport />} />
    </Routes>
  );
}