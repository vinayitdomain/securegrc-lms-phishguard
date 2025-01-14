import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowAction {
  type: string;
  assignee_role: string;
  description: string;
  deadline_days: number;
}

interface WorkflowTemplate {
  name: string;
  description: string;
  trigger_type: string;
  trigger_conditions: Record<string, any>;
  actions: WorkflowAction[];
}

export function WorkflowTemplateBuilder() {
  const { toast } = useToast();
  const [template, setTemplate] = useState<WorkflowTemplate>({
    name: "",
    description: "",
    trigger_type: "risk_assessment",
    trigger_conditions: {},
    actions: [],
  });

  const addAction = () => {
    setTemplate(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: "review",
          assignee_role: "org_admin",
          description: "",
          deadline_days: 7
        }
      ]
    }));
  };

  const removeAction = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: keyof WorkflowAction, value: any) => {
    setTemplate(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase
        .from('workflow_templates')
        .insert({
          organization_id: profile?.organization_id,
          name: template.name,
          description: template.description,
          trigger_type: template.trigger_type,
          trigger_conditions: template.trigger_conditions,
          actions: template.actions as unknown as Json // Type assertion to match Supabase's Json type
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workflow template created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create workflow template",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Workflow Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Template Name"
            value={template.name}
            onChange={e => setTemplate(prev => ({ ...prev, name: e.target.value }))}
          />
          <Textarea
            placeholder="Description"
            value={template.description}
            onChange={e => setTemplate(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Workflow Actions</h3>
          {template.actions.map((action, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Select
                    value={action.type}
                    onValueChange={value => updateAction(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="notify">Notify</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={action.assignee_role}
                    onValueChange={value => updateAction(index, 'assignee_role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assignee Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org_admin">Organization Admin</SelectItem>
                      <SelectItem value="user">Regular User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Description"
                    value={action.description}
                    onChange={e => updateAction(index, 'description', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Deadline (days)"
                    value={action.deadline_days}
                    onChange={e => updateAction(index, 'deadline_days', parseInt(e.target.value))}
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
      </CardContent>
    </Card>
  );
}