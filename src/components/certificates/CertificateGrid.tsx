import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CertificateCard } from "./CertificateCard";
import { Database } from "@/integrations/supabase/types";

type CertificateData = {
  title: string;
  completion_date: string;
  course_name?: string;
  quiz_name?: string;
};

type IssuedCertificate = Database['public']['Tables']['issued_certificates']['Row'] & {
  certificate_data: CertificateData;
};

export function CertificateGrid() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issued_certificates')
        .select('*')
        .order('issued_at', { ascending: false });
      
      if (error) throw error;

      // Ensure certificate_data is properly typed
      return (data || []).map(cert => ({
        ...cert,
        certificate_data: cert.certificate_data as CertificateData
      })) as IssuedCertificate[];
    }
  });

  if (isLoading) {
    return <div>Loading certificates...</div>;
  }

  if (!certificates?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No certificates earned yet.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} />
      ))}
    </div>
  );
}