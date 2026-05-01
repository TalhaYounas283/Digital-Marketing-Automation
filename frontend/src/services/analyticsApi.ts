import { apiClient } from "@/services/apiClient";
import { KPIData } from "@/types";

export interface EngagementPoint {
  name: string;
  twitter: number;
  instagram: number;
  linkedin: number;
  facebook: number;
}

export interface DemographicSlice {
  group: string;
  value: number;
}

export const analyticsApi = {
  kpi: () => apiClient.get<KPIData>("/analytics/kpi"),
  engagement: (period: "6m" | "12m" = "6m") =>
    apiClient.get<EngagementPoint[]>("/analytics/engagement", { period }),
  demographics: () => apiClient.get<DemographicSlice[]>("/analytics/demographics"),
  recentActivity: () =>
    apiClient.get<KPIData["recentActivity"]>("/analytics/recent-activity"),
};
