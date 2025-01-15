import { Routes, Route } from "react-router-dom";
import ComplianceManagement from "@/pages/ComplianceManagement";
import VendorCompliance from "@/pages/VendorCompliance";
import { ComplianceDocumentList } from "@/components/compliance/documents/ComplianceDocumentList";
import { ComplianceFrameworkCard } from "@/components/compliance/ComplianceFrameworkCard";
import { PolicyList } from "@/components/compliance/policies/PolicyList";

export function ComplianceRoutes() {
  return (
    <Routes>
      <Route index element={<ComplianceManagement />} />
      <Route path="vendors/*" element={<VendorCompliance />} />
      <Route path="documents" element={<ComplianceDocumentList />} />
      <Route path="frameworks" element={<ComplianceFrameworkCard />} />
      <Route path="policies" element={<PolicyList />} />
    </Routes>
  );
}