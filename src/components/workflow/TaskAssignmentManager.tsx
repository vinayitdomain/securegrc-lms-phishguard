import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TaskAssignmentManager() {
  const { toast } = useToast();
  
  const { data: assignments, isLoading, refetch } = useQuery({
    queryKey: ['my-workflow-assignments'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('workflow_assignments')
        .select(`
          *,
          workflow_instances(
            trigger_type,
            trigger_entity_id,
            workflow_data
          )
        `)
        .eq('assigned_to', profile.id)
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    },
  });

  const completeTask = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('workflow_assignments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task marked as completed",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments?.map((assignment) => (
          <Card key={assignment.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{assignment.action_type}</h4>
                  <Badge>{assignment.workflow_instances?.trigger_type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </p>
              </div>
              <Button onClick={() => completeTask(assignment.id)}>
                Complete
              </Button>
            </div>
          </Card>
        ))}
        {!assignments?.length && (
          <p className="text-center text-muted-foreground">No pending tasks</p>
        )}
      </CardContent>
    </Card>
  );
}