import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Target {
  id: string;
  email: string;
  status: string;
  clicked: boolean;
  clicked_at: string | null;
}

interface Campaign {
  id: string;
  name: string;
}

interface CampaignDetailsProps {
  campaign: Campaign;
  targets: Target[];
  stats: {
    sent: number;
    clicked: number;
  };
}

export function CampaignDetails({ campaign, targets, stats }: CampaignDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Details: {campaign.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="targets">
          <TabsList>
            <TabsTrigger value="targets">Targets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="targets">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clicked</TableHead>
                  <TableHead>Clicked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targets?.map((target) => (
                  <TableRow key={target.id}>
                    <TableCell>{target.email}</TableCell>
                    <TableCell>{target.status}</TableCell>
                    <TableCell>{target.clicked ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {target.clicked_at
                        ? new Date(target.clicked_at).toLocaleString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    {
                      name: "Sent",
                      value: stats.sent,
                    },
                    {
                      name: "Clicked",
                      value: stats.clicked,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1a365d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}