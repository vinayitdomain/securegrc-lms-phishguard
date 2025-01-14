import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield, TrendingUp } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RiskAssessmentOverview() {
  const { data: riskAssessments, isLoading } = useQuery({
    queryKey: ['riskAssessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          category:risk_categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[200px]">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  const highRiskCount = riskAssessments?.filter(
    (risk) => risk.risk_level === 'high' || risk.risk_level === 'critical'
  ).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Risk Assessment</h2>
        <Shield className="h-6 w-6 text-muted-foreground" />
      </div>

      {highRiskCount > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>High Risk Areas Detected</AlertTitle>
          <AlertDescription>
            {highRiskCount} high or critical risk {highRiskCount === 1 ? 'area requires' : 'areas require'} immediate attention
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {riskAssessments?.map((risk) => (
          <div
            key={risk.id}
            className="flex items-center justify-between p-4 rounded-lg bg-muted"
          >
            <div>
              <h3 className="font-medium">{risk.title}</h3>
              <p className="text-sm text-muted-foreground">
                {risk.category.name}
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
              <TrendingUp className={`h-4 w-4 ${
                risk.risk_level === 'critical' || risk.risk_level === 'high'
                  ? 'text-red-500'
                  : 'text-green-500'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}