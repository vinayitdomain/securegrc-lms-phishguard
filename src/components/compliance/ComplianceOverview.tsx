import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceFrameworkCard } from "./ComplianceFrameworkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ComplianceOverview() {
  const { data: frameworks, isLoading } = useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[100px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {frameworks?.map((framework) => (
        <ComplianceFrameworkCard
          key={framework.id}
          name={framework.name}
          description={framework.description}
          complianceScore={framework.compliance_score}
          lastAssessmentDate={framework.last_assessment_date}
          nextAssessmentDate={framework.next_assessment_date}
        />
      ))}
    </div>
  );
}