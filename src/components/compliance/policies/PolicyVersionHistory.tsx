import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface PolicyVersionHistoryProps {
  policyId: string;
  currentVersion: number;
  onVersionSelect: (version: number) => void;
}

export function PolicyVersionHistory({
  policyId,
  currentVersion,
  onVersionSelect,
}: PolicyVersionHistoryProps) {
  const { data: versions } = useQuery({
    queryKey: ['policyVersions', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_versions')
        .select(`
          *,
          created_by_user:profiles(full_name)
        `)
        .eq('policy_id', policyId)
        .order('version_number', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Version History</h3>
      
      <div className="space-y-2">
        {versions?.map((version) => (
          <Card
            key={version.id}
            className={`p-4 ${
              version.version_number === currentVersion
                ? "border-primary"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    Version {version.version_number}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {version.changes_summary}
                </p>
                <p className="text-xs text-gray-400">
                  By {version.created_by_user?.full_name} on{" "}
                  {format(new Date(version.created_at), "MMM d, yyyy")}
                </p>
              </div>
              
              <div className="flex gap-2">
                {version.version_number !== currentVersion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVersionSelect(version.version_number)}
                  >
                    {version.version_number < currentVersion ? (
                      <ArrowLeft className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-1" />
                    )}
                    View
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}