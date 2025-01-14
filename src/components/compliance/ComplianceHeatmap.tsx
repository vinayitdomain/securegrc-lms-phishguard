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
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {complianceData?.map((item, index) => {
                    const cellWidth = 100 / CATEGORIES.length;
                    const cellHeight = 100 / DEPARTMENTS.length;
                    const x = (CATEGORIES.indexOf(item.category) * cellWidth) + '%';
                    const y = (DEPARTMENTS.indexOf(item.department) * cellHeight) + '%';

                    return (
                      <div
                        key={`${item.department}-${item.category}`}
                        style={{
                          position: 'absolute',
                          left: x,
                          top: y,
                          width: cellWidth + '%',
                          height: cellHeight + '%',
                          backgroundColor: colorScale(item.score),
                          border: '1px solid white',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.score > 60 ? 'black' : 'white',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                        }}
                        title={`${item.department} - ${item.category}: ${item.score}%`}
                      >
                        {item.score}%
                      </div>
                    );
                  })}
                </div>
                <div className="absolute left-0 top-0 flex flex-col h-full justify-around pr-2 font-medium">
                  {DEPARTMENTS.map(dept => (
                    <div key={dept} className="text-sm">{dept}</div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-around pt-2 font-medium">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className="text-sm transform -rotate-45 origin-left">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-4 flex justify-center items-center gap-4">
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