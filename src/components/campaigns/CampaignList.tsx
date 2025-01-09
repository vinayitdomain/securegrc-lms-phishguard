import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
  onSelect: (campaign: Campaign) => void;
  onLaunch: (campaign: Campaign) => void;
}

export function CampaignList({ campaigns, onSelect, onLaunch }: CampaignListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns?.map((campaign) => (
          <TableRow
            key={campaign.id}
            className="cursor-pointer"
            onClick={() => onSelect(campaign)}
          >
            <TableCell>{campaign.name}</TableCell>
            <TableCell>{campaign.description}</TableCell>
            <TableCell>{campaign.status}</TableCell>
            <TableCell>
              {campaign.start_date
                ? new Date(campaign.start_date).toLocaleDateString()
                : "Not set"}
            </TableCell>
            <TableCell>
              {campaign.end_date
                ? new Date(campaign.end_date).toLocaleDateString()
                : "Not set"}
            </TableCell>
            <TableCell>
              {campaign.status === "draft" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunch(campaign);
                  }}
                >
                  Launch
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}