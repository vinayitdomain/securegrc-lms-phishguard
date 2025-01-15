import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PolicyApprovalWorkflow } from "@/components/governance/PolicyApprovalWorkflow";
import { DocumentReviewWorkflow } from "@/components/governance/DocumentReviewWorkflow";
import { GovernanceAuditWorkflow } from "@/components/governance/GovernanceAuditWorkflow";
import { WorkflowDashboard } from "@/components/workflow/WorkflowDashboard";

export default function GovernanceManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Governance Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="policies">Policy Approvals</TabsTrigger>
            <TabsTrigger value="documents">Document Reviews</TabsTrigger>
            <TabsTrigger value="audits">Governance Audits</TabsTrigger>
          </TabsList>

          <Card className="mt-6">
            <TabsContent value="dashboard" className="m-0">
              <div className="p-6">
                <WorkflowDashboard />
              </div>
            </TabsContent>

            <TabsContent value="policies" className="m-0">
              <div className="p-6">
                <PolicyApprovalWorkflow />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="m-0">
              <div className="p-6">
                <DocumentReviewWorkflow />
              </div>
            </TabsContent>

            <TabsContent value="audits" className="m-0">
              <div className="p-6">
                <GovernanceAuditWorkflow />
              </div>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}