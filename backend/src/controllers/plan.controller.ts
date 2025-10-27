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
const plantripController = async (req : { body: Details },res : any )=>{ 
    // req
    const {destination,duration,interests}=req.body;
    console.log("Received trip planning request:", destination, duration, interests);
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "You are a travel planning assistant. Create a detailed "+duration+" day trip plan for "+destination+" focusing on these interests: "+interests + ". Format the plan as a day-wise itinerary with activities and places to visit.",
  });
  console.log(response.text);
  res.send(response.text);
}
export default plantripController;