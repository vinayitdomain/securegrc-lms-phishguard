import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RequirementMappingTable } from "./RequirementMappingTable";

export function FrameworkDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: framework, isLoading } = useQuery({
    queryKey: ['compliance-framework', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  if (!framework) {
    return <div>Framework not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{framework.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{framework.description}</p>
        </CardContent>
      </Card>

      <RequirementMappingTable frameworkId={framework.id} />
    </div>
  );
}