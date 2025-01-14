import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface CertificateCardProps {
  certificate: {
    id: string;
    issued_at: string;
    certificate_data: {
      title: string;
      completion_date: string;
      course_name?: string;
      quiz_name?: string;
    };
  };
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const handleDownload = () => {
    // TODO: Implement certificate PDF download
    console.log("Downloading certificate:", certificate.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {certificate.certificate_data.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Issued on {new Date(certificate.issued_at).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">
                  {certificate.certificate_data.title}
                </h2>
                {/* Certificate preview content */}
                <div className="aspect-[1.414] bg-white border rounded-lg p-8">
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      {certificate.certificate_data.course_name || certificate.certificate_data.quiz_name}
                    </h3>
                    <p>Completed on {certificate.certificate_data.completion_date}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="default" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}