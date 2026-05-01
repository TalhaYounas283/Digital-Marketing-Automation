import { apiClient } from "@/services/apiClient";

export interface RecommendationDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "timing" | "audience" | "content" | "channel";
  confidence: number;
  applied: boolean;
  createdAt: string;
  updatedAt: string;
}

export const insightsApi = {
  list: (category?: RecommendationDto["category"]) =>
    apiClient.get<RecommendationDto[]>("/insights/recommendations", category ? { category } : undefined),
  regenerate: () => apiClient.post<RecommendationDto[]>("/insights/regenerate"),
  apply: (id: string) =>
    apiClient.post<RecommendationDto>(`/insights/recommendations/${id}/apply`),
};
