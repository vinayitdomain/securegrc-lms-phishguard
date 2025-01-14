import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceFrameworkCard } from "./ComplianceFrameworkCard";
import { ComplianceHeatmap } from "./ComplianceHeatmap";

export function ComplianceOverview() {
  const { data: frameworks, isLoading } = useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading compliance data...</div>;
  }

  return (
    <div className="space-y-6">
      <ComplianceHeatmap />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {frameworks?.map((framework) => (
          <ComplianceFrameworkCard
            key={framework.id}
            name={framework.name}
            description={framework.description}
            complianceScore={framework.compliance_score || 0}
            lastAssessmentDate={framework.last_assessment_date}
            nextAssessmentDate={framework.next_assessment_date}
          />
        ))}
      </div>
    </div>
  );
}