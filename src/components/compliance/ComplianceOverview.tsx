import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceFrameworkCard } from "./ComplianceFrameworkCard";
import { ComplianceHeatmap } from "./ComplianceHeatmap";
import { Skeleton } from "@/components/ui/skeleton";

export function ComplianceOverview() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: frameworks, isLoading: isLoadingFrameworks } = useQuery({
    queryKey: ['compliance-frameworks', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id,
  });

  if (isLoadingProfile || isLoadingFrameworks) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-[400px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ComplianceHeatmap />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {frameworks?.map((framework) => (
          <ComplianceFrameworkCard
            key={framework.id}
            id={framework.id}
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