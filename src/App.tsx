import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { ComplianceRoutes } from "./routes/ComplianceRoutes";
import { TrainingRoutes } from "./routes/TrainingRoutes";
import { GovernanceRoutes } from "./routes/GovernanceRoutes";
import { RiskRoutes } from "./routes/RiskRoutes";
import { ReportingRoutes } from "./routes/ReportingRoutes";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Compliance Management Routes */}
        <Route path="/compliance/*" element={<ComplianceRoutes />} />
        
        {/* Training & Learning Routes */}
        <Route path="/training/*" element={<TrainingRoutes />} />
        
        {/* Governance Routes */}
        <Route path="/governance/*" element={<GovernanceRoutes />} />
        
        {/* Risk Management Routes */}
        <Route path="/risk/*" element={<RiskRoutes />} />
        
        {/* Reporting & Analytics Routes */}
        <Route path="/reporting/*" element={<ReportingRoutes />} />
        
        {/* Calendar remains a standalone route */}
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;