import { useState } from "react";
import { IncidentForm } from "./IncidentForm";
import { IncidentList } from "./IncidentList";
import { IncidentDetails } from "./IncidentDetails";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function IncidentManager() {
  const [view, setView] = useState<'list' | 'new' | { type: 'details', id: string }>('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Incident Management</h1>
        {view === 'list' && (
          <Button onClick={() => setView('new')}>
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        )}
      </div>

      {view === 'list' && <IncidentList />}
      {view === 'new' && (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setView('list')}
          >
            Back to List
          </Button>
          <IncidentForm />
        </div>
      )}
      {view.type === 'details' && (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setView('list')}
          >
            Back to List
          </Button>
          <IncidentDetails incidentId={view.id} />
        </div>
      )}
    </div>
  );
}