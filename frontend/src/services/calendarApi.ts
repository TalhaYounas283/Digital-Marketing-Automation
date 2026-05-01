import { apiClient } from "@/services/apiClient";

export interface ScheduledPostDto {
  id: string;
  userId: string;
  title: string;
  platform: string;
  date: string;
  time: string;
  status: "scheduled" | "published" | "draft";
  type: "post" | "story" | "reel";
  content: string | null;
  campaignId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const calendarApi = {
  list: (params?: { month?: number; year?: number }) =>
    apiClient.get<ScheduledPostDto[]>("/calendar/posts", params),
  get: (id: string) => apiClient.get<ScheduledPostDto>(`/calendar/posts/${id}`),
  create: (body: Partial<ScheduledPostDto>) =>
    apiClient.post<ScheduledPostDto>("/calendar/posts", body),
  update: (id: string, body: Partial<ScheduledPostDto>) =>
    apiClient.patch<ScheduledPostDto>(`/calendar/posts/${id}`, body),
  remove: (id: string) =>
    apiClient.delete<{ message: string }>(`/calendar/posts/${id}`),
};
