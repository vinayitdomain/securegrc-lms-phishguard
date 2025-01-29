import { Routes, Route } from "react-router-dom";
import { PolicyList } from "@/components/compliance/policies/PolicyList";
import { ComplianceFrameworkCard } from "@/components/compliance/ComplianceFrameworkCard";
import { ComplianceDocumentList } from "@/components/compliance/documents/ComplianceDocumentList";

export function ComplianceRoutes() {
  return (
    <Routes>
      <Route index element={<ComplianceDocumentList />} />
      <Route path="documents" element={<ComplianceDocumentList />} />
      <Route path="documents/review" element={<ComplianceDocumentList />} />
      <Route path="policies" element={<PolicyList />} />
      <Route path="policies/approval" element={<PolicyList />} />
      <Route path="frameworks" element={<ComplianceFrameworkCard />} />
    </Routes>
  );
}