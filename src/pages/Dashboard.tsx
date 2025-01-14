import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2 } from "lucide-react";
import { OrganizationStats } from "@/components/dashboard/OrganizationStats";
import { OrganizationsTable } from "@/components/dashboard/OrganizationsTable";
import { UserStats } from "@/components/dashboard/UserStats";
import { AchievementCard } from "@/components/dashboard/AchievementCard";
import { Leaderboard } from "@/components/dashboard/Leaderboard";

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

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: userAchievements = [] } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(ua => ua.achievement_id);
    },
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.organization_id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('organization_leaderboard')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('total_points', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
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
            <Building2 className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Organizations Overview
            </h1>
          </div>
          <div className="space-y-6">
            <OrganizationStats 
              organizations={organizations} 
              isLoading={isLoadingOrgs} 
            />
            <OrganizationsTable organizations={organizations} />
          </div>
        </>
      ) : (
        <>
          <UserStats
            activeCampaigns={activeCampaigns}
            courseCompletion={courseCompletion}
            complianceStatus={complianceStatus}
            isLoadingCampaigns={isLoadingCampaigns}
            isLoadingCourses={isLoadingCourses}
            isLoadingCompliance={isLoadingCompliance}
          />
          
          <div className="grid gap-6 mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  earned={userAchievements.includes(achievement.id)}
                />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">
                    Security Metrics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={campaignMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#1a365d"
                          strokeWidth={2}
                          dot={{ fill: '#1a365d' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Leaderboard entries={leaderboard} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
