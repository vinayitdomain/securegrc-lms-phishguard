import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WorkflowInstanceViewer } from "@/components/workflow/WorkflowInstanceViewer";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export function PolicyApprovalWorkflow() {
  const { toast } = useToast();

  const { data: pendingPolicies, isLoading } = useQuery({
    queryKey: ['pending-policy-approvals'],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error('Not authenticated');

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('user_id', profile.user.id)
        .single();

      if (!userProfile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('compliance_policies')
        .select(`
          id,
          title,
          description,
          approval_status,
          workflow_template_id,
          workflow_instances!inner (
            id,
            status,
            current_step,
            workflow_assignments (
              id,
              action_type,
              status,
              assigned_to,
              profiles:assigned_to (
                full_name
              )
            )
          )
        `)
        .eq('organization_id', userProfile.organization_id)
        .eq('approval_status', 'pending_review');

      if (error) throw error;
      return data || [];
    },
  });

  const handleApprove = async (policyId: string, assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('workflow_assignments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Policy approval step completed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Policy Approvals</h2>
      
      {pendingPolicies && pendingPolicies.length > 0 ? (
        pendingPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{policy.title}</span>
                <Badge variant={policy.approval_status === 'approved' ? 'default' : 'secondary'}>
                  {policy.approval_status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{policy.description}</p>
                
                {policy.workflow_instances && policy.workflow_instances.map((instance) => (
                  <div key={instance.id} className="border rounded-lg p-4">
                    <WorkflowInstanceViewer entityId={policy.id} />
                    
                    {instance.workflow_assignments?.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          {assignment.status === 'pending' ? (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          ) : assignment.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span>{assignment.action_type}</span>
                          <span className="text-sm text-muted-foreground">
                            - {assignment.profiles?.full_name}
                          </span>
                        </div>
                        
                        {assignment.status === 'pending' && (
                          <Button
                            onClick={() => handleApprove(policy.id, assignment.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No pending policy approvals
          </CardContent>
        </Card>
      )}
    </div>
  );
}