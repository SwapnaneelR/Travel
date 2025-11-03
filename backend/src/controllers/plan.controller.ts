import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY!,
});
interface Details{
    destination: string;
    duration: number;
    interests: string | undefined;
}
const plantripController = async (req: { body: Details }, res: any) => {
  const { destination, duration, interests } = req.body;
  console.log("Received trip planning request:", destination, duration, interests);
  // headers for SSE
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const prompt = `Create a detailed ${duration}-day trip plan for ${destination} focusing on these interests: ${interests}. 
  Format the plan as a day-wise itinerary with activities and places to visit.`;

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are a travel planning assistant. Your plans should be detailed and engaging. Return markdown format for better readability, and include emojis to make it attractive.",
    },
  });

  try {
    for await (const chunk of response) {
      const text = chunk?.text;
      if (text) {
        res.write(text);   
      }
    }
  } catch (error) {
    console.error("Stream error:", error);
  } finally {
    res.end();  
  }
};

export default plantripController;