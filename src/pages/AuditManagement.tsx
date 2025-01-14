import { useQuery } from "@tanstack/react-query";
import { Routes, Route, Link } from "react-router-dom";
import { Plus, ClipboardList, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AuditList } from "@/components/audit/AuditList";
import { AuditDetails } from "@/components/audit/AuditDetails";
import { CreateAuditForm } from "@/components/audit/CreateAuditForm";

export default function AuditManagement() {
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

  const { data: audits, isLoading } = useQuery({
    queryKey: ['audits', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) return null;

      const { data, error } = await supabase
        .from('audit_programs')
        .select(`
          *,
          created_by (
            full_name
          ),
          audit_checklists (
            id
          )
        `)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.organization_id,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Audit Management</h1>
        <Link to="/audits/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Audit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Active Audits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {audits?.filter(a => a.status === 'in_progress').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Critical Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {/* This will be implemented when we add findings tracking */}
              0
            </div>
          </CardContent>
        </Card>
      </div>

      <Routes>
        <Route index element={<AuditList audits={audits} isLoading={isLoading} />} />
        <Route path="create" element={<CreateAuditForm />} />
        <Route path=":id/*" element={<AuditDetails />} />
      </Routes>
    </div>
  );
}