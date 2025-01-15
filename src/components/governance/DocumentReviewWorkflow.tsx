import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WorkflowInstanceViewer } from "@/components/workflow/WorkflowInstanceViewer";
import { FileText, Clock } from "lucide-react";

export function DocumentReviewWorkflow() {
  const { toast } = useToast();

  const { data: pendingReviews, isLoading } = useQuery({
    queryKey: ['pending-document-reviews'],
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
        .from('compliance_documents')
        .select(`
          id,
          title,
          description,
          status,
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
        .eq('status', 'draft');

      if (error) throw error;
      return data || [];
    },
  });

  const handleReviewComplete = async (documentId: string, assignmentId: string) => {
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
        description: "Document review completed",
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
      <h2 className="text-2xl font-bold">Document Reviews</h2>
      
      {pendingReviews && pendingReviews.length > 0 ? (
        pendingReviews.map((document) => (
          <Card key={document.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>{document.title}</span>
                </div>
                <Badge>{document.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{document.description}</p>
                
                {document.workflow_instances && document.workflow_instances.map((instance) => (
                  <div key={instance.id} className="border rounded-lg p-4">
                    <WorkflowInstanceViewer entityId={document.id} />
                    
                    {instance.workflow_assignments?.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5" />
                          <span>{assignment.action_type}</span>
                          <span className="text-sm text-muted-foreground">
                            - {assignment.profiles?.full_name}
                          </span>
                        </div>
                        
                        {assignment.status === 'pending' && (
                          <Button
                            onClick={() => handleReviewComplete(document.id, assignment.id)}
                          >
                            Complete Review
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
            No pending document reviews
          </CardContent>
        </Card>
      )}
    </div>
  );
}