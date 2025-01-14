import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RiskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  // Validate UUID format
  const isValidUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const { data: risk, isLoading, error } = useQuery({
    queryKey: ['risk', id],
    queryFn: async () => {
      if (!isValidUUID) {
        throw new Error('Invalid risk ID');
      }

      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          category:risk_categories(name),
          assigned_to:profiles(full_name),
          created_by:profiles!risk_assessments_created_by_fkey(full_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!isValidUUID,
  });

  if (!isValidUUID) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Invalid Risk Assessment ID</h2>
        <p className="mt-2 text-gray-600">The requested risk assessment could not be found.</p>
        <Button 
          className="mt-4"
          onClick={() => navigate('/risks')}
        >
          Return to Risk List
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Risk Assessment</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <Button 
          className="mt-4"
          onClick={() => navigate('/risks')}
        >
          Return to Risk List
        </Button>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Risk Assessment Not Found</h2>
        <p className="mt-2 text-gray-600">The requested risk assessment could not be found.</p>
        <Button 
          className="mt-4"
          onClick={() => navigate('/risks')}
        >
          Return to Risk List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{risk.title}</h1>
          <p className="text-muted-foreground">
            Created by {risk.created_by?.full_name} • Category: {risk.category?.name}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            risk.risk_level === 'critical'
              ? 'bg-red-100 text-red-800'
              : risk.risk_level === 'high'
              ? 'bg-orange-100 text-orange-800'
              : risk.risk_level === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {risk.risk_level}
        </span>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="mitigation">Mitigation Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{risk.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Impact Score</h3>
                <p className="text-muted-foreground">{risk.impact_score}/10</p>
              </div>
              <div>
                <h3 className="font-medium">Likelihood Score</h3>
                <p className="text-muted-foreground">{risk.likelihood_score}/10</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Assigned To</h3>
              <p className="text-muted-foreground">{risk.assigned_to?.full_name || 'Unassigned'}</p>
            </div>
          </TabsContent>
          <TabsContent value="mitigation" className="space-y-4">
            <div>
              <h3 className="font-medium">Mitigation Plan</h3>
              <p className="text-muted-foreground">{risk.mitigation_plan || 'No mitigation plan defined'}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-muted-foreground capitalize">{risk.status}</p>
            </div>
            {risk.due_date && (
              <div>
                <h3 className="font-medium">Due Date</h3>
                <p className="text-muted-foreground">
                  {new Date(risk.due_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}