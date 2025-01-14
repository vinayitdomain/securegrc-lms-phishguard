import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer } from "recharts";

interface ComplianceData {
  category: string;
  department: string;
  score: number;
}

const DEPARTMENTS = ["IT", "HR", "Finance", "Operations", "Legal"];
const CATEGORIES = ["Data Privacy", "Security", "Documentation", "Training", "Reporting"];

const colorScale = (value: number) => {
  if (value >= 80) return "#22c55e"; // Green for high compliance
  if (value >= 60) return "#eab308"; // Yellow for medium compliance
  if (value >= 40) return "#f97316"; // Orange for low compliance
  return "#ef4444"; // Red for critical gaps
};

export function ComplianceHeatmap() {
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['compliance-heatmap'],
    queryFn: async () => {
      const { data: frameworks, error } = await supabase
        .from('compliance_frameworks')
        .select(`
          name,
          compliance_score,
          requirements
        `);

      if (error) throw error;

      // Transform the data into a heatmap format
      const heatmapData: ComplianceData[] = [];
      DEPARTMENTS.forEach(dept => {
        CATEGORIES.forEach(cat => {
          // Calculate score based on relevant frameworks
          const relevantFrameworks = frameworks?.filter(f => {
            const reqs = f.requirements as Array<{ department: string; category: string; }>;
            return reqs?.some(r => r.department === dept && r.category === cat);
          });
          
          const score = relevantFrameworks?.length 
            ? Math.round(relevantFrameworks.reduce((acc, curr) => 
                acc + (curr.compliance_score || 0), 0) / relevantFrameworks.length)
            : 0;

          heatmapData.push({
            department: dept,
            category: cat,
            score
          });
        });
      });

      return heatmapData;
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compliance Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <div className="recharts-wrapper">
                <div className="relative w-full h-full pl-20"> {/* Removed top padding */}
                  {/* Department labels on the left */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around pr-4">
                    {DEPARTMENTS.map(dept => (
                      <div key={dept} className="text-sm font-medium">
                        {dept}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  <div className="grid h-full" 
                       style={{ 
                         gridTemplateColumns: `repeat(${CATEGORIES.length}, 1fr)`,
                         gridTemplateRows: `repeat(${DEPARTMENTS.length}, 1fr)`,
                         gap: '1px'
                       }}>
                    {complianceData?.map((item, index) => (
                      <div
                        key={`${item.department}-${item.category}`}
                        style={{
                          backgroundColor: colorScale(item.score),
                          transition: 'background-color 0.2s',
                        }}
                        className="flex items-center justify-center text-sm font-medium"
                        title={`${item.department} - ${item.category}: ${item.score}%`}
                      >
                        {item.score}%
                      </div>
                    ))}
                  </div>

                  {/* Category labels at bottom */}
                  <div className="absolute bottom-[-40px] left-20 right-0 flex justify-around">
                    {CATEGORIES.map(cat => (
                      <div 
                        key={cat} 
                        className="text-sm font-medium transform -rotate-45 origin-top-left whitespace-nowrap"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-12 flex justify-center items-center gap-4"> {/* Increased top margin to accommodate rotated labels */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <span className="text-sm">Critical (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500"></div>
            <span className="text-sm">Low (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500"></div>
            <span className="text-sm">Medium (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <span className="text-sm">High (&gt;80%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}