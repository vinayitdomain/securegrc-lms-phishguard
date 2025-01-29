import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { ComplianceRoutes } from "./routes/ComplianceRoutes";
import { TrainingRoutes } from "./routes/TrainingRoutes";
import { GovernanceRoutes } from "./routes/GovernanceRoutes";
import { RiskRoutes } from "./routes/RiskRoutes";
import { ReportingRoutes } from "./routes/ReportingRoutes";
import Calendar from "./pages/Calendar";
import AuditManagement from "./pages/AuditManagement";
import VendorCompliance from "./pages/VendorCompliance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
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
        
        {/* Calendar Route */}
        <Route path="/calendar" element={<Calendar />} />

        {/* Audit Management Routes */}
        <Route path="/audits/*" element={<AuditManagement />} />
        
        {/* Course Progress Route */}
        <Route path="/course-progress" element={<Dashboard />} />

        {/* Vendor Assessment Routes */}
        <Route path="/assessments/*" element={<VendorCompliance />} />
      </Routes>
    </Router>
  );
}

export default App;