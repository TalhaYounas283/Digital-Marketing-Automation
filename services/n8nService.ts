// AutoMarketer AI - n8n Integration Service
// Use this service to connect your React app to the n8n workflow

// Configure your n8n webhook URL here
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/automarketer';

export type TaskType = 
  | 'content_generation'
  | 'lead_scoring'
  | 'competitor_analysis'
  | 'campaign_strategy'
  | 'audience_persona'
  | 'content_optimizer'
  | 'email_campaign'
  | 'schedule_optimization';

// Input types for each task
export interface ContentGenerationInput {
  platform: 'LinkedIn' | 'Twitter' | 'Instagram' | 'Facebook';
  topic: string;
  tone: 'Professional' | 'Casual' | 'Humorous' | 'Inspirational' | 'Educational';
  audience: string;
}

export interface LeadScoringInput {
  name: string;
  email: string;
  company: string;
  job_title: string;
  source: string;
  interactions?: string;
  industry?: string;
}

export interface CompetitorAnalysisInput {
  competitor_name: string;
  industry: string;
  our_company: string;
  context?: string;
}

export interface CampaignStrategyInput {
  product_name: string;
  campaign_goal: string;
  budget: string;
  duration: string;
  target_market: string;
}

export interface AudiencePersonaInput {
  product_name: string;
  industry: string;
  region: string;
}

export interface ContentOptimizerInput {
  content: string;
  goal: 'engaging' | 'grammar' | 'shorten' | 'expand' | 'seo';
  platform: string;
  audience: string;
}

export interface EmailCampaignInput {
  email_type: 'Welcome' | 'Product Launch' | 'Re-engagement' | 'Abandoned Cart' | 'Newsletter' | 'Promotional';
  product: string;
  goal: string;
  audience: string;
  brand_voice: string;
}

export interface ScheduleOptimizationInput {
  platform: string;
  timezone: string;
  industry: string;
  engagement_data?: string;
  goal: string;
}

// Response types
export interface N8nResponse<T> {
  success: boolean;
  task: TaskType;
  timestamp: string;
  result: T;
  metadata: {
    model: string;
    version: string;
    processedAt: number;
  };
}

export interface ContentPost {
  content: string;
  hashtags: string[];
  characterCount: number;
  bestPostingTime: string;
  engagementTip: string;
}

export interface ContentGenerationResult {
  posts: ContentPost[];
  imagePrompt: string;
  contentPillars: string[];
}

export interface LeadScoringResult {
  score: number;
  tier: 'Hot' | 'Warm' | 'Cold';
  breakdown: {
    emailQuality: number;
    titleScore: number;
    engagementScore: number;
    industryFit: number;
    sourceScore: number;
  };
  reasoning: string;
  buyingSignals: string[];
  recommendedAction: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedDealSize: string;
  nextSteps: string[];
}

export interface CompetitorAnalysisResult {
  competitor: string;
  overview: string;
  strengths: Array<{ point: string; impact: string; evidence: string }>;
  weaknesses: Array<{ point: string; impact: string; opportunity: string }>;
  opportunities: Array<{ point: string; actionable: string }>;
  threats: Array<{ point: string; mitigation: string }>;
  marketPosition: string;
  strategicAdvice: string;
  actionItems: Array<{ action: string; priority: string; timeline: string }>;
}

// Main API function
export async function executeN8nTask<T>(
  taskType: TaskType,
  inputData: Record<string, any>
): Promise<N8nResponse<T>> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_type: taskType,
        input_data: inputData,
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error from n8n workflow');
    }

    return data as N8nResponse<T>;
  } catch (error) {
    console.error('n8n API Error:', error);
    throw error;
  }
}

// Convenience functions for each task type
export const n8nService = {
  generateContent: (input: ContentGenerationInput) => 
    executeN8nTask<ContentGenerationResult>('content_generation', input),

  scoreLead: (input: LeadScoringInput) => 
    executeN8nTask<LeadScoringResult>('lead_scoring', input),

  analyzeCompetitor: (input: CompetitorAnalysisInput) => 
    executeN8nTask<CompetitorAnalysisResult>('competitor_analysis', input),

  createCampaignStrategy: (input: CampaignStrategyInput) => 
    executeN8nTask('campaign_strategy', input),

  buildPersona: (input: AudiencePersonaInput) => 
    executeN8nTask('audience_persona', input),

  optimizeContent: (input: ContentOptimizerInput) => 
    executeN8nTask('content_optimizer', input),

  generateEmailCampaign: (input: EmailCampaignInput) => 
    executeN8nTask('email_campaign', input),

  optimizeSchedule: (input: ScheduleOptimizationInput) => 
    executeN8nTask('schedule_optimization', input),
};

export default n8nService;
