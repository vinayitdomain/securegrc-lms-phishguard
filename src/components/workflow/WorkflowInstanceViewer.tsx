import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export function WorkflowInstanceViewer({ entityId }: { entityId: string }) {
  const { data: instance, isLoading } = useQuery({
    queryKey: ['workflow-instance', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_instances')
        .select(`
          *,
          workflow_assignments(
            *,
            profiles:assigned_to(full_name)
          )
        `)
        .eq('trigger_entity_id', entityId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading workflow...</div>;
  }

  if (!instance) {
    return null;
  }

  const totalSteps = instance.workflow_assignments?.length || 0;
  const completedSteps = instance.workflow_assignments?.filter(
    (a: any) => a.status === 'completed'
  ).length || 0;
  const progress = totalSteps ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Workflow Progress</span>
          <Badge>{instance.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-4">
          {instance.workflow_assignments?.map((assignment: any) => (
            <Card key={assignment.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{assignment.action_type}</h4>
                  <p className="text-sm text-muted-foreground">
                    Assigned to: {assignment.profiles?.full_name}
                  </p>
                </div>
                <Badge variant={assignment.status === 'completed' ? 'default' : 'secondary'}>
                  {assignment.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}