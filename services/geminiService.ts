import { GoogleGenAI, Type } from "@google/genai";
import { Platform, Tone, CampaignStrategy, SwotAnalysis, OptimizationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Content Generation (Standard) ---
export const generateMarketingCopy = async (
  topic: string,
  platform: Platform,
  tone: Tone,
  audience: string
): Promise<string[]> => {
  try {
    const prompt = `
      Generate 3 distinct social media posts for ${platform} about "${topic}".
      Target Audience: ${audience}.
      Tone: ${tone}.
      Include emojis and 3-5 hashtags.
      Return ONLY a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating text:", error);
    return ["Failed to generate content. Please try again."];
  }
};

export const generateCampaignStrategy = async (
  productName: string,
  goal: string
): Promise<CampaignStrategy | null> => {
  try {
    const prompt = `
      Create a mini marketing campaign strategy for "${productName}".
      Goal: ${goal}.
      
      Output JSON with:
      - overview (brief strategy summary)
      - targetAudience (description of ideal customer)
      - keyThemes (array of 3 marketing angles)
      - suggestedPosts (array of 3 posts for different platforms, including content, hashtags array, and bestTime to post string).
    `;

    // Using Gemini 3 Pro for deeper strategic reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedPosts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  content: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  bestTime: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as CampaignStrategy;
  } catch (error) {
    console.error("Error generating strategy:", error);
    return null;
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

// --- Lead Intelligence (Gemini 3 Pro) ---
export const analyzeLeadScore = async (leadData: {name: string, source: string, interactions: string}): Promise<{score: number, reason: string}> => {
  try {
    const prompt = `
      Act as a senior sales analyst. Analyze this lead and assign a conversion probability score (0-100).
      Lead Name: ${leadData.name}
      Source: ${leadData.source}
      Interactions: ${leadData.interactions}
      
      Provide a JSON response with:
      - 'score': number
      - 'reason': A concise, insightful 1-sentence reason for the score.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro model for better reasoning
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          }
        }
      }
    });
    
    const text = response.text;
    if(text) return JSON.parse(text);
    return { score: 50, reason: "Analysis failed, default score." };

  } catch (error) {
    console.error("Lead scoring error:", error);
    return { score: 0, reason: "Error in AI analysis." };
  }
};

// --- Competitor Analysis (Gemini 3 Pro with Thinking) ---
export const analyzeCompetitor = async (competitorName: string, industry: string): Promise<SwotAnalysis | null> => {
  try {
    const prompt = `
      Perform a strategic SWOT analysis for a competitor named "${competitorName}" in the "${industry}" industry.
      Think deeply about market trends and potential hidden factors.
      
      Return JSON with:
      - strengths (array of 3 strings)
      - weaknesses (array of 3 strings)
      - opportunities (array of 3 strings)
      - threats (array of 3 strings)
      - strategicAdvice (A paragraph of advice on how to compete against them)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for deeper analysis
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicAdvice: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as SwotAnalysis;
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return null;
  }
};

// --- Content Optimization (Gemini 3 Pro) ---
export const optimizeContent = async (originalText: string, goal: string): Promise<OptimizationResult | null> => {
  try {
    const prompt = `
      Act as an expert copyeditor. Rewrite the following text to achieve this goal: "${goal}".
      
      Original Text: "${originalText}"
      
      Return JSON with:
      - original (the input text)
      - optimized (the rewritten text)
      - changesMade (a brief explanation of what was improved and why)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            optimized: { type: Type.STRING },
            changesMade: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as OptimizationResult;
  } catch (error) {
    console.error("Content optimization error:", error);
    return null;
  }
};