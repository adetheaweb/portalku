import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function generateArticleDraft(topic: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Write a helpful article about: ${topic}. Format it in professional Indonesian markdown. Include a catchy title and structured body content.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function refineContent(content: string, instruction: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Refine the following Indonesian content based on this instruction: "${instruction}". \n\nContent:\n${content}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
