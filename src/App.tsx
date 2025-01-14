import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VideoLibrary from "./pages/VideoLibrary";
import VideoPlayer from "./pages/VideoPlayer";
import QuizManager from "./pages/QuizManager";
import QuizAttempt from "./pages/QuizAttempt";
import Campaigns from "./pages/Campaigns";
import Training from "./pages/Training";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import AuditManagement from "./pages/AuditManagement";
import RiskManagement from "./pages/RiskManagement";
import ComplianceManagement from "./pages/ComplianceManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-library" element={<VideoLibrary />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training/videos" element={<VideoLibrary />} />
        <Route path="/training/quizzes" element={<QuizManager />} />
        <Route path="/learning/quizzes" element={<QuizManager />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/learning/video/:id" element={<VideoPlayer />} />
        <Route path="/quiz/:id" element={<QuizAttempt />} />
        <Route path="/learning/quiz/:id" element={<QuizAttempt />} />
        <Route path="/training/quiz/:id" element={<QuizAttempt />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/audits/*" element={<AuditManagement />} />
        <Route path="/risks/*" element={<RiskManagement />} />
        <Route path="/compliance/*" element={<ComplianceManagement />} />
      </Routes>
    </Router>
  );
}

export default App;