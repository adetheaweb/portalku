import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    let apiKey = '';
    
    // Check Vite's import.meta.env first (Standard for Vercel/Vite deployments)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    }
    
    // Fallback to process.env (AI Studio Preview environment)
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.GEMINI_API_KEY || '';
    }
    
    if (!apiKey) {
      console.error("Gemini API Key missing!");
      throw new Error("API Key tidak ditemukan. Pastikan variabel 'VITE_GEMINI_API_KEY' sudah diatur di Environment Variables Vercel, atau 'GEMINI_API_KEY' di Settings AI Studio.");
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
