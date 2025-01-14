import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowInstanceViewer } from "@/components/workflow/WorkflowInstanceViewer";
import { supabase } from "@/integrations/supabase/client";

export function RiskDetails() {
  const { id } = useParams();

  const { data: risk, isLoading } = useQuery({
    queryKey: ['risk', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          created_by_profile:profiles!risk_assessments_created_by_fkey(full_name),
          assigned_to_profile:profiles!risk_assessments_assigned_to_fkey(full_name),
          category:risk_categories(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!risk) {
    return <div>Risk not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{risk.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Created by {risk.created_by_profile?.full_name}
              </p>
            </div>
            <Badge>{risk.risk_level}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p>{risk.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium">Category</h3>
              <p>{risk.category?.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Assigned To</h3>
              <p>{risk.assigned_to_profile?.full_name || 'Unassigned'}</p>
            </div>
            <div>
              <h3 className="font-medium">Impact Score</h3>
              <p>{risk.impact_score}/10</p>
            </div>
            <div>
              <h3 className="font-medium">Likelihood Score</h3>
              <p>{risk.likelihood_score}/10</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Mitigation Plan</h3>
            <p>{risk.mitigation_plan}</p>
          </div>
        </CardContent>
      </Card>

      <WorkflowInstanceViewer entityId={id} />
    </div>
  );
}