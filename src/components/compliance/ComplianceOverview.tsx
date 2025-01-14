import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComplianceFrameworkCard } from "./ComplianceFrameworkCard";
import { ComplianceHeatmap } from "./ComplianceHeatmap";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldAlert, TrendingUp, Lock } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";

export function ComplianceOverview() {
  const { hasPermission } = usePermissions();
  const { toast } = useToast();

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

  const { data: complianceOverview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['compliance-overview', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) throw new Error('No organization found');
      if (!hasPermission('policy_view')) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view compliance data",
          variant: "destructive",
        });
        throw new Error('Permission denied');
      }

      const { data, error } = await supabase
        .from('organization_compliance_overview')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id && hasPermission('policy_view'),
  });

  const { data: frameworks, isLoading: isLoadingFrameworks } = useQuery({
    queryKey: ['compliance-frameworks', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) throw new Error('No organization found');
      if (!hasPermission('policy_view')) {
        return [];
      }

      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id && hasPermission('policy_view'),
  });

  if (!hasPermission('policy_view')) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Lock className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Access Restricted</h3>
          <p className="text-sm text-muted-foreground">
            You don't have permission to view compliance data
          </p>
        </div>
      </Card>
    );
  }

  if (isLoadingProfile || isLoadingFrameworks || isLoadingOverview) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-[400px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ShieldCheck className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <Shield className="h-5 w-5 text-yellow-500" />;
    if (score >= 40) return <Shield className="h-5 w-5 text-orange-500" />;
    return <ShieldAlert className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Score Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            {getScoreIcon(complianceOverview?.overall_score || 0)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(complianceOverview?.overall_score || 0)}`}>
              {complianceOverview?.overall_score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Combined compliance score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Framework Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(complianceOverview?.framework_score || 0)}`}>
              {complianceOverview?.framework_score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Framework implementation score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Score</CardTitle>
            <Shield className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(complianceOverview?.audit_score || 0)}`}>
              {complianceOverview?.audit_score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on audit findings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Score</CardTitle>
            <Shield className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(complianceOverview?.incident_score || 0)}`}>
              {complianceOverview?.incident_score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on recent incidents
            </p>
          </CardContent>
        </Card>
      </div>

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