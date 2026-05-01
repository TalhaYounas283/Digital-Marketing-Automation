import { apiClient } from "@/services/apiClient";

export interface LeadDto {
  id: string;
  userId: string;
  name: string;
  email: string;
  source: string;
  status: "New" | "Contacted" | "Qualified" | "Converted";
  score: number;
  aiAnalysis?: string | null;
  interactions?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const leadsApi = {
  list: (params?: { status?: string; search?: string }) =>
    apiClient.get<LeadDto[]>("/leads", params),
  get: (id: string) => apiClient.get<LeadDto>(`/leads/${id}`),
  create: (body: Partial<LeadDto>) => apiClient.post<LeadDto>("/leads", body),
  update: (id: string, body: Partial<LeadDto>) =>
    apiClient.patch<LeadDto>(`/leads/${id}`, body),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/leads/${id}`),
  analyze: (id: string, body: { name?: string; source?: string; interactions?: string }) =>
    apiClient.post<LeadDto>(`/leads/${id}/analyze`, body),
};
