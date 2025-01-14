import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function AuditDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: audit, isLoading } = useQuery({
    queryKey: ['audit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_programs')
        .select(`
          *,
          created_by (
            full_name
          ),
          audit_checklists (
            *,
            audit_checklist_items (
              *
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading audit details...</div>;
  }

  if (!audit) {
    return <div>Audit not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{audit.title}</h2>
          <p className="text-gray-500">{audit.description}</p>
        </div>
        <Badge>{audit.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label className="text-sm text-gray-500">Created By</label>
          <p>{audit.created_by?.full_name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Created At</label>
          <p>{formatDate(audit.created_at)}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Start Date</label>
          <p>{audit.start_date ? formatDate(audit.start_date) : 'Not set'}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">End Date</label>
          <p>{audit.end_date ? formatDate(audit.end_date) : 'Not set'}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklists">Checklists</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Audit Progress</h3>
            {/* Progress tracking will be implemented here */}
            <div className="text-gray-500">Progress tracking coming soon...</div>
          </div>
        </TabsContent>

        <TabsContent value="checklists">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Checklists</h3>
              <Button>Add Checklist</Button>
            </div>
            {audit.audit_checklists?.length ? (
              <div className="space-y-4">
                {audit.audit_checklists.map((checklist: any) => (
                  <div key={checklist.id} className="border p-4 rounded-lg">
                    <h4 className="font-medium">{checklist.title}</h4>
                    <p className="text-sm text-gray-500">{checklist.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No checklists created yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="findings">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Findings</h3>
              <Button>Add Finding</Button>
            </div>
            <p className="text-gray-500">No findings recorded yet.</p>
          </div>
        </TabsContent>

        <TabsContent value="evidence">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Evidence</h3>
              <Button>Upload Evidence</Button>
            </div>
            <p className="text-gray-500">No evidence uploaded yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}