import { apiClient } from "@/services/apiClient";
import {
  Platform,
  Tone,
  CampaignStrategy,
  SwotAnalysis,
  OptimizationResult,
  Persona,
  SeoResult,
} from "@/types";

export const generateMarketingCopy = (
  topic: string,
  platform: Platform,
  tone: Tone,
  audience: string,
) => apiClient.post<string[]>("/ai/generate-copy", { topic, platform, tone, audience });

export const generateCampaignStrategy = (productName: string, goal: string) =>
  apiClient.post<CampaignStrategy>("/ai/generate-strategy", { productName, goal });

export const generateMarketingImage = async (prompt: string): Promise<string | null> => {
  const data = await apiClient.post<{ imageUrl: string }>("/ai/generate-image", { prompt });
  return data.imageUrl ?? null;
};

export const analyzeLeadScore = (leadData: {
  name: string;
  source: string;
  interactions: string;
}) => apiClient.post<{ score: number; reason: string }>("/ai/analyze-lead", leadData);

export const analyzeCompetitor = (competitorName: string, industry: string) =>
  apiClient.post<SwotAnalysis>("/ai/analyze-competitor", { competitorName, industry });

export const optimizeContent = (originalText: string, goal: string) =>
  apiClient.post<OptimizationResult>("/ai/optimize-content", { originalText, goal });

export const generateAudiencePersona = (
  productName: string,
  industry: string,
  region: string,
) => apiClient.post<Persona>("/ai/generate-persona", { productName, industry, region });

export const generateSeoKeywords = (topic: string, niche: string) =>
  apiClient.post<SeoResult>("/ai/generate-seo", { topic, niche });

export const chatWithAi = async (message: string, context?: string): Promise<string> => {
  const data = await apiClient.post<{ reply: string }>("/ai/chat", { message, context });
  return data.reply;
};
