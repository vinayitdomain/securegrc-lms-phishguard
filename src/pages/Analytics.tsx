import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fetchAnalyticsData = async () => {
  const { data: userMetrics, error: metricsError } = await supabase
    .from('user_metrics')
    .select('*');

  const { data: courseProgress, error: progressError } = await supabase
    .from('user_content_progress')
    .select('*');

  const { data: complianceData, error: complianceError } = await supabase
    .from('compliance_frameworks')
    .select('*');

  if (metricsError || progressError || complianceError) {
    throw new Error('Failed to fetch analytics data');
  }

  return {
    userMetrics: userMetrics || [],
    courseProgress: courseProgress || [],
    complianceData: complianceData || []
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalyticsData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-red-500">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <span>Failed to load analytics data</span>
        </div>
      </DashboardLayout>
    );
  }

  const { userMetrics, courseProgress, complianceData } = data || {};

  // Calculate completion rates
  const completionRate = courseProgress?.reduce((acc, curr) => {
    return curr.completed ? acc + 1 : acc;
  }, 0) / (courseProgress?.length || 1) * 100;

  // Calculate compliance status
  const complianceStatus = complianceData?.reduce((acc, curr) => {
    return curr.status === 'active' ? acc + 1 : acc;
  }, 0) / (complianceData?.length || 1) * 100;

  // Prepare data for charts
  const securityScoreData = userMetrics?.map(metric => ({
    name: new Date(metric.created_at).toLocaleDateString(),
    score: metric.security_score
  })) || [];

  const complianceDistribution = [
    { name: 'Compliant', value: complianceStatus },
    { name: 'Non-Compliant', value: 100 - complianceStatus }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Course Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Security Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (userMetrics?.reduce((acc, curr) => acc + (curr.security_score || 0), 0) || 0) /
                  (userMetrics?.length || 1)
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(complianceStatus)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Security Score Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Security Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={securityScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {complianceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}