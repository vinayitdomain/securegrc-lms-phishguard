import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface ModuleSettingsProps {
  organizationId: string;
}

export function ModuleSettings({ organizationId }: ModuleSettingsProps) {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['module-configs', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_configurations')
        .select('*')
        .eq('organization_id', organizationId);

      if (error) throw error;
      return data;
    },
  });

  const handleModuleToggle = async (moduleId: string, enabled: boolean) => {
    const { error } = await supabase
      .from('module_configurations')
      .update({ is_enabled: enabled })
      .eq('id', moduleId);

    if (error) {
      console.error('Error updating module configuration:', error);
    }
  };

  if (isLoading) {
    return <div>Loading module settings...</div>;
  }

  return (
    <div className="grid gap-4">
      {modules?.map((module) => (
        <Card key={module.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>{module.module}</Label>
                <p className="text-sm text-muted-foreground">
                  Configure access and features for {module.module} module
                </p>
              </div>
              <Switch
                checked={module.is_enabled}
                onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}