import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2 } from "lucide-react";

// Fetch functions
const fetchUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  console.log("Fetching profile for user:", user.id);
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
  
  console.log("User profile:", profile);
  return profile;
};

const fetchOrganizations = async () => {
  console.log("Fetching organizations...");
  const { data, error } = await supabase
    .from('organizations')
    .select('*');
  
  if (error) {
    console.error("Organizations fetch error:", error);
    throw error;
  }

  console.log("Organizations data:", data);
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
  const [error, setError] = useState<string | null>(null);

  const { 
    data: profile, 
    isLoading: isLoadingProfile,
    error: profileError 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const { 
    data: organizations = [], 
    isLoading: isLoadingOrgs,
    error: orgsError
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    enabled: profile?.role === 'super_admin',
  });

  const { 
    data: activeCampaigns = 0, 
    isLoading: isLoadingCampaigns 
  } = useQuery({
    queryKey: ['activeCampaigns'],
    queryFn: fetchCampaignCount,
    enabled: profile?.role !== 'super_admin',
  });

  const { 
    data: courseCompletion = 0, 
    isLoading: isLoadingCourses 
  } = useQuery({
    queryKey: ['courseCompletion'],
    queryFn: fetchCourses,
    enabled: profile?.role !== 'super_admin',
  });

  const { 
    data: complianceStatus = 0, 
    isLoading: isLoadingCompliance 
  } = useQuery({
    queryKey: ['complianceStatus'],
    queryFn: fetchComplianceStatus,
    enabled: profile?.role !== 'super_admin',
  });

  const { 
    data: campaignMetrics = [], 
    isLoading: isLoadingMetrics 
  } = useQuery({
    queryKey: ['campaignMetrics'],
    queryFn: fetchCampaignMetrics,
    enabled: profile?.role !== 'super_admin',
  });

  useEffect(() => {
    if (profileError) {
      console.error("Profile error:", profileError);
      setError("Error loading profile");
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
    if (orgsError) {
      console.error("Organizations error:", orgsError);
      setError("Error loading organizations");
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      });
    }
  }, [profileError, orgsError, toast]);

  if (isLoadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-red-500">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {profile?.role === 'super_admin' ? (
        <>
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Organizations Overview
            </h1>
          </div>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Total Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {isLoadingOrgs ? "Loading..." : organizations.length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">Active Licenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {isLoadingOrgs ? "Loading..." : organizations.reduce((acc, org) => acc + (org.license_count || 0), 0)}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Active Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {isLoadingOrgs ? "Loading..." : organizations.filter(org => org.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Organizations Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-primary">Organization Name</TableHead>
                      <TableHead className="font-semibold text-primary">License Count</TableHead>
                      <TableHead className="font-semibold text-primary">License Start</TableHead>
                      <TableHead className="font-semibold text-primary">License End</TableHead>
                      <TableHead className="font-semibold text-primary">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{org.name}</TableCell>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
