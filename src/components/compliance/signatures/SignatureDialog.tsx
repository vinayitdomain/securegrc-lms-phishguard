import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignaturePad } from "./SignaturePad";
import { Signature } from "lucide-react";

interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  type: "document_signoff" | "policy_acknowledgment" | "audit_approval";
  itemId: string;
  itemTitle: string;
  organizationId: string;
}

export function SignatureDialog({
  open,
  onClose,
  type,
  itemId,
  itemTitle,
  organizationId,
}: SignatureDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSign = async (signatureData: { points: number[][] }) => {
    try {
      setIsSubmitting(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { error } = await supabase.from('signatures').insert({
        organization_id: organizationId,
        signer_id: profile.id,
        signature_type: type,
        [type === 'document_signoff' ? 'document_id' : 
         type === 'policy_acknowledgment' ? 'policy_id' : 'audit_id']: itemId,
        signature_data: signatureData,
        ip_address: window.location.hostname,
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      toast({
        title: "Signed successfully",
        description: `${itemTitle} has been signed.`,
      });

      onClose();
    } catch (error) {
      console.error('Error signing:', error);
      toast({
        title: "Error signing",
        description: "There was an error processing your signature.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Signature className="h-5 w-5" />
            Sign {itemTitle}
          </DialogTitle>
        </DialogHeader>
        <SignaturePad
          onSign={handleSign}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}