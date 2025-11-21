import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, AIChefResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDishDescription = async (item: MenuItem): Promise<AIChefResponse> => {
  try {
    const prompt = `
      You are a world-class food critic and chef. 
      Describe the dish "${item.name}" which is described as "${item.description}".
      Make it sound incredibly appetizing, focusing on texture, aroma, and the umami of the squid ink (if applicable).
      Also suggest a drink pairing.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            pairingSuggestion: { type: Type.STRING },
          },
          required: ["description", "pairingSuggestion"]
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIChefResponse;
  } catch (error) {
    console.error("Error generating description:", error);
    return {
      description: "A delicious choice that satisfies the soul.",
      pairingSuggestion: "Ice cold tea."
    };
  }
};