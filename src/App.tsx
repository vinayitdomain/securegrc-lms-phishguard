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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-library" element={<VideoLibrary />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/quiz-manager" element={<QuizManager />} />
        <Route path="/quiz/:id" element={<QuizAttempt />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/training" element={<Training />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;