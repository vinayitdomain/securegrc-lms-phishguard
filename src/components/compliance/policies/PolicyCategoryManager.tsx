import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PolicyCategoryManager() {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  const { data: categories, refetch } = useQuery({
    queryKey: ['policyCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddCategory = async () => {
    try {
      const { error } = await supabase
        .from('policy_categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      setNewCategory({ name: "", description: "" });
      setIsAdding(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Policy Categories</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4">
          <div className="space-y-4">
            <Input
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategory({ name: "", description: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Save Category</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {categories?.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}