import { apiClient } from "@/services/apiClient";

export interface EmailCampaignDto {
  id: string;
  userId: string;
  name: string;
  subject: string;
  template: string;
  status: "draft" | "scheduled" | "sending" | "sent";
  recipients: number;
  openRate: number;
  clickRate: number;
  sentCount: number;
  sentDate?: string | null;
  scheduledDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const emailCampaignsApi = {
  list: (params?: { status?: string; search?: string }) =>
    apiClient.get<EmailCampaignDto[]>("/email-campaigns", params),
  get: (id: string) => apiClient.get<EmailCampaignDto>(`/email-campaigns/${id}`),
  create: (body: Partial<EmailCampaignDto>) =>
    apiClient.post<EmailCampaignDto>("/email-campaigns", body),
  update: (id: string, body: Partial<EmailCampaignDto>) =>
    apiClient.patch<EmailCampaignDto>(`/email-campaigns/${id}`, body),
  remove: (id: string) =>
    apiClient.delete<{ message: string }>(`/email-campaigns/${id}`),
  send: (id: string) => apiClient.post<EmailCampaignDto>(`/email-campaigns/${id}/send`),
  duplicate: (id: string) =>
    apiClient.post<EmailCampaignDto>(`/email-campaigns/${id}/duplicate`),
};
