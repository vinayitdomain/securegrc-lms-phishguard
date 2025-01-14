import { MetricsChart } from "./MetricsChart";
import { ComplianceOverview } from "../compliance/ComplianceOverview";

interface DashboardChartsProps {
  campaignMetrics: Array<{ name: string; value: number }>;
}

export function DashboardCharts({ campaignMetrics }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Compliance Frameworks</h2>
        <ComplianceOverview />
      </div>
      <div className="col-span-3">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Campaign Activity</h2>
        <MetricsChart data={campaignMetrics} />
      </div>
    </div>
  );
}