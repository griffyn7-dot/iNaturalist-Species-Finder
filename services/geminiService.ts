
import { GoogleGenAI } from "@google/genai";
import type { iNatTaxon } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getFunFact(taxon: iNatTaxon): Promise<string> {
  try {
    const prompt = `Provide a single, fascinating, and concise fact (one or two sentences) for a nature enthusiast about the species "${taxon.preferred_common_name || taxon.name}" (scientific name: ${taxon.name}). Focus on a unique behavior, habitat, or characteristic. Do not start with "Did you know...".`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching fun fact from Gemini API:", error);
    return "Could not retrieve a fun fact for this species.";
  }
}
