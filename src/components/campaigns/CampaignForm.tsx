import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CampaignFormProps {
  onSubmit: (campaign: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    emailSubject: string;
    emailTemplate: string;
    targets: string;
  }) => void;
}

export function CampaignForm({ onSubmit }: CampaignFormProps) {
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    emailSubject: "",
    emailTemplate: "",
    targets: "",
  });

  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Campaign Details</TabsTrigger>
        <TabsTrigger value="email">Email Template</TabsTrigger>
        <TabsTrigger value="targets">Target List</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newCampaign.name}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newCampaign.description}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                description: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="datetime-local"
            value={newCampaign.start_date}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                start_date: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="datetime-local"
            value={newCampaign.end_date}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, end_date: e.target.value })
            }
          />
        </div>
      </TabsContent>
      <TabsContent value="email" className="space-y-4">
        <div>
          <Label htmlFor="emailSubject">Email Subject</Label>
          <Input
            id="emailSubject"
            value={newCampaign.emailSubject}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                emailSubject: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="emailTemplate">Email Template (HTML)</Label>
          <Textarea
            id="emailTemplate"
            value={newCampaign.emailTemplate}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                emailTemplate: e.target.value,
              })
            }
            className="min-h-[200px]"
          />
        </div>
      </TabsContent>
      <TabsContent value="targets" className="space-y-4">
        <div>
          <Label htmlFor="targets">Target Emails (one per line)</Label>
          <Textarea
            id="targets"
            value={newCampaign.targets}
            onChange={(e) =>
              setNewCampaign({
                ...newCampaign,
                targets: e.target.value,
              })
            }
            className="min-h-[200px]"
            placeholder="john@example.com&#13;&#10;jane@example.com"
          />
        </div>
        <Button onClick={() => onSubmit(newCampaign)}>
          Create Campaign
        </Button>
      </TabsContent>
    </Tabs>
  );
}