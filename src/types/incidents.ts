export interface Incident {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reported_by: string;
  assigned_to?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
  reporter: { full_name: string | null };
  assignee: { full_name: string | null } | null;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  user_id: string;
  update_type: string;
  message: string;
  created_at: string;
  author: { full_name: string | null };
}

export interface IncidentAssignment {
  id: string;
  incident_id: string;
  assigned_by: string;
  assigned_to: string;
  notes?: string;
  created_at: string;
}