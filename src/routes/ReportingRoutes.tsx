import { Routes, Route } from "react-router-dom";
import Analytics from "@/pages/Analytics";
import Reports from "@/pages/Reports";
import { CourseProgressReport } from "@/components/reports/CourseProgressReport";
import { QuizPerformanceReport } from "@/components/reports/QuizPerformanceReport";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ReportingRoutes() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      return data;
    },
  });

  return (
    <Routes>
      <Route index element={<Analytics />} />
      <Route path="reports" element={<Reports />} />
      <Route 
        path="course-progress" 
        element={
          <CourseProgressReport 
            organizationId={profile?.organization_id} 
            dateRange={null}
          />
        } 
      />
      <Route 
        path="quiz-performance" 
        element={
          <QuizPerformanceReport 
            organizationId={profile?.organization_id}
            dateRange={null}
          />
        } 
      />
    </Routes>
  );
}