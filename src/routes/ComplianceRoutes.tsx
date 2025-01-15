import { Routes, Route } from "react-router-dom";
import ComplianceManagement from "@/pages/ComplianceManagement";
import VendorCompliance from "@/pages/VendorCompliance";
import { ComplianceDocuments } from "@/components/compliance/documents/ComplianceDocumentList";
import { ComplianceFrameworks } from "@/components/compliance/ComplianceFrameworkCard";
import { CompliancePolicies } from "@/components/compliance/policies/PolicyList";

export function ComplianceRoutes() {
  return (
    <Routes>
      <Route index element={<ComplianceManagement />} />
      <Route path="vendors/*" element={<VendorCompliance />} />
      <Route path="documents" element={<ComplianceDocuments />} />
      <Route path="frameworks" element={<ComplianceFrameworks />} />
      <Route path="policies" element={<CompliancePolicies />} />
    </Routes>
  );
}