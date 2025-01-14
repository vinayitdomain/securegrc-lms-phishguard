import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export function WorkflowDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['workflow-stats'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('workflow_instances')
        .select(`
          *,
          workflow_assignments(*)
        `)
        .eq('organization_id', profile.organization_id);

      if (error) throw error;

      const total = data.length;
      const completed = data.filter(i => i.status === 'completed').length;
      const inProgress = data.filter(i => i.status === 'in_progress').length;
      const pending = total - completed - inProgress;

      return {
        total,
        completed,
        inProgress,
        pending,
        completionRate: total ? (completed / total) * 100 : 0
      };
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.total || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{stats?.inProgress || 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={stats?.completionRate || 0} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.round(stats?.completionRate || 0)}% of workflows completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}