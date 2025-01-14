import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ComplianceFrameworkCardProps {
  name: string;
  description: string | null;
  complianceScore: number;
  lastAssessmentDate: string | null;
  nextAssessmentDate: string | null;
}

export function ComplianceFrameworkCard({
  name,
  description,
  complianceScore,
  lastAssessmentDate,
  nextAssessmentDate,
}: ComplianceFrameworkCardProps) {
  const getComplianceIcon = () => {
    if (complianceScore >= 80) return <ShieldCheck className="h-5 w-5 text-green-500" />;
    if (complianceScore >= 50) return <Shield className="h-5 w-5 text-yellow-500" />;
    return <ShieldAlert className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            {getComplianceIcon()}
            {name}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-4">{description}</div>
        <div className="space-y-2">
          <Progress value={complianceScore} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Compliance Score: {complianceScore}%
          </div>
        </div>
        {lastAssessmentDate && (
          <div className="text-xs text-muted-foreground mt-2">
            Last Assessment: {formatDate(lastAssessmentDate)}
          </div>
        )}
        {nextAssessmentDate && (
          <div className="text-xs text-muted-foreground">
            Next Assessment: {formatDate(nextAssessmentDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}