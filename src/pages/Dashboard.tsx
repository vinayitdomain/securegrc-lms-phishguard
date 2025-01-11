import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Fetch functions
const fetchUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return profile;
};

const fetchOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*');
  
  if (error) throw error;
  return data;
};

const fetchCampaignCount = async () => {
  const { count, error } = await supabase
    .from('phishing_campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  
  if (error) throw error;
  return count || 0;
};

const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
  
  if (error) throw error;
  
  const activeCount = data?.filter(course => course.status === 'active').length || 0;
  const totalCount = data?.length || 0;
  return totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
};

const fetchComplianceStatus = async () => {
  const { data, error } = await supabase
    .from('compliance_frameworks')
    .select('*');
  
  if (error) throw error;
  
  const activeCount = data?.filter(framework => framework.status === 'active').length || 0;
  const totalCount = data?.length || 0;
  return totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
};

const fetchCampaignMetrics = async () => {
  const { data, error } = await supabase
    .from('phishing_campaigns')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (error) throw error;
  
  return data?.map(campaign => ({
    name: new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short' }),
    value: 1
  })) || [];
};

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [realtimeData, setRealtimeData] = useState({
    campaigns: 0,
    courses: 0,
    compliance: 0,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const { data: organizations = [], isLoading: isLoadingOrgs } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    enabled: profile?.role === 'super_admin',
  });

  const { data: activeCampaigns = 0, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['activeCampaigns'],
    queryFn: fetchCampaignCount,
  });

  const { data: courseCompletion = 0, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courseCompletion'],
    queryFn: fetchCourses,
  });

  const { data: complianceStatus = 0, isLoading: isLoadingCompliance } = useQuery({
    queryKey: ['complianceStatus'],
    queryFn: fetchComplianceStatus,
  });

  const { data: campaignMetrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['campaignMetrics'],
    queryFn: fetchCampaignMetrics,
  });

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Change received!', payload);
          toast({
            title: "Dashboard Updated",
            description: `${payload.table} has been updated.`,
          });
          
          // Refresh queries
          queryClient.invalidateQueries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, queryClient]);

  if (isLoadingProfile) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      {profile?.role === 'super_admin' ? (
        <>
          <h2 className="text-2xl font-bold mb-6">Organizations Overview</h2>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingOrgs ? "Loading..." : organizations.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingOrgs ? "Loading..." : organizations.reduce((acc, org) => acc + (org.license_count || 0), 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingOrgs ? "Loading..." : organizations.filter(org => org.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization Name</TableHead>
                      <TableHead>License Count</TableHead>
                      <TableHead>License Start</TableHead>
                      <TableHead>License End</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>{org.name}</TableCell>
                        <TableCell>{org.license_count}</TableCell>
                        <TableCell>
                          {org.license_start_date 
                            ? new Date(org.license_start_date).toLocaleDateString() 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {org.license_end_date 
                            ? new Date(org.license_end_date).toLocaleDateString() 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            org.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {org.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingCampaigns ? "Loading..." : activeCampaigns}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingCourses ? "Loading..." : `${courseCompletion}%`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courseCompletion >= 75 ? "Low" : courseCompletion >= 50 ? "Medium" : "High"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingCompliance ? "Loading..." : `${complianceStatus}%`}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Security Metrics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaignMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1a365d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
