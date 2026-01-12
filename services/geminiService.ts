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

export const getPollutionCausalityAnalysis = async (ward: Ward): Promise<string> => {
    if (!aiClient) return "Analysis unavailable without API Key. Likely causes: High traffic density and low wind speeds trapping pollutants.";

    const prompt = `
        You are an environmental scientist talking to a citizen.
        Ward: ${ward.name}
        AQI: ${ward.aqi} (${ward.category})
        Pollutants: PM2.5 (${ward.pollutants.pm25}), NO2 (${ward.pollutants.no2})
        Weather: Wind ${ward.weather.windSpeed} km/h, Temp ${ward.weather.temperature}C.
        Traffic Index: ${ward.trafficIndex}/100.
        
        Question: "Why is my ward polluted right now?"
        
        Answer instructions:
        1. Explain the primary cause in 1 simple sentence (e.g. "Heavy traffic on Main Road coupled with low wind is trapping smoke.").
        2. Mention if weather is helping or hurting.
        3. Be conversational and empathetic.
        4. Max 50 words.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Analysis unavailable.";
    } catch (error) {
        return "System is currently unable to analyze specific causes.";
    }
}

export const getChatResponse = async (query: string, wards: Ward[], language: 'en' | 'hi' = 'en'): Promise<string> => {
    if (!aiClient) return language === 'hi' 
        ? "नमस्ते, मैं सिमुलेशन मोड में चल रहा हूँ। कृपया API कुंजी जोड़ें।" 
        : "I am running in simulation mode. Try connecting an API key for live AI responses.";
    
    // Create a lean context string
    const context = wards.map(w => `${w.name}: ${w.aqi} AQI (${w.category})`).join('; ');
    
    const prompt = `
        You are EcoBot, an intelligent voice assistant for the Pollution Dashboard.
        
        CONTEXT DATA (Local Sensors):
        ${context}
        
        USER QUERY: "${query}"
        
        INSTRUCTIONS:
        1. Language: Reply strictly in ${language === 'hi' ? 'Hindi (Simple conversational)' : 'English'}.
        2. Data Source: 
           - If the user asks about the wards listed in the Context Data, use that data.
           - If the user asks about general air quality facts, health advice, or real-world news (e.g. "What is the AQI in New York?", "Pollution in Delhi today"), use Google Search to get real-time information.
        3. Style: Keep the answer concise (max 2-3 sentences) suitable for voice speech. Do not use markdown formatting.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        return response.text || (language === 'hi' ? "क्षमा करें, मैं समझ नहीं पाया।" : "I couldn't process that question.");
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return language === 'hi' ? "कनेक्शन में समस्या है।" : "I'm having trouble connecting right now.";
    }
}