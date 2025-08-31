import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ProjectData } from '../types';

const API_KEY = import.meta.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
  console.error("GEMINI_API_KEY environment variable not set or using placeholder value. Please set a valid API key in .env.local");
  throw new Error("Gemini API Key is not configured. Please set the GEMINI_API_KEY environment variable in .env.local");
}

const ai = new GoogleGenAI(API_KEY);

const MODEL_NAME = "gemini-2.0-flash-exp";

export async function generateProjectFiles(userDescription: string): Promise<ProjectData | null> {
  try {
    const model = ai.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `Generate a complete web application based on this description: "${userDescription}"

Please return a JSON object with this exact structure:
{
  "files": [
    {
      "path": "index.html",
      "content": "<!DOCTYPE html>..."
    },
    {
      "path": "style.css", 
      "content": "/* CSS content */"
    },
    {
      "path": "script.js",
      "content": "// JavaScript content"
    }
  ]
}

Requirements:
- Always include an index.html file as the main entry point
- Include CSS for styling (either inline in HTML or separate file)
- Include JavaScript for interactivity if needed
- Make it a complete, functional web application
- Use modern HTML5, CSS3, and vanilla JavaScript
- Ensure the code is clean and well-structured
- Make it visually appealing with good design
- Return ONLY the JSON object, no additional text or markdown`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawJson = response.text();
    
    let cleanedJson = rawJson.trim();
    
    // Remove markdown fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanedJson.match(fenceRegex);
    if (match && match[2]) {
      cleanedJson = match[2].trim();
    }

    const parsedData = JSON.parse(cleanedJson) as ProjectData;
    if (parsedData && parsedData.files && Array.isArray(parsedData.files)) {
      return parsedData;
    }
    console.error("Unexpected JSON structure from Gemini API:", parsedData);
    throw new Error("AI returned an unexpected data structure for project files.");

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key. Please check your GEMINI_API_KEY environment variable.");
    }
    throw new Error(`Failed to generate project files using AI. ${error instanceof Error ? error.message : ''}`);
  }
}