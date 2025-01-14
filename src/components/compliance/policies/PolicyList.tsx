import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function PolicyList() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['policyCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: policies } = useQuery({
    queryKey: ['policies', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('compliance_policies')
        .select(`
          *,
          category:policy_categories(name),
          versions:policy_versions(version_number, created_at)
        `);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500';
      case 'pending_review':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'archived':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Policies</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Policy
        </Button>
      </div>

      <div className="flex gap-4">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {policies?.map((policy) => (
          <Card key={policy.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{policy.title}</h3>
                <p className="text-sm text-gray-500">{policy.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    {policy.category?.name || 'Uncategorized'}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    Version {policy.current_version}
                  </Badge>
                  <Badge className={getStatusColor(policy.approval_status)}>
                    {policy.approval_status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}