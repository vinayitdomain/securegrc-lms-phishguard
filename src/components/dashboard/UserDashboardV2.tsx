import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Clock, Trophy, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricsChart } from "./MetricsChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";

export function UserDashboardV2() {
  const navigate = useNavigate();
  
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: courseProgress } = useQuery({
    queryKey: ['courseProgress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_content_progress')
        .select(`
          *,
          training_content (
            title,
            description,
            content_type
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('issued_certificates')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  // Calculate course type distribution for donut chart
  const courseTypes = courseProgress?.reduce((acc, course) => {
    const type = course.training_content.content_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const donutData = Object.entries(courseTypes).map(([name, value]) => ({
    name,
    value
  }));

  const DONUT_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

  // Calculate total learning hours
  const learningHours = courseProgress?.length || 0;

  // Separate video content
  const videoContent = courseProgress?.filter(
    course => course.training_content.content_type === 'video'
  ) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className="bg-gradient-to-br from-[#E5DEFF] to-[#D6BCFA] cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/training')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1F2C]">Enrolled Courses</p>
                <h3 className="text-2xl font-bold text-[#7E69AB]">{courseProgress?.length || 0}</h3>
              </div>
              <BookOpen className="h-8 w-8 text-[#6E59A5] opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-[#F2FCE2] to-[#FEF7CD] cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/training')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1F2C]">Learning Hours</p>
                <h3 className="text-2xl font-bold text-[#7E69AB]">{learningHours}</h3>
              </div>
              <Clock className="h-8 w-8 text-[#6E59A5] opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-[#D3E4FD] to-[#FFDEE2] cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/training/certificates')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1F2C]">Certificates</p>
                <h3 className="text-2xl font-bold text-[#7E69AB]">{certificates?.length || 0}</h3>
              </div>
              <Award className="h-8 w-8 text-[#6E59A5] opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/training/achievements')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1F2C]">Achievements</p>
                <h3 className="text-2xl font-bold text-[#7E69AB]">{achievements?.length || 0}</h3>
              </div>
              <Trophy className="h-8 w-8 text-[#6E59A5] opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Distribution Donut Chart */}
        <Card 
          className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/training')}
        >
          <CardHeader>
            <CardTitle className="text-[#1A1F2C]">Course Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Video Content */}
        <Card 
          className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => navigate('/training/videos')}
        >
          <CardHeader>
            <CardTitle className="text-[#1A1F2C]">Training Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {videoContent.map((content) => (
              <div key={content.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#F1F0FB]">
                <Video className="h-8 w-8 text-[#7E69AB]" />
                <div className="flex-1">
                  <h4 className="font-medium text-[#1A1F2C]">{content.training_content.title}</h4>
                  <Progress value={content.progress_percentage} className="h-2 mt-2 bg-[#F1F0FB]" />
                </div>
                <span className="text-sm font-medium text-[#7E69AB]">
                  {content.progress_percentage}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card 
        className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={() => navigate('/training')}
      >
        <CardHeader>
          <CardTitle className="text-[#1A1F2C]">My Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {courseProgress?.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-[#1A1F2C]">{course.training_content.title}</h4>
                  <p className="text-sm text-[#8E9196]">{course.training_content.description}</p>
                </div>
                <span className="text-sm font-medium text-[#7E69AB]">{course.progress_percentage}%</span>
              </div>
              <Progress value={course.progress_percentage} className="h-2 bg-[#F1F0FB]" />
              <Button 
                variant="outline" 
                className="w-full border-[#9b87f5] text-[#7E69AB] hover:bg-[#E5DEFF] hover:text-[#6E59A5]"
              >
                Continue Learning
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card 
        className="bg-white cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={() => navigate('/calendar')}
      >
        <CardHeader>
          <CardTitle className="text-[#1A1F2C]">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress?.map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#1A1F2C]">{course.training_content.title}</h4>
                  <p className="text-sm text-[#8E9196]">Due in {Math.floor(Math.random() * 7) + 1} days</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#9b87f5] text-[#7E69AB] hover:bg-[#E5DEFF] hover:text-[#6E59A5]"
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
