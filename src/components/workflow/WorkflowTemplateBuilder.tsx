import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

interface WorkflowAction {
  type: string;
  assignee_role: string;
  description: string;
  deadline_days: number;
}

export function WorkflowTemplateBuilder() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("risk_assessment");
  const [actions, setActions] = useState<WorkflowAction[]>([]);

  // Query to get the current user's profile
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const addAction = () => {
    setActions([
      ...actions,
      {
        type: "review",
        assignee_role: "org_admin",
        description: "",
        deadline_days: 7,
      },
    ]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, field: keyof WorkflowAction, value: any) => {
    setActions(
      actions.map((action, i) =>
        i === index ? { ...action, [field]: value } : action
      )
    );
  };

  const handleSubmit = async () => {
    try {
      if (!profile?.organization_id) {
        toast({
          title: "Error",
          description: "Organization not found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('workflow_templates')
        .insert({
          name,
          description,
          organization_id: profile.organization_id,
          trigger_type: triggerType,
          actions: actions as unknown as Json,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workflow template created successfully",
      });

      // Reset form
      setName("");
      setDescription("");
      setTriggerType("risk_assessment");
      setActions([]);
    } catch (error: any) {
      console.error('Error creating workflow template:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create workflow template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          value={triggerType}
          onValueChange={(value) => setTriggerType(value)}
        >
          <option value="risk_assessment">Risk Assessment</option>
          <option value="incident">Incident</option>
          <option value="audit">Audit</option>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Workflow Actions</h3>
        {actions.map((action, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <Select
                  value={action.type}
                  onValueChange={(value) => updateAction(index, 'type', value)}
                >
                  <option value="review">Review</option>
                  <option value="approve">Approve</option>
                  <option value="notify">Notify</option>
                </Select>
                <Select
                  value={action.assignee_role}
                  onValueChange={(value) => updateAction(index, 'assignee_role', value)}
                >
                  <option value="org_admin">Organization Admin</option>
                  <option value="user">Regular User</option>
                </Select>
                <Input
                  placeholder="Description"
                  value={action.description}
                  onChange={(e) => updateAction(index, 'description', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Deadline (days)"
                  value={action.deadline_days}
                  onChange={(e) => updateAction(index, 'deadline_days', parseInt(e.target.value))}
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeAction(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        <Button onClick={addAction} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Create Template
      </Button>
    </div>
  );
}