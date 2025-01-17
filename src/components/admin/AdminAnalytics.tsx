import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminAnalyticsProps {
  organizationId: string;
}

export function AdminAnalytics({ organizationId }: AdminAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics', organizationId],
    queryFn: async () => {
      const { data: userMetrics, error: userError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('organization_id', organizationId);

      if (userError) throw userError;

      return {
        userMetrics: userMetrics || [],
      };
    },
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  const chartData = analytics?.userMetrics.map(metric => ({
    name: metric.user_id,
    score: metric.security_score,
    completed: metric.courses_completed
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" name="Security Score" />
                <Bar dataKey="completed" fill="#82ca9d" name="Courses Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}