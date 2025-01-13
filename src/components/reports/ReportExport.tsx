import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportExportProps {
  data: any[];
  filename: string;
  title: string;
}

export function ReportExport({ data, filename, title }: ReportExportProps) {
  const exportToExcel = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Report');
    writeFile(wb, `${filename}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    
    // @ts-ignore - jspdf-autotable types are not included
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map(Object.values),
      startY: 25,
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={exportToExcel}>
        <DownloadCloud className="mr-2 h-4 w-4" />
        Export to Excel
      </Button>
      <Button variant="outline" onClick={exportToPDF}>
        <DownloadCloud className="mr-2 h-4 w-4" />
        Export to PDF
      </Button>
    </div>
  );
}