import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ComplianceOverview } from "@/components/compliance/ComplianceOverview";
import { ComplianceDocumentList } from "@/components/compliance/documents/ComplianceDocumentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function ComplianceManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Compliance Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <Card className="mt-6">
            <TabsContent value="overview" className="m-0">
              <div className="p-6">
                <ComplianceOverview />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="m-0">
              <div className="p-6">
                <ComplianceDocumentList />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="m-0">
              <div className="p-6">
                <iframe 
                  src="/calendar" 
                  className="w-full h-[800px] border-0"
                  title="Compliance Calendar"
                />
              </div>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}