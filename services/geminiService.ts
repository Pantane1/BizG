import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { DataAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Generic text generation for Support, Marketing, and Ops
export const generateBizContent = async (
  modelId: string,
  prompt: string,
  systemInstruction: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const parts: any[] = [];
    
    // Add image part if provided
    if (imageBase64) {
      // Extract the actual base64 string (remove data:image/xxx;base64, prefix)
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    // Add text prompt part
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balance creativity and precision
      },
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};

// Structured data analysis
export const analyzeBusinessData = async (
  rawData: string
): Promise<DataAnalysisResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this data and provide insights: ${rawData}`,
      config: {
        systemInstruction: "You are a Data Analyst. Output JSON with a summary, key insights, chartable data points (label/value), and a strategic recommendation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["label", "value"]
              }
            },
            recommendation: { type: Type.STRING }
          },
          required: ["summary", "insights", "chartData", "recommendation"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as DataAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};