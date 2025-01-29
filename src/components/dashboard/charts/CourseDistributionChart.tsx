import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";

const DONUT_COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

interface CourseDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function CourseDistributionChart({ data }: CourseDistributionChartProps) {
  const navigate = useNavigate();

  return (
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
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}