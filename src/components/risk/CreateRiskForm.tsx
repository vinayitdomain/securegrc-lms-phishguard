import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type RiskLevel = Database["public"]["Enums"]["risk_level"];

export function CreateRiskForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    impact_score: "",
    likelihood_score: "",
    risk_level: "low" as RiskLevel,
    mitigation_plan: "",
  });

  const { data: categories } = useQuery({
    queryKey: ['riskCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risk_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const createRiskMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error('Not authenticated');

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('user_id', profile.user.id)
        .single();

      if (profileError) throw profileError;

      const { data: risk, error } = await supabase
        .from('risk_assessments')
        .insert({
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          organization_id: userProfile.organization_id,
          created_by: userProfile.id,
          impact_score: parseInt(data.impact_score),
          likelihood_score: parseInt(data.likelihood_score),
          risk_level: data.risk_level,
          mitigation_plan: data.mitigation_plan,
        })
        .select()
        .single();

      if (error) throw error;
      return risk;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast({
        title: "Success",
        description: "Risk assessment created successfully",
      });
      navigate('/risks');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create risk assessment: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRiskMutation.mutate(formData);
  };

  const calculateRiskLevel = (impact: string, likelihood: string): RiskLevel => {
    const impactScore = parseInt(impact);
    const likelihoodScore = parseInt(likelihood);
    
    if (isNaN(impactScore) || isNaN(likelihoodScore)) return "low";
    
    const riskScore = impactScore * likelihoodScore;
    
    if (riskScore >= 64) return "critical";
    if (riskScore >= 36) return "high";
    if (riskScore >= 16) return "medium";
    return "low";
  };

  const handleScoreChange = (field: "impact_score" | "likelihood_score", value: string) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };
    
    const riskLevel = calculateRiskLevel(
      field === "impact_score" ? value : formData.impact_score,
      field === "likelihood_score" ? value : formData.likelihood_score
    );
    
    setFormData({
      ...newFormData,
      risk_level: riskLevel,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Risk Assessment</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="impact_score">Impact Score (1-10)</Label>
                <Input
                  id="impact_score"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.impact_score}
                  onChange={(e) => handleScoreChange("impact_score", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="likelihood_score">Likelihood Score (1-10)</Label>
                <Input
                  id="likelihood_score"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.likelihood_score}
                  onChange={(e) => handleScoreChange("likelihood_score", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mitigation_plan">Mitigation Plan</Label>
              <Textarea
                id="mitigation_plan"
                value={formData.mitigation_plan}
                onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/risks')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRiskMutation.isPending}
            >
              Create Risk Assessment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}