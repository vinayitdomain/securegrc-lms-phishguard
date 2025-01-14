export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points: number
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points?: number
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points?: number
          type?: string
        }
        Relationships: []
      }
      audit_checklist_items: {
        Row: {
          assigned_to: string | null
          checklist_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string
          due_date: string | null
          evidence_required: boolean | null
          id: string
          requirement: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          checklist_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description: string
          due_date?: string | null
          evidence_required?: boolean | null
          id?: string
          requirement?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          checklist_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          evidence_required?: boolean | null
          id?: string
          requirement?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_checklist_items_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "audit_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_checklists: {
        Row: {
          audit_id: string | null
          created_at: string | null
          description: string | null
          id: string
          order_number: number
          title: string
        }
        Insert: {
          audit_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_number: number
          title: string
        }
        Update: {
          audit_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_checklists_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audit_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_evidence: {
        Row: {
          checklist_item_id: string | null
          file_type: string | null
          file_url: string
          finding_id: string | null
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          file_type?: string | null
          file_url: string
          finding_id?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          file_type?: string | null
          file_url?: string
          finding_id?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_evidence_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "audit_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_evidence_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "audit_findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_evidence_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          audit_id: string | null
          checklist_item_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          remediation_plan: string | null
          severity: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          audit_id?: string | null
          checklist_item_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          remediation_plan?: string | null
          severity: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          audit_id?: string | null
          checklist_item_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          remediation_plan?: string | null
          severity?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audit_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "audit_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_programs: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          organization_id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          organization_id: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "audit_programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_targets: {
        Row: {
          campaign_id: string
          clicked: boolean
          clicked_at: string | null
          created_at: string | null
          email: string
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          clicked?: boolean
          clicked_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          clicked?: boolean
          clicked_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_targets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "phishing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          status: string | null
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
          template_data?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificate_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "certificate_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_document_tag_relations: {
        Row: {
          document_id: string
          tag_id: string
        }
        Insert: {
          document_id: string
          tag_id: string
        }
        Update: {
          document_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_document_tag_relations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "compliance_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_document_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "compliance_document_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_document_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_document_tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "compliance_document_tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_document_versions: {
        Row: {
          changes_description: string | null
          created_at: string | null
          created_by: string | null
          document_id: string | null
          file_url: string
          id: string
          version: number
        }
        Insert: {
          changes_description?: string | null
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          file_url: string
          id?: string
          version: number
        }
        Update: {
          changes_description?: string | null
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          file_url?: string
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "compliance_document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "compliance_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_documents: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          organization_id: string | null
          status:
            | Database["public"]["Enums"]["compliance_document_status"]
            | null
          title: string
          updated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          organization_id?: string | null
          status?:
            | Database["public"]["Enums"]["compliance_document_status"]
            | null
          title: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          organization_id?: string | null
          status?:
            | Database["public"]["Enums"]["compliance_document_status"]
            | null
          title?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "compliance_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_frameworks: {
        Row: {
          compliance_score: number | null
          created_at: string | null
          description: string | null
          id: string
          last_assessment_date: string | null
          name: string
          next_assessment_date: string | null
          organization_id: string | null
          requirements: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          compliance_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_assessment_date?: string | null
          name: string
          next_assessment_date?: string | null
          organization_id?: string | null
          requirements?: Json | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          compliance_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_assessment_date?: string | null
          name?: string
          next_assessment_date?: string | null
          organization_id?: string | null
          requirements?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_frameworks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "compliance_frameworks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_policies: {
        Row: {
          created_at: string | null
          description: string | null
          evidence_required: boolean | null
          evidence_url: string | null
          framework_id: string | null
          id: string
          last_reviewed_at: string | null
          organization_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          evidence_required?: boolean | null
          evidence_url?: string | null
          framework_id?: string | null
          id?: string
          last_reviewed_at?: string | null
          organization_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          evidence_required?: boolean | null
          evidence_url?: string | null
          framework_id?: string | null
          id?: string
          last_reviewed_at?: string | null
          organization_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_policies_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "compliance_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_requirement_mappings: {
        Row: {
          created_at: string | null
          framework_id: string
          id: string
          last_reviewed_at: string | null
          notes: string | null
          organization_id: string
          policy_id: string
          requirement_key: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          framework_id: string
          id?: string
          last_reviewed_at?: string | null
          notes?: string | null
          organization_id: string
          policy_id: string
          requirement_key: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          framework_id?: string
          id?: string
          last_reviewed_at?: string | null
          notes?: string | null
          organization_id?: string
          policy_id?: string
          requirement_key?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_requirement_mappings_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_requirement_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "compliance_requirement_mappings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_requirement_mappings_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "compliance_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          organization_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_assignments: {
        Row: {
          assigned_by: string
          assigned_to: string
          created_at: string | null
          id: string
          incident_id: string
          notes: string | null
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          created_at?: string | null
          id?: string
          incident_id: string
          notes?: string | null
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          created_at?: string | null
          id?: string
          incident_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_assignments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_updates: {
        Row: {
          created_at: string | null
          id: string
          incident_id: string
          message: string
          update_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          incident_id: string
          message: string
          update_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          incident_id?: string
          message?: string
          update_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_updates_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          id: string
          organization_id: string
          priority: Database["public"]["Enums"]["incident_priority"]
          reported_by: string
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id: string
          priority?: Database["public"]["Enums"]["incident_priority"]
          reported_by: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          priority?: Database["public"]["Enums"]["incident_priority"]
          reported_by?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      issued_certificates: {
        Row: {
          certificate_data: Json
          created_at: string | null
          id: string
          issued_at: string | null
          organization_id: string | null
          quiz_id: string | null
          template_id: string | null
          training_path_id: string | null
          user_id: string | null
        }
        Insert: {
          certificate_data: Json
          created_at?: string | null
          id?: string
          issued_at?: string | null
          organization_id?: string | null
          quiz_id?: string | null
          template_id?: string | null
          training_path_id?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_data?: Json
          created_at?: string | null
          id?: string
          issued_at?: string | null
          organization_id?: string | null
          quiz_id?: string | null
          template_id?: string | null
          training_path_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issued_certificates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "issued_certificates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_certificates_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_certificates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_certificates_training_path_id_fkey"
            columns: ["training_path_id"]
            isOneToOne: false
            referencedRelation: "training_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          organization_id: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          organization_id: string
          read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          organization_id?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_content_access: {
        Row: {
          content_id: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          organization_id: string | null
        }
        Insert: {
          content_id?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          organization_id?: string | null
        }
        Update: {
          content_id?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_content_access_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "training_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_content_access_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_content_access_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          brand_accent_color: string | null
          brand_background_color: string | null
          brand_font_family: string | null
          brand_logo_url: string | null
          brand_primary_color: string | null
          brand_secondary_color: string | null
          brand_text_color: string | null
          created_at: string | null
          dark_mode_enabled: boolean | null
          id: string
          license_count: number | null
          license_end_date: string | null
          license_start_date: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand_accent_color?: string | null
          brand_background_color?: string | null
          brand_font_family?: string | null
          brand_logo_url?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          brand_text_color?: string | null
          created_at?: string | null
          dark_mode_enabled?: boolean | null
          id?: string
          license_count?: number | null
          license_end_date?: string | null
          license_start_date?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_accent_color?: string | null
          brand_background_color?: string | null
          brand_font_family?: string | null
          brand_logo_url?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          brand_text_color?: string | null
          created_at?: string | null
          dark_mode_enabled?: boolean | null
          id?: string
          license_count?: number | null
          license_end_date?: string | null
          license_start_date?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      phishing_campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          organization_id: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          organization_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phishing_campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "phishing_campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          options: Json
          order_number: number
          question: string
          question_type: string
          quiz_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          options: Json
          order_number: number
          question: string
          question_type?: string
          quiz_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          options?: Json
          order_number?: number
          question?: string
          question_type?: string
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          content_id: string | null
          created_at: string | null
          description: string | null
          id: string
          organization_id: string | null
          passing_score: number | null
          preview_enabled: boolean
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          passing_score?: number | null
          preview_enabled?: boolean
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          passing_score?: number | null
          preview_enabled?: boolean
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "quizzes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_video_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "training_content"
            referencedColumns: ["id"]
          },
        ]
      }
      report_configurations: {
        Row: {
          created_at: string | null
          created_by: string | null
          filters: Json | null
          id: string
          name: string
          organization_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          filters?: Json | null
          id?: string
          name: string
          organization_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          filters?: Json | null
          id?: string
          name?: string
          organization_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_configurations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "report_configurations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          assigned_to: string | null
          category_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          impact_score: number | null
          likelihood_score: number | null
          mitigation_plan: string | null
          organization_id: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          impact_score?: number | null
          likelihood_score?: number | null
          mitigation_plan?: string | null
          organization_id: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          impact_score?: number | null
          likelihood_score?: number | null
          mitigation_plan?: string | null
          organization_id?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "risk_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "risk_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "risk_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      training_content: {
        Row: {
          content_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: number | null
          id: string
          is_global: boolean | null
          organization_id: string | null
          pdf_url: string | null
          requires_quiz: boolean
          status: string | null
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_global?: boolean | null
          organization_id?: string | null
          pdf_url?: string | null
          requires_quiz?: boolean
          status?: string | null
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_global?: boolean | null
          organization_id?: string | null
          pdf_url?: string | null
          requires_quiz?: boolean
          status?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_videos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "training_videos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      training_events: {
        Row: {
          content_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          organization_id: string | null
          quiz_id: string | null
          start_time: string
          title: string
          training_path_id: string | null
          updated_at: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          organization_id?: string | null
          quiz_id?: string | null
          start_time: string
          title: string
          training_path_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          organization_id?: string | null
          quiz_id?: string | null
          start_time?: string
          title?: string
          training_path_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_events_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "training_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "training_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_events_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_events_training_path_id_fkey"
            columns: ["training_path_id"]
            isOneToOne: false
            referencedRelation: "training_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      training_path_items: {
        Row: {
          content_id: string | null
          created_at: string | null
          id: string
          order_number: number
          path_id: string | null
          quiz_id: string | null
          required: boolean | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          id?: string
          order_number: number
          path_id?: string | null
          quiz_id?: string | null
          required?: boolean | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          id?: string
          order_number?: number
          path_id?: string | null
          quiz_id?: string | null
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "training_path_items_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "training_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_path_items_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "training_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_path_items_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      training_paths: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          organization_id: string | null
          status: string | null
          target_role: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          target_role: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          status?: string | null
          target_role?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_paths_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "training_paths_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          organization_id: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_achievements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_content_progress: {
        Row: {
          completed: boolean | null
          content_id: string | null
          created_at: string | null
          id: string
          last_watched_at: string | null
          progress_percentage: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_video_progress_video_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "training_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          courses_completed: number | null
          created_at: string | null
          id: string
          last_activity: string | null
          organization_id: string
          phishing_tests_passed: number | null
          security_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          courses_completed?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          organization_id: string
          phishing_tests_passed?: number | null
          security_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          courses_completed?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          organization_id?: string
          phishing_tests_passed?: number | null
          security_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string | null
          id: string
          passed: boolean | null
          quiz_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          passed?: boolean | null
          quiz_id?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string | null
          id?: string
          passed?: boolean | null
          quiz_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_segments: {
        Row: {
          created_at: string | null
          id: string
          last_calculated_at: string | null
          organization_id: string | null
          segment_score: number | null
          segment_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_calculated_at?: string | null
          organization_id?: string | null
          segment_score?: number | null
          segment_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_calculated_at?: string | null
          organization_id?: string | null
          segment_score?: number | null
          segment_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_segments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_segments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_training_progress: {
        Row: {
          completed_at: string | null
          completed_items: Json | null
          created_at: string | null
          current_item_id: string | null
          id: string
          path_id: string | null
          started_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_items?: Json | null
          created_at?: string | null
          current_item_id?: string | null
          id?: string
          path_id?: string | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_items?: Json | null
          created_at?: string | null
          current_item_id?: string | null
          id?: string
          path_id?: string | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_training_progress_current_item_id_fkey"
            columns: ["current_item_id"]
            isOneToOne: false
            referencedRelation: "training_path_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_training_progress_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "training_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_assessments: {
        Row: {
          assessment_date: string
          created_at: string | null
          created_by: string | null
          id: string
          next_assessment_date: string | null
          organization_id: string
          overall_score: number | null
          status: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          assessment_date: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          next_assessment_date?: string | null
          organization_id: string
          overall_score?: number | null
          status?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          assessment_date?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          next_assessment_date?: string | null
          organization_id?: string
          overall_score?: number | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_assessments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "vendor_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_assessments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_requirements: {
        Row: {
          category: string
          created_at: string | null
          due_date: string | null
          evidence_required: boolean | null
          evidence_url: string | null
          id: string
          requirement: string
          status: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          due_date?: string | null
          evidence_required?: boolean | null
          evidence_url?: string | null
          id?: string
          requirement: string
          status?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          due_date?: string | null
          evidence_required?: boolean | null
          evidence_url?: string | null
          id?: string
          requirement?: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_requirements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          risk_level: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          risk_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          risk_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_assignments: {
        Row: {
          action_type: string
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          status: string | null
          step_number: number
          updated_at: string | null
          workflow_instance_id: string | null
        }
        Insert: {
          action_type: string
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          step_number: number
          updated_at?: string | null
          workflow_instance_id?: string | null
        }
        Update: {
          action_type?: string
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          step_number?: number
          updated_at?: string | null
          workflow_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_assignments_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_instances: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          id: string
          organization_id: string | null
          started_at: string | null
          status: string | null
          template_id: string | null
          trigger_entity_id: string
          trigger_type: string
          updated_at: string | null
          workflow_data: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          organization_id?: string | null
          started_at?: string | null
          status?: string | null
          template_id?: string | null
          trigger_entity_id: string
          trigger_type: string
          updated_at?: string | null
          workflow_data?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          organization_id?: string | null
          started_at?: string | null
          status?: string | null
          template_id?: string | null
          trigger_entity_id?: string
          trigger_type?: string
          updated_at?: string | null
          workflow_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "workflow_instances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          actions: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id?: string | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "workflow_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      organization_compliance_overview: {
        Row: {
          audit_score: number | null
          framework_score: number | null
          incident_score: number | null
          organization_id: string | null
          overall_score: number | null
        }
        Relationships: []
      }
      organization_leaderboard: {
        Row: {
          achievements_count: number | null
          full_name: string | null
          organization_id: string | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_compliance_overview"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_user_segments: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
      get_course_progress_report: {
        Args: {
          org_id: string
        }
        Returns: {
          user_id: string
          full_name: string
          content_title: string
          progress_percentage: number
          completed: boolean
          last_watched_at: string
        }[]
      }
      get_quiz_performance_report: {
        Args: {
          org_id: string
        }
        Returns: {
          user_id: string
          full_name: string
          quiz_title: string
          score: number
          passed: boolean
          completed_at: string
        }[]
      }
    }
    Enums: {
      compliance_document_status: "draft" | "published" | "archived"
      incident_priority: "low" | "medium" | "high" | "critical"
      incident_status: "open" | "investigating" | "resolved" | "closed"
      notification_type:
        | "info"
        | "warning"
        | "success"
        | "error"
        | "calendar_event"
      risk_level: "low" | "medium" | "high" | "critical"
      user_role: "super_admin" | "org_admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
