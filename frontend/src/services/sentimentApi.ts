import { apiClient } from "@/services/apiClient";

export interface SentimentRecordDto {
  id: string;
  userId: string;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  source: string | null;
  highlights: string[];
  createdAt: string;
}

export const sentimentApi = {
  analyze: (body: { text: string; source?: string }) =>
    apiClient.post<SentimentRecordDto>("/sentiment/analyze", body),
  history: (limit = 50) =>
    apiClient.get<SentimentRecordDto[]>("/sentiment/history", { limit }),
};
