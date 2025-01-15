import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceFrameworkCard } from "@/components/compliance/ComplianceFrameworkCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComplianceFrameworks() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      return data;
    },
  });

  const { data: frameworks, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Frameworks</h1>
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