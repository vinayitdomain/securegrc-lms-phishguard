import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignatureDialog } from "../signatures/SignatureDialog";
import { SignatureHistory } from "../signatures/SignatureHistory";
import { FileText, Signature, History } from "lucide-react";
import { format } from "date-fns";

interface ComplianceDocumentDetailsProps {
  documentId: string;
}

interface ComplianceDocument {
  id: string;
  organization_id: string;
  title: string;
  description: string | null;
  version: number;
  status: 'draft' | 'published' | 'archived';
  file_url: string | null;
  created_by: string;
  created_at: string;
  created_by_user: {
    full_name: string | null;
  } | null;
}

export function ComplianceDocumentDetails({ documentId }: ComplianceDocumentDetailsProps) {
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  const { data: document } = useQuery({
    queryKey: ['compliance-document', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_documents')
        .select(`
          *,
          created_by_user:profiles!created_by(full_name)
        `)
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data as ComplianceDocument;
    },
  });

  if (!document) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {document.title}
            </div>
            <Button
              onClick={() => setShowSignatureDialog(true)}
              className="flex items-center gap-2"
            >
              <Signature className="h-4 w-4" />
              Sign Document
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{document.description}</p>
            <div className="text-sm">
              <p>Version: {document.version}</p>
              <p>Created by: {document.created_by_user?.full_name}</p>
              <p>Created at: {format(new Date(document.created_at), 'PPp')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SignatureHistory
        type="document_signoff"
        itemId={documentId}
      />

      {showSignatureDialog && (
        <SignatureDialog
          open={showSignatureDialog}
          onClose={() => setShowSignatureDialog(false)}
          type="document_signoff"
          itemId={documentId}
          itemTitle={document.title}
          organizationId={document.organization_id}
        />
      )}
    </div>
  );
}