import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportExport } from "./ReportExport";

interface QuizPerformanceReportProps {
  organizationId: string | undefined;
  dateRange: { from: Date; to: Date } | null;
}

export function QuizPerformanceReport({ organizationId, dateRange }: QuizPerformanceReportProps) {
  const { data: quizData, isLoading } = useQuery({
    queryKey: ['quiz-performance', organizationId, dateRange],
    queryFn: async () => {
      if (!organizationId) return null;
      const { data } = await supabase.rpc('get_quiz_performance_report', {
        org_id: organizationId
      });
      return data;
    },
    enabled: !!organizationId
  });

  if (isLoading) return <div>Loading...</div>;
  if (!quizData) return <div>No data available</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ReportExport
          data={quizData}
          filename="quiz-performance-report"
          title="Quiz Performance Report"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Quiz</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completion Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizData.map((row: any, index: number) => (
            <TableRow key={`${row.user_id}-${index}`}>
              <TableCell>{row.full_name}</TableCell>
              <TableCell>{row.quiz_title}</TableCell>
              <TableCell>{row.score}%</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {row.passed ? 'Passed' : 'Failed'}
                </span>
              </TableCell>
              <TableCell>
                {row.completed_at ? new Date(row.completed_at).toLocaleDateString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}