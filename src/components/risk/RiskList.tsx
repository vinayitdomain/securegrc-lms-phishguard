import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RiskAssessmentOverview } from "./RiskAssessmentOverview";
import { Plus, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RiskList() {
  const navigate = useNavigate();

  const { data: riskAssessments, isLoading } = useQuery({
    queryKey: ['riskAssessments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get all profiles for the user and select the first one
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Failed to fetch profile');
      }
      
      if (!profiles || profiles.length === 0) throw new Error('No profile found');
      const profile = profiles[0]; // Take the first profile
      if (!profile.organization_id) throw new Error('No organization found');

      // Then get risk assessments for the organization
      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          category:risk_categories(name),
          assigned_to:profiles!risk_assessments_assigned_to_fkey(full_name)
        `)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Risk Management</h1>
        <Button onClick={() => navigate('/risks/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Risk Assessment
        </Button>
      </div>

      <RiskAssessmentOverview />

      <div className="grid gap-4">
        {riskAssessments?.map((risk) => (
          <Card 
            key={risk.id}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate(`/risks/${risk.id}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{risk.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {risk.category.name} • Assigned to: {risk.assigned_to?.full_name || 'Unassigned'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    risk.risk_level === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : risk.risk_level === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : risk.risk_level === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {risk.risk_level}
                </span>
                {(risk.risk_level === 'critical' || risk.risk_level === 'high') && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}