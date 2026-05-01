export type AiAction =
  | 'generate_copy'
  | 'generate_strategy'
  | 'optimize_content'
  | 'generate_seo'
  | 'analyze_competitor'
  | 'generate_persona'
  | 'generate_image'
  | 'chat_response'
  | 'analyze_lead'
  | 'analyze_sentiment';

export const PROMPT_TEMPLATES: Record<AiAction, (p: any) => string> = {
  generate_copy: (p) =>
    `Write 3 distinct ${p.platform} marketing posts about "${p.topic}" in a ${p.tone} tone, targeted at ${p.audience}. Return them as a JSON array of strings.`,
  generate_strategy: (p) =>
    `Create a digital marketing strategy for the product "${p.productName}" with the goal: "${p.goal}". Return JSON with keys: overview, targetAudience, keyThemes (array of 3-5 strings), suggestedPosts (array of {platform, content, hashtags, bestTime}).`,
  optimize_content: (p) =>
    `Rewrite the following marketing copy to maximise the goal "${p.goal}". Return JSON with keys: original, optimized, changesMade. Original: ${p.originalText}`,
  generate_seo: (p) =>
    `Suggest SEO keywords and content ideas for the topic "${p.topic}" within the niche "${p.niche}". Return JSON with keys: keywords (array of {term, volume, difficulty}), contentIdeas (array of strings), competitorUrls (array of strings).`,
  analyze_competitor: (p) =>
    `Perform a SWOT analysis for "${p.competitorName}" in the ${p.industry} industry. Return JSON with keys: strengths, weaknesses, opportunities, threats (each an array of strings) and strategicAdvice (string).`,
  generate_persona: (p) =>
    `Create a buyer persona for the product "${p.productName}" in the ${p.industry} industry${p.region ? `, region ${p.region}` : ''}. Return JSON with keys: name, ageRange, occupation, incomeLevel, bio, goals (array), frustrations (array), motivations (array), preferredChannels (array).`,
  generate_image: (p) => p.prompt,
  chat_response: (p) =>
    `You are a friendly marketing assistant. The user said: "${p.message}".${p.context ? ` Context: ${p.context}` : ''} Reply concisely and helpfully.`,
  analyze_lead: (p) =>
    `Score the marketing lead from 0-100 based on this data and explain briefly. Lead: name="${p.name}", source="${p.source}", interactions="${p.interactions}". Return JSON: {score, reason}.`,
  analyze_sentiment: (p) =>
    `Classify the sentiment of this text and extract key phrases. Text: "${p.text}". Return JSON: {sentiment: "positive"|"neutral"|"negative", score: -1..1, highlights: string[]}.`,
};
