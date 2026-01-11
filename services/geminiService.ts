import { GoogleGenAI } from "@google/genai";
import { Ward } from '../types';

let aiClient: GoogleGenAI | null = null;

// Initialize conditionally to prevent crashes if key is missing during dev
try {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key missing or invalid initialization.");
}

export const getWardAnalysis = async (ward: Ward): Promise<string> => {
  if (!aiClient) return "Gemini API Key not configured. Using simulated analysis: High pollution detected due to local sources.";

  const prompt = `
    Analyze the air quality for ${ward.name} (ID: ${ward.id}).
    Current AQI: ${ward.aqi} (${ward.category}).
    Primary Sources: ${ward.primarySources.join(', ')}.
    Pollutants: PM2.5: ${ward.pollutants.pm25}, PM10: ${ward.pollutants.pm10}, NO2: ${ward.pollutants.no2}.
    Weather: Temp ${ward.weather.temperature.toFixed(1)}C, Wind ${ward.weather.windSpeed.toFixed(1)} km/h.

    Provide a concise 3-sentence summary explaining why the pollution is at this level and identify the most likely specific cause (e.g., peak traffic, specific industrial activity, stagnant wind).
    Then provide 3 bullet points for immediate actionable mitigation strategies for the local municipal ward officer.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis temporarily unavailable. Please check connectivity or API limits.";
  }
};

export const getForecastInsights = async (wards: Ward[]): Promise<string> => {
    if (!aiClient) return "Simulated Forecast: Pollution levels expected to rise in industrial zones due to low wind speed.";

    const summaryData = wards.map(w => `${w.name}: ${w.aqi}`).join(', ');
    const prompt = `
        Given the current AQI levels across these wards: ${summaryData}.
        Predict the trend for the next 24 hours assuming typical urban patterns (morning peak, evening peak) and current weather (assume generally stable).
        Highlight which ward needs the most urgent attention tomorrow.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Forecast unavailable.";
    } catch (error) {
        return "Forecast insights unavailable.";
    }
}

export const getChatResponse = async (query: string, wards: Ward[]): Promise<string> => {
    if (!aiClient) return "I am running in simulation mode. Based on the data, Okhla has the highest pollution today. Try connecting an API key for live AI responses.";
    
    // Create a lean context string to avoid token limits
    const context = wards.map(w => `${w.name}: ${w.aqi} AQI (${w.category})`).join('; ');
    
    const prompt = `
        You are EcoBot, an intelligent voice assistant for the Delhi Air Quality Dashboard.
        Current Ward Data: ${context}.
        
        User Question: "${query}"
        
        Answer the user's question concisely (max 2 sentences). If they ask about the worst ward, identify the one with highest AQI. If they ask for advice, give a quick health tip. Speak naturally.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "I couldn't process that question.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I'm having trouble connecting to my servers right now.";
    }
}