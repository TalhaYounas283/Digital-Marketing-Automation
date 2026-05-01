import { apiClient } from "@/services/apiClient";

export interface WorkflowDto {
  id: string;
  userId: string;
  name: string;
  tool: string;
  trigger: string;
  action: string;
  status: "Active" | "Paused";
  lastRun: string | null;
  n8nWorkflowId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const workflowsApi = {
  list: () => apiClient.get<WorkflowDto[]>("/workflows"),
  get: (id: string) => apiClient.get<WorkflowDto>(`/workflows/${id}`),
  create: (body: Partial<WorkflowDto>) => apiClient.post<WorkflowDto>("/workflows", body),
  update: (id: string, body: Partial<WorkflowDto>) =>
    apiClient.patch<WorkflowDto>(`/workflows/${id}`, body),
  remove: (id: string) => apiClient.delete<{ message: string }>(`/workflows/${id}`),
  activate: (id: string) => apiClient.post<WorkflowDto>(`/workflows/${id}/activate`),
  pause: (id: string) => apiClient.post<WorkflowDto>(`/workflows/${id}/pause`),
  trigger: (id: string, payload: Record<string, unknown>) =>
    apiClient.post<{ triggered: boolean; lastRun: string }>(
      `/workflows/${id}/trigger`,
      payload,
    ),
};
