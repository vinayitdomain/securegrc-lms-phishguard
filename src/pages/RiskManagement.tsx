import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskList } from "@/components/risk/RiskList";
import { CreateRiskForm } from "@/components/risk/CreateRiskForm";
import { WorkflowTemplateBuilder } from "@/components/workflow/WorkflowTemplateBuilder";
import { TaskAssignmentManager } from "@/components/workflow/TaskAssignmentManager";
import { WorkflowDashboard } from "@/components/workflow/WorkflowDashboard";

export default function RiskManagement() {
  const [activeTab, setActiveTab] = useState("risks");

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-6">
          <CreateRiskForm />
          <RiskList />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <WorkflowDashboard />
          <WorkflowTemplateBuilder />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskAssignmentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}