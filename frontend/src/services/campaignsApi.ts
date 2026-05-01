import { apiClient } from "@/services/apiClient";

export interface CampaignDto {
  id: string;
  userId: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: "Facebook" | "Google" | "Instagram" | "LinkedIn" | "Email" | "Twitter";
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  startDate?: string | null;
  endDate?: string | null;
  settings?: { dailyCap?: number; autoOptimize?: boolean; sendAlerts?: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStats {
  total: number;
  totalBudget: number;
  totalSpent: number;
  totalClicks: number;
  totalImpressions: number;
}

export const campaignsApi = {
  list: (params?: { status?: string; platform?: string; search?: string }) =>
    apiClient.get<CampaignDto[]>("/campaigns", params),
  stats: () => apiClient.get<CampaignStats>("/campaigns/stats"),
  get: (id: string) => apiClient.get<CampaignDto>(`/campaigns/${id}`),
  create: (body: Partial<CampaignDto>) => apiClient.post<CampaignDto>("/campaigns", body),
  update: (id: string, body: Partial<CampaignDto>) =>
    apiClient.patch<CampaignDto>(`/campaigns/${id}`, body),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/campaigns/${id}`),
};
