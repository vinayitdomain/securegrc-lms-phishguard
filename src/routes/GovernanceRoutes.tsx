import { Routes, Route } from "react-router-dom";
import GovernanceManagement from "@/pages/GovernanceManagement";
import { PolicyApprovalWorkflow } from "@/components/governance/PolicyApprovalWorkflow";
import { DocumentReviewWorkflow } from "@/components/governance/DocumentReviewWorkflow";
import { GovernanceAuditWorkflow } from "@/components/governance/GovernanceAuditWorkflow";
import { VendorCompliance } from "@/pages/VendorCompliance";

export function GovernanceRoutes() {
  return (
    <Routes>
      <Route index element={<GovernanceManagement />} />
      <Route path="policies/approval" element={<PolicyApprovalWorkflow />} />
      <Route path="documents/review" element={<DocumentReviewWorkflow />} />
      <Route path="audits" element={<GovernanceAuditWorkflow />} />
      <Route path="vendors/*" element={<VendorCompliance />} />
    </Routes>
  );
}