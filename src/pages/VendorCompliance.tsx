import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VendorList } from "@/components/compliance/vendors/VendorList";
import { VendorAssessments } from "@/components/compliance/vendors/VendorAssessments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function VendorCompliance() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Vendor Compliance Management</h1>
        </div>

        <Tabs defaultValue="vendors">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          <Card className="mt-6">
            <TabsContent value="vendors" className="m-0">
              <div className="p-6">
                <VendorList />
              </div>
            </TabsContent>

            <TabsContent value="assessments" className="m-0">
              <div className="p-6">
                <VendorAssessments />
              </div>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}