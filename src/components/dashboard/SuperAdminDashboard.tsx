import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical, TrendingUp, Users, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const monthlyData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 70 },
];

const projectStats = [
  { title: "Total Clients", value: "68", growth: "+4.5%", chart: monthlyData },
  { title: "Total Projects", value: "562", subtitle: "This Month Stats", chart: monthlyData },
  { title: "New Projects", value: "892", subtitle: "+8.5% Last month", chart: monthlyData },
];

export function SuperAdminDashboard() {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FC] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Monthly
          </Button>
          <Button variant="outline" size="sm">
            Weekly
          </Button>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="flex justify-between items-center p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Manage your project in one touch</h2>
            <p className="text-purple-100 max-w-md">
              Let Fillow manage your project automatically with our best AI systems
            </p>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              Try Free Now
            </Button>
          </div>
          <div className="hidden lg:block">
            <img 
              src="/lovable-uploads/7150c82a-3141-47eb-a510-c610809e28d0.png" 
              alt="Dashboard illustration" 
              className="w-64 h-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                )}
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.chart}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fillow Company Profile Website Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations?.slice(0, 3).map((org, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      {org.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-gray-500">
                        {org.subscription_plan} Plan
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}