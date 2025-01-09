import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CampaignStatsProps {
  sent: number;
  clicked: number;
  pending: number;
}

export function CampaignStats({ sent, clicked, pending }: CampaignStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Emails Sent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sent}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Click Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {sent ? Math.round((clicked / sent) * 100) : 0}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending}</div>
        </CardContent>
      </Card>
    </div>
  );
}