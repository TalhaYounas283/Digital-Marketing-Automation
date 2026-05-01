import { apiClient } from "@/services/apiClient";

export interface UserProfileDto {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "admin";
  organization: string;
  profilePicture: string | null;
  notificationPrefs: { leads: boolean; campaigns: boolean; weekly: boolean };
}

export const usersApi = {
  me: () => apiClient.get<UserProfileDto>("/users/me"),
  update: (body: Partial<UserProfileDto>) =>
    apiClient.patch<UserProfileDto>("/users/me", body),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiClient.post<{ message: string }>("/users/me/change-password", body),
  notificationPrefs: () =>
    apiClient.get<UserProfileDto["notificationPrefs"]>("/users/me/notifications"),
  updateNotificationPrefs: (body: Partial<UserProfileDto["notificationPrefs"]>) =>
    apiClient.patch<UserProfileDto["notificationPrefs"]>(
      "/users/me/notifications",
      body,
    ),
};
