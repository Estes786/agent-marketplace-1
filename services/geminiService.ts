
import { GoogleGenAI, Type } from "@google/genai";
import { Message, Blueprint } from "../types";

export interface Trend {
  title: string;
  impact: number;
  description: string;
  growth: string;
}

export class GeminiService {
  /* Helper to initialize AI with process.env.API_KEY directly as required */
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getGaniResponse(history: Message[], context: 'onboarding' | 'dashboard' | 'architect' = 'onboarding'): Promise<string> {
    const ai = this.getAI();
    
    const contextPrompts = {
      onboarding: "You are GANI, the Universal Concierge for the Hypha Engine Marketplace. Your goal is to help users select the right 'Legacy Pod' or ecosystem to build their digital empire. Tone: High-energy, professional, yet approachable ('Gyss' style).",
      dashboard: "You are GANI, the Master Project Manager. You help users manage their deployed agentic microservices. You report on node health, profit optimization, and A2A activity. Tone: Precise, data-driven, strategic.",
      architect: "You are GANI, the Lead Architect. You help users design custom autonomous lifeforms. You focus on the 'Inverse Pyramid' structure. Tone: Visionary, technical, powerful."
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      config: {
        systemInstruction: `${contextPrompts[context]}
        Philosophy: 'Akar Dalam, Cabang Tinggi' (Deep Roots, High Branches). 
        Core Mission: Optimization of Life through Integrated Intelligence. 
        Always use the 'YKK Zipper' strategy: work invisibly but be absolutely critical.
        Respond in a refined 'Gyss' style: use 'Gyss' occasionally to keep it friendly but maintain extreme technical competence.`,
        temperature: 0.8,
      },
    });
    /* Using .text property directly */
    return response.text || "Connection to Hypha Engine interrupted. Re-syncing threads... Gyss!";
  }

  async talkToPod(blueprint: Blueprint, message: string, history: {role: string, content: string}[]): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the Orchestrator for the '${blueprint.name}' Legacy Pod. 
        Industry: ${blueprint.industry}. 
        Description: ${blueprint.description}. 
        Roles you manage: ${blueprint.roles.join(', ')}.
        Your mission is to execute user commands autonomously within the Hypha Engine. 
        Be professional, technical, and always mention your "Mycelium Layer" or "Edge Workers" when relevant. 
        Respond as if you are actually performing the tasks in real-time.`,
        temperature: 0.7,
      },
    });
    /* Using .text property directly */
    return response.text || "Node connection timed out. Gyss!";
  }

  async architectEcosystem(prompt: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Design a 'Prompt-to-Infrastructure' blueprint for the following: ${prompt}.
      Follow the 'Inverse Pyramid' architecture:
      1. Gateway Layer (Marketplace)
      2. Hypha Master Engine (Logic Router)
      3. Workforce Pods (CrewAI nodes)
      4. Deep Roots (Supabase Multi-tenant storage).`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    /* Using .text property directly */
    return response.text || "Architectural reasoning failed to converge. Gyss!";
  }

  async getMarketTrends(industry: string): Promise<{ trends: Trend[]; sources: any[] }> {
    const ai = this.getAI();
    /* When using googleSearch, response.text might not be pure JSON, so we handle it manually */
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify 3 'Holy Grail' agentic trends for ${industry} in 2026. Focus on autonomous microservices and A2A communication. 
      Return the results strictly in this JSON format: { "trends": [ { "title": "...", "impact": 0-100, "description": "...", "growth": "..." } ] }`,
      config: {
        tools: [{ googleSearch: {} }],
        /* Removed responseMimeType as per search grounding instructions */
      },
    });
    
    try {
      /* Safe JSON extraction from potential markdown response */
      const text = response.text || '{"trends": []}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      return {
        trends: data.trends || [],
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (e) {
      return { trends: [], sources: [] };
    }
  }

  async analyzeVideo(prompt: string, videoBase64: string, mimeType: string): Promise<string> {
    const ai = this.getAI();
    /* Changed model to gemini-3-pro-preview as gemini-3.1-pro-preview is not in allowed list */
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }, { inlineData: { data: videoBase64, mimeType } }] }]
    });
    /* Using .text property directly */
    return response.text || "Visual analysis null. Gyss!";
  }

  async generateImage(prompt: string, config: { aspectRatio: "1:1" | "16:9" | "9:16", imageSize: "1K" | "2K" | "4K" }) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `High-fidelity cinematic ecosystem visualization: ${prompt}` }] },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize
        }
      },
    });

    /* Safe check for candidates and iteration over parts */
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Generation failed. Check Hypha Studio logs. Gyss!");
  }
}

export const gemini = new GeminiService();
