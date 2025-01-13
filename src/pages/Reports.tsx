import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { CourseProgressReport } from "@/components/reports/CourseProgressReport";
import { QuizPerformanceReport } from "@/components/reports/QuizPerformanceReport";
import { ReportExport } from "@/components/reports/ReportExport";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Reports() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return data;
    }
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports</h1>
        </div>

        <ReportFilters
          organizationId={organizationId}
          setOrganizationId={setOrganizationId}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <Card className="p-6">
          <Tabs defaultValue="course-progress">
            <TabsList>
              <TabsTrigger value="course-progress">Course Progress</TabsTrigger>
              <TabsTrigger value="quiz-performance">Quiz Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="course-progress">
              <CourseProgressReport
                organizationId={organizationId || profile?.organization_id}
                dateRange={dateRange}
              />
            </TabsContent>

            <TabsContent value="quiz-performance">
              <QuizPerformanceReport
                organizationId={organizationId || profile?.organization_id}
                dateRange={dateRange}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}