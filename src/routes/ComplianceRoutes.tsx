import { Routes, Route } from "react-router-dom";
import { PolicyList } from "@/components/compliance/policies/PolicyList";
import { ComplianceDocumentList } from "@/components/compliance/documents/ComplianceDocumentList";
import ComplianceFrameworks from "@/pages/ComplianceFrameworks";
import ComplianceManagement from "@/pages/ComplianceManagement";

export function ComplianceRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ComplianceManagement />} />
      <Route path="/documents" element={<ComplianceDocumentList />} />
      <Route path="/documents/review" element={<ComplianceDocumentList />} />
      <Route path="/policies" element={<PolicyList />} />
      <Route path="/policies/approval" element={<PolicyList />} />
      <Route path="/frameworks" element={<ComplianceFrameworks />} />
    </Routes>
  );
}