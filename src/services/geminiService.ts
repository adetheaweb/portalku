import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getAI() {
  if (!genAI) {
    let apiKey = '';
    
    // Check Vite's import.meta.env (Standard for Vercel/Vite deployments)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    }
    
    // Fallback to process.env (AI Studio Preview environment)
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = (process.env as any).GEMINI_API_KEY || '';
    }
    
    if (!apiKey) {
      console.error("Gemini API Key missing!");
      throw new Error("API Key tidak ditemukan. Pastikan variabel 'VITE_GEMINI_API_KEY' sudah diatur di Environment Variables Vercel.");
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateArticleDraft(topic: string) {
  try {
    const ai = getAI();
    // Force v1 API version to avoid issues with v1beta not finding the model
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
    
    const result = await model.generateContent(`Write a helpful article about: ${topic}. Format it in professional Indonesian markdown. Include a catchy title and structured body content.`);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function refineContent(content: string, instruction: string) {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

    const result = await model.generateContent(`Refine the following Indonesian content based on this instruction: "${instruction}". \n\nContent:\n${content}`);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
