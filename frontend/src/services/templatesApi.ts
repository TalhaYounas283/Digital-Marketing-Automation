import { apiClient } from "@/services/apiClient";

export interface TemplateDto {
  id: string;
  userId: string | null;
  title: string;
  description: string;
  category: string;
  platform: string[];
  content: string;
  tags: string[];
  usage: number;
  rating: number;
  isPremium: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export const templatesApi = {
  list: (params?: {
    search?: string;
    category?: string;
    premium?: boolean;
    minRating?: number;
  }) => apiClient.get<TemplateDto[]>("/templates", params as Record<string, string | number | boolean>),
  get: (id: string) => apiClient.get<TemplateDto>(`/templates/${id}`),
  create: (body: Partial<TemplateDto>) => apiClient.post<TemplateDto>("/templates", body),
  update: (id: string, body: Partial<TemplateDto>) =>
    apiClient.patch<TemplateDto>(`/templates/${id}`, body),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/templates/${id}`),
  exportAll: () =>
    apiClient.post<{ exportedAt: string; count: number; items: TemplateDto[] }>(
      "/templates/export",
    ),
};
