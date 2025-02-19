import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComplianceDocument } from "@/types/compliance";
import { ComplianceDocumentUpload } from "./ComplianceDocumentUpload";
import { format } from "date-fns";

export function ComplianceDocumentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['compliance-documents'],
    queryFn: async () => {
      // First get the documents
      const { data: docs, error: docsError } = await supabase
        .from('compliance_documents')
        .select(`
          *,
          tags:compliance_document_tag_relations(
            tag:compliance_document_tags(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      // Then get the creator names
      const creatorIds = docs?.map(doc => doc.created_by) || [];
      const { data: creators, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', creatorIds);

      if (creatorsError) throw creatorsError;

      // Merge and transform the data to match our types
      const docsWithCreators = docs?.map(doc => ({
        ...doc,
        creator: creators?.find(c => c.id === doc.created_by) || { full_name: null },
        tags: doc.tags?.map(tagRel => ({
          document_id: doc.id,
          tag_id: tagRel.tag.id,
          tag: tagRel.tag
        })) || []
      }));

      return docsWithCreators as ComplianceDocument[];
    },
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          Upload Document
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>v{doc.version}</TableCell>
                <TableCell>{doc.creator?.full_name}</TableCell>
                <TableCell>
                  {format(new Date(doc.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {doc.tags?.map(({ tag }) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showUploadModal && (
        <ComplianceDocumentUpload
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}