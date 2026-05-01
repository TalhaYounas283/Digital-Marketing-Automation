import { apiClient } from "@/services/apiClient";

export type SocialPlatform = "twitter" | "linkedin" | "facebook" | "instagram";

export interface SocialAccountDto {
  id: string | null;
  userId: string;
  platform: SocialPlatform;
  connected: boolean;
  username: string | null;
  expiresAt?: string | null;
}

export const socialAccountsApi = {
  list: () => apiClient.get<SocialAccountDto[]>("/social-accounts"),
  connect: (platform: SocialPlatform) =>
    apiClient.post<{ authUrl: string; account: SocialAccountDto }>(
      `/social-accounts/${platform}/connect`,
    ),
  disconnect: (platform: SocialPlatform) =>
    apiClient.post<SocialAccountDto>(`/social-accounts/${platform}/disconnect`),
};
