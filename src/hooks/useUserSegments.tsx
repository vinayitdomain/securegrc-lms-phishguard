import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserSegment {
  segment_type: string;
  segment_score: number;
  last_calculated_at: string;
}

export function useUserSegments() {
  return useQuery({
    queryKey: ['user-segments'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_segments')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserSegment[];
    }
  });
}