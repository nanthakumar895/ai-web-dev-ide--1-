import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ProjectData } from '../types';

const API_KEY = import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable not set. AI features will not work.");
  // Potentially throw an error or use a mock response for development if API_KEY is not critical for all parts of the app.
  // For this app, it's critical.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Use ! to assert API_KEY is present, after check

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export async function generateProjectFiles(userDescription: string): Promise<ProjectData | null> {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please set the GEMINI_API_KEY environment variable.");
  }
  
  const prompt = `
You are an expert full-stack web development AI. Your task is to generate the complete code for a web application based on the user's description.
The user wants to build: "${userDescription}".

Please generate all necessary files for a modern web application.
The project should use the following technology stack:
- Frontend: React 18+ with TypeScript (.tsx), Vite for bundling.
- Styling: Tailwind CSS. Ensure 'tailwind.config.js' and necessary setup in 'index.html' (CDN link) are included.
- Common files: 
  - 'index.html' (must include <script src="https://cdn.tailwindcss.com"></script> and <script type="module" src="/src/main.tsx"></script>)
  - 'src/main.tsx' (React entry point using ReactDOM.createRoot)
  - 'src/App.tsx' (main App component)
  - 'vite.config.ts' (configured for React and TypeScript)
  - 'tailwind.config.js' (basic configuration)
  - 'package.json' (with dependencies: react, react-dom, @vitejs/plugin-react, vite, typescript, tailwindcss. Include dev scripts for vite)
  - 'tsconfig.json' (basic configuration for a Vite + React + TS project)
- If the user description implies a backend (e.g., "user authentication", "database interaction", "API endpoints"), generate a simple Node.js with Express.js backend in TypeScript:
  - Place backend files in a 'server/' directory (e.g., 'server/server.ts').
  - Include 'express' and '@types/express' in 'package.json' dependencies.
  - Add a script to 'package.json' to run the backend server (e.g., "dev:server": "nodemon server/server.ts" or similar).
  - If no backend is implied, focus solely on the frontend application.

Output ONLY a single JSON object with a key "files". The value of "files" should be an array of objects. Each object must represent a file and have two properties:
1.  "path": A string representing the full path of the file (e.g., "index.html", "src/App.tsx", "server/server.ts"). Use POSIX-style paths (forward slashes).
2.  "content": A string containing the complete, raw code/content for that file.

Example of the required JSON output structure:
\`\`\`json
{
  "files": [
    {
      "path": "index.html",
      "content": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n  <meta charset=\\"UTF-8\\" />\\n  <title>My App</title>\\n  <script src=\\"https://cdn.tailwindcss.com\\"></script>\\n</head>\\n<body>\\n  <div id=\\"root\\"></div>\\n  <script type=\\"module\\" src=\\"/src/main.tsx\\"></script>\\n</body>\\n</html>"
    },
    {
      "path": "src/main.tsx",
      "content": "import React from 'react';\\nimport ReactDOM from 'react-dom/client';\\nimport App from './App';\\n\\nReactDOM.createRoot(document.getElementById('root')!).render(\\n  <React.StrictMode>\\n    <App />\\n  </React.StrictMode>\\n);"
    },
    {
      "path": "src/App.tsx",
      "content": "import React from 'react';\\n\\nfunction App() {\\n  return <h1 className=\\"text-2xl font-bold text-center mt-10\\">Hello from AI Generated App!</h1>;\\n}\\n\\nexport default App;"
    },
    {
      "path": "package.json",
      "content": "{\\n  \\"name\\": \\"ai-generated-app\\",\\n  \\"private\\": true,\\n  \\"version\\": \\"0.0.0\\",\\n  \\"type\\": \\"module\\",\\n  \\"scripts\\": {\\n    \\"dev\\": \\"vite\\",\\n    \\"build\\": \\"tsc && vite build\\",\\n    \\"preview\\": \\"vite preview\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"react\\": \\"^18.2.0\\",\\n    \\"react-dom\\": \\"^18.2.0\\"\\n  },\\n  \\"devDependencies\\": {\\n    \\"@types/react\\": \\"^18.0.0\\",\\n    \\"@types/react-dom\\": \\"^18.0.0\\",\\n    \\"@vitejs/plugin-react\\": \\"^4.0.0\\",\\n    \\"typescript\\": \\"^5.0.0\\",\\n    \\"vite\\": \\"^5.0.0\\",\\n    \\"tailwindcss\\": \\"^3.3.0\\"\\n  }\\n}"
    }
    // ... other files like vite.config.ts, tailwind.config.js, tsconfig.json etc.
  ]
}
\`\`\`

Ensure all generated code is complete and functional for the specified stack.
Do not include any explanations, comments, or text outside of the JSON structure. The entire response must be parseable as JSON.
Make sure file paths are correct and conventional (e.g. 'public/' for static assets if any, 'src/' for source code).
The 'index.html' MUST be at the root.
The 'package.json' MUST include 'tailwindcss' as a devDependency and a basic 'tailwind.config.js' should be generated.
The default React app should be simple but demonstrate Tailwind CSS usage.
If you generate a backend, ensure its 'package.json' scripts are distinct from frontend scripts (e.g. by prefixing or using a tool like concurrently, but a simple separate script is fine).
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // temperature: 0.7, // Adjust for creativity vs. precision
      },
    });
    
    const rawJson = response.text;
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