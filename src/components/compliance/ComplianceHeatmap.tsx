import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface ComplianceData {
  category: string;
  department: string;
  score: number;
}

const DEPARTMENTS = ["IT", "HR", "Finance", "Operations", "Legal"];
const CATEGORIES = ["Data Privacy", "Security", "Documentation", "Training", "Reporting"];

const colorScale = (value: number) => {
  if (value >= 80) return "bg-green-500 hover:bg-green-600";
  if (value >= 60) return "bg-yellow-500 hover:bg-yellow-600";
  if (value >= 40) return "bg-orange-500 hover:bg-orange-600";
  return "bg-red-500 hover:bg-red-600";
};

export function ComplianceHeatmap() {
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['compliance-heatmap'],
    queryFn: async () => {
      const { data: frameworks, error } = await supabase
        .from('compliance_frameworks')
        .select('name, compliance_score, requirements');

      if (error) throw error;

      const heatmapData: ComplianceData[] = [];
      DEPARTMENTS.forEach(dept => {
        CATEGORIES.forEach(cat => {
          const relevantFrameworks = frameworks?.filter(f => {
            const reqs = f.requirements as Array<{ department: string; category: string; }>;
            return reqs?.some(r => r.department === dept && r.category === cat);
          });
          
          const score = relevantFrameworks?.length 
            ? Math.round(relevantFrameworks.reduce((acc, curr) => 
                acc + (curr.compliance_score || 0), 0) / relevantFrameworks.length)
            : 0;

          heatmapData.push({ department: dept, category: cat, score });
        });
      });

      return heatmapData;
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-lg" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compliance Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <div className="relative w-full h-full pl-20 pb-32">
            <div className="absolute left-0 top-0 bottom-32 flex flex-col justify-around pr-4">
              {DEPARTMENTS.map(dept => (
                <div key={dept} className="text-sm font-medium">
                  {dept}
                </div>
              ))}
            </div>

            <div className="grid h-[calc(100%-32px)]" 
                 style={{ 
                   gridTemplateColumns: `repeat(${CATEGORIES.length}, 1fr)`,
                   gridTemplateRows: `repeat(${DEPARTMENTS.length}, 1fr)`,
                   gap: '2px'
                 }}>
              {complianceData?.map((item) => (
                <div
                  key={`${item.department}-${item.category}`}
                  className={`${colorScale(item.score)} flex items-center justify-center text-sm font-medium text-white transition-colors duration-200`}
                >
                  {item.score}%
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-20 right-0 flex justify-around h-32">
              {CATEGORIES.map((cat, index) => (
                <div 
                  key={cat} 
                  className="text-sm font-medium transform -rotate-45 origin-top-left whitespace-nowrap"
                  style={{ 
                    position: 'absolute',
                    left: `${(index * (100 / CATEGORIES.length)) + (100 / (2 * CATEGORIES.length))}%`,
                    top: '8px'
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm">Critical (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-sm">Low (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm">Medium (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm">High (&gt;80%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}