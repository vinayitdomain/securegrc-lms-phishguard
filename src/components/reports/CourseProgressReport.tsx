import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportExport } from "./ReportExport";
import { Progress } from "@/components/ui/progress";

interface CourseProgressReportProps {
  organizationId: string | undefined;
  dateRange: { from: Date; to: Date } | null;
}

export function CourseProgressReport({ organizationId, dateRange }: CourseProgressReportProps) {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['course-progress', organizationId, dateRange],
    queryFn: async () => {
      if (!organizationId) return null;
      const { data } = await supabase.rpc('get_course_progress_report', {
        org_id: organizationId
      });
      return data;
    },
    enabled: !!organizationId
  });

  if (isLoading) return <div>Loading...</div>;
  if (!progressData) return <div>No data available</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ReportExport
          data={progressData}
          filename="course-progress-report"
          title="Course Progress Report"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {progressData.map((row: any, index: number) => (
            <TableRow key={`${row.user_id}-${index}`}>
              <TableCell>{row.full_name}</TableCell>
              <TableCell>{row.content_title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={row.progress_percentage} />
                  <span>{row.progress_percentage}%</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {row.completed ? 'Completed' : 'In Progress'}
                </span>
              </TableCell>
              <TableCell>
                {row.last_watched_at ? new Date(row.last_watched_at).toLocaleDateString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}