import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "./stats/DashboardStats";
import { CourseDistributionChart } from "./charts/CourseDistributionChart";
import { VideoContentList } from "./training/VideoContentList";
import { CourseProgressList } from "./courses/CourseProgressList";
import { DeadlinesList } from "./deadlines/DeadlinesList";

export function UserDashboardV2() {
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

  // Calculate total learning hours
  const learningHours = courseProgress?.length || 0;

  // Separate video content
  const videoContent = courseProgress?.filter(
    course => course.training_content.content_type === 'video'
  ) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardStats
        courseCount={courseProgress?.length || 0}
        learningHours={learningHours}
        certificateCount={certificates?.length || 0}
        achievementCount={achievements?.length || 0}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CourseDistributionChart data={donutData} />
        <VideoContentList videoContent={videoContent} />
      </div>

      <CourseProgressList courseProgress={courseProgress || []} />
      <DeadlinesList courseProgress={courseProgress || []} />
    </div>
  );
}