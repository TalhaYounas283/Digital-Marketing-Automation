import React, { useCallback, useEffect, useMemo, useState } from "react";
import { campaignsApi, CampaignDto } from "@/services/campaignsApi";

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: "Facebook" | "Google" | "Instagram" | "LinkedIn" | "Email";
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  startDate: string;
  settings?: {
    dailyCap: number;
    autoOptimize: boolean;
    sendAlerts: boolean;
  };
}

type CampaignUpdatePayload = {
  status: Campaign["status"];
  platform: Campaign["platform"];
  budget: number;
  settings: Campaign["settings"];
};

const fromDto = (dto: CampaignDto): Campaign => ({
  id: dto.id,
  name: dto.name,
  status: dto.status,
  platform: (dto.platform === "Twitter" ? "Facebook" : dto.platform) as Campaign["platform"],
  budget: Number(dto.budget),
  spent: Number(dto.spent),
  clicks: Number(dto.clicks),
  impressions: Number(dto.impressions),
  startDate: dto.startDate ? new Date(dto.startDate).toISOString().slice(0, 10) : "",
  settings: {
    dailyCap: dto.settings?.dailyCap ?? 0,
    autoOptimize: dto.settings?.autoOptimize ?? true,
    sendAlerts: dto.settings?.sendAlerts ?? true,
  },
});

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    platform: "Facebook",
    budget: "",
    status: "draft",
    startDate: new Date().toISOString().split("T")[0],
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await campaignsApi.list();
      setCampaigns(list.map(fromDto));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto = await campaignsApi.create({
        name: formData.name || "Untitled Campaign",
        platform: formData.platform as CampaignDto["platform"],
        status: formData.status as CampaignDto["status"],
        budget: Number(formData.budget) || 0,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        settings: {
          dailyCap: Math.max(Math.floor((Number(formData.budget) || 0) / 30), 0),
          autoOptimize: true,
          sendAlerts: true,
        },
      });
      setCampaigns((prev) => [fromDto(dto), ...prev]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      platform: "Facebook",
      budget: "",
      status: "draft",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const updateCampaign = async (
    campaignId: string,
    payload: CampaignUpdatePayload,
  ) => {
    try {
      const dto = await campaignsApi.update(campaignId, {
        status: payload.status,
        platform: payload.platform as CampaignDto["platform"],
        budget: payload.budget,
        settings: payload.settings,
      });
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? fromDto(dto) : c)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update campaign");
    }
  };

  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter(
        (campaign) =>
          (filter === "all" || campaign.status === filter) &&
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [campaigns, filter, searchTerm],
  );

  const stats = useMemo(
    () => ({
      budget: campaigns.reduce((acc, c) => acc + c.budget, 0),
      spent: campaigns.reduce((acc, c) => acc + c.spent, 0),
      clicks: campaigns.reduce((acc, c) => acc + c.clicks, 0),
      impressions: campaigns.reduce((acc, c) => acc + c.impressions, 0),
    }),
    [campaigns],
  );

  return {
    state: {
      campaigns,
      filteredCampaigns,
      filter,
      searchTerm,
      isModalOpen,
      formData,
      stats,
      loading,
      error,
    },
    actions: {
      setFilter,
      setSearchTerm,
      setIsModalOpen,
      setFormData,
      handleCreateCampaign,
      updateCampaign,
      refresh,
    },
  };
};
