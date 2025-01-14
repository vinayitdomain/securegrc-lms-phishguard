import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: string;
  vendor_id: string;
  assessment_date: string;
  next_assessment_date: string | null;
  overall_score: number | null;
  status: string;
  vendors: {
    name: string;
  };
}

export function VendorAssessments() {
  const { toast } = useToast();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['vendor-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_assessments')
        .select(`
          *,
          vendors (
            name
          )
        `)
        .order('assessment_date', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching assessments",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Assessment[];
    },
  });

  if (isLoading) {
    return <div>Loading assessments...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Vendor Assessments</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments?.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <CardTitle className="text-lg">{assessment.vendors.name}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Last assessed: {new Date(assessment.assessment_date).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.overall_score !== null && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Compliance Score</span>
                      <span className="text-sm font-medium">{assessment.overall_score}%</span>
                    </div>
                    <Progress value={assessment.overall_score} className="h-2" />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assessment.status}
                  </span>
                  {assessment.next_assessment_date && (
                    <span className="text-sm text-muted-foreground">
                      Next: {new Date(assessment.next_assessment_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}