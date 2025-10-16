// Reference: javascript_gemini blueprint
import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

interface OptimizationResult {
  optimizedTitle: string;
  optimizedBullets: string[];
  optimizedDescription: string;
  suggestedKeywords: string[];
}

export async function optimizeProductListing(
  title: string,
  bullets: string[],
  description: string
): Promise<OptimizationResult> {
  try {
    const systemPrompt = `You are an expert Amazon listing optimization specialist. Your goal is to improve product listings for better visibility, conversion, and compliance with Amazon's guidelines.

When optimizing:
1. Title: Make it keyword-rich, readable, and compelling (150-200 characters max)
2. Bullet Points: Make them clear, concise, benefit-focused (5 bullets, each 150-200 characters)
3. Description: Make it persuasive, detailed, and compliant with Amazon guidelines (avoid unsubstantiated claims)
4. Keywords: Suggest 3-5 highly relevant SEO keywords not already in the title

Respond ONLY with valid JSON in this exact format:
{
  "optimizedTitle": "string",
  "optimizedBullets": ["string", "string", "string", "string", "string"],
  "optimizedDescription": "string",
  "suggestedKeywords": ["string", "string", "string"]
}`;

    const userPrompt = `Optimize this Amazon product listing:

ORIGINAL TITLE:
${title}

ORIGINAL BULLET POINTS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

ORIGINAL DESCRIPTION:
${description}

Provide optimized version following best practices for Amazon SEO and conversion.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            optimizedTitle: { type: "string" },
            optimizedBullets: {
              type: "array",
              items: { type: "string" }
            },
            optimizedDescription: { type: "string" },
            suggestedKeywords: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["optimizedTitle", "optimizedBullets", "optimizedDescription", "suggestedKeywords"],
        },
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    });

    const rawJson = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const result: OptimizationResult = JSON.parse(rawJson);
    return result;
  } catch (error) {
    console.error("Gemini optimization error:", error);
    throw new Error(`Failed to optimize listing with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
