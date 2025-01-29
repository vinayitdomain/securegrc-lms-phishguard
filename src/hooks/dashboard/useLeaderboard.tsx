import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .maybeSingle();

      if (!profile?.organization_id) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('organization_leaderboard')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
}