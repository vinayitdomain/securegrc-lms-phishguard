import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PolicyFormData {
  title: string;
  description: string;
  category_id: string;
  content: string;
  workflow_template_id?: string;
}

export function PolicyForm({ policyId }: { policyId?: string }) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<PolicyFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { data: workflowTemplates } = useQuery({
    queryKey: ['workflowTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('trigger_type', 'policy_approval');
      
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: PolicyFormData) => {
    try {
      setIsSubmitting(true);

      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error('Not authenticated');

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('user_id', profile.user.id)
        .single();

      if (!userProfile) throw new Error('Profile not found');

      // Start a transaction
      const { data: policy, error: policyError } = await supabase
        .from('compliance_policies')
        .insert({
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          workflow_template_id: data.workflow_template_id,
          approval_status: 'draft',
          organization_id: userProfile.organization_id,
        })
        .select()
        .single();

      if (policyError) throw policyError;

      // Create initial version
      const { error: versionError } = await supabase
        .from('policy_versions')
        .insert({
          policy_id: policy.id,
          content: data.content,
          version_number: 1,
          changes_summary: 'Initial version',
          created_by: userProfile.id,
        });

      if (versionError) throw versionError;

      toast({
        title: "Success",
        description: "Policy created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Policy Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description"
              {...register("description")}
            />
          </div>

          <div>
            <Select
              {...register("category_id", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {errors.category_id && (
              <p className="text-sm text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          <div>
            <Select {...register("workflow_template_id")}>
              <option value="">Select Approval Workflow (Optional)</option>
              {workflowTemplates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Policy Content"
              className="min-h-[200px]"
              {...register("content", { required: "Content is required" })}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Policy"}
          </Button>
        </div>
      </Card>
    </form>
  );
}