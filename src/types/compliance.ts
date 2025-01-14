export type ComplianceDocumentStatus = 'draft' | 'published' | 'archived';

export interface ComplianceDocument {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  version: number;
  status: ComplianceDocumentStatus;
  file_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator?: {
    full_name: string | null;
  };
  tags?: ComplianceDocumentTagRelation[];
}

export interface ComplianceDocumentTag {
  id: string;
  name: string;
  organization_id: string;
  created_at: string;
}

export interface ComplianceDocumentTagRelation {
  document_id: string;
  tag_id: string;
  tag: ComplianceDocumentTag;
}

export interface ComplianceDocumentVersion {
  id: string;
  document_id: string;
  version: number;
  file_url: string;
  changes_description: string | null;
  created_by: string;
  created_at: string;
  creator?: {
    full_name: string | null;
  };
}