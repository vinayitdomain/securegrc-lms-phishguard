import { Routes, Route } from "react-router-dom";
import RiskManagement from "@/pages/RiskManagement";
import { RiskAssessmentOverview } from "@/components/risk/RiskAssessmentOverview";
import { RiskList } from "@/components/risk/RiskList";

export function RiskRoutes() {
  return (
    <Routes>
      <Route index element={<RiskManagement />} />
      <Route path="assessments" element={<RiskAssessmentOverview />} />
      <Route path="list" element={<RiskList />} />
    </Routes>
  );
}