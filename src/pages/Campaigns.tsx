import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface Target {
  id: string;
  email: string;
  status: string;
  clicked: boolean;
  clicked_at: string | null;
}

export default function Campaigns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    emailSubject: "",
    emailTemplate: "",
    targets: "",
  });

  // Fetch campaigns
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phishing_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });

  // Fetch targets for selected campaign
  const { data: targets } = useQuery({
    queryKey: ["campaign-targets", selectedCampaign?.id],
    queryFn: async () => {
      if (!selectedCampaign) return [];
      const { data, error } = await supabase
        .from("campaign_targets")
        .select("*")
        .eq("campaign_id", selectedCampaign.id);

      if (error) throw error;
      return data as Target[];
    },
    enabled: !!selectedCampaign,
  });

  // Create campaign mutation
  const createCampaign = useMutation({
    mutationFn: async () => {
      // First create the campaign
      const { data: campaign, error: campaignError } = await supabase
        .from("phishing_campaigns")
        .insert([
          {
            name: newCampaign.name,
            description: newCampaign.description,
            start_date: newCampaign.start_date,
            end_date: newCampaign.end_date,
            status: "draft",
          },
        ])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Then create targets
      const targets = newCampaign.targets
        .split("\n")
        .map(email => email.trim())
        .filter(email => email);

      const { error: targetsError } = await supabase
        .from("campaign_targets")
        .insert(
          targets.map(email => ({
            campaign_id: campaign.id,
            email,
          }))
        );

      if (targetsError) throw targetsError;

      return campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setIsCreateOpen(false);
      setNewCampaign({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        emailSubject: "",
        emailTemplate: "",
        targets: "",
      });
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create campaign: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Launch campaign mutation
  const launchCampaign = useMutation({
    mutationFn: async (campaign: Campaign) => {
      // Get all targets for this campaign
      const { data: targets, error: targetsError } = await supabase
        .from("campaign_targets")
        .select("*")
        .eq("campaign_id", campaign.id);

      if (targetsError) throw targetsError;

      // Send emails to all targets
      await Promise.all(
        targets.map(async (target) => {
          await supabase.functions.invoke("send-campaign-email", {
            body: {
              campaignId: campaign.id,
              targetId: target.id,
              to: target.email,
              subject: newCampaign.emailSubject,
              html: newCampaign.emailTemplate,
            },
          });
        })
      );

      // Update campaign status
      const { error: updateError } = await supabase
        .from("phishing_campaigns")
        .update({ status: "active" })
        .eq("id", campaign.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Success",
        description: "Campaign launched successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to launch campaign: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("campaign-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaign_targets" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["campaign-targets"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Calculate campaign statistics
  const campaignStats = useMemo(() => {
    if (!targets) return { sent: 0, clicked: 0, pending: 0 };
    
    return {
      sent: targets.filter(t => t.status === "sent").length,
      clicked: targets.filter(t => t.clicked).length,
      pending: targets.filter(t => t.status === "pending").length,
    };
  }, [targets]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phishing Campaigns</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
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
                <Button onClick={() => createCampaign.mutate()}>
                  Create Campaign
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading campaigns...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Emails Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaignStats.sent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Click Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaignStats.sent
                    ? Math.round((campaignStats.clicked / campaignStats.sent) * 100)
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaignStats.pending}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
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
                      onClick={() => setSelectedCampaign(campaign)}
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
                              launchCampaign.mutate(campaign);
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
            </CardContent>
          </Card>

          {selectedCampaign && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details: {selectedCampaign.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="targets">
                  <TabsList>
                    <TabsTrigger value="targets">Targets</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="targets">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Clicked</TableHead>
                          <TableHead>Clicked At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {targets?.map((target) => (
                          <TableRow key={target.id}>
                            <TableCell>{target.email}</TableCell>
                            <TableCell>{target.status}</TableCell>
                            <TableCell>{target.clicked ? "Yes" : "No"}</TableCell>
                            <TableCell>
                              {target.clicked_at
                                ? new Date(target.clicked_at).toLocaleString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="analytics">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            {
                              name: "Sent",
                              value: campaignStats.sent,
                            },
                            {
                              name: "Clicked",
                              value: campaignStats.clicked,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#1a365d"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}