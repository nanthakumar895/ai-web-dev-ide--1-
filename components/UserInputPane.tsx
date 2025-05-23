
import React, { useState } from 'react';
import JSZip from 'jszip';
import { GeneratedFile } from '../types';
import { InstructionModal } from './InstructionModal'; // New component

interface UserInputPaneProps {
  description: string;
  setDescription: (description: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  generatedFiles: GeneratedFile[];
}

export const UserInputPane: React.FC<UserInputPaneProps> = ({ description, setDescription, onGenerate, isLoading, generatedFiles }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showVSCodeInstructions, setShowVSCodeInstructions] = useState(false);

  const handleDownloadProject = async () => {
    if (generatedFiles.length === 0 || isDownloading) return;

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      generatedFiles.forEach(file => {
        zip.file(file.path, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'ai-generated-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Error creating ZIP file:", error);
      // Optionally, set an error state to display to the user
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <label htmlFor="projectDescription" className="block text-sm font-medium text-indigo-300 mb-1">
        Describe your web application:
      </label>
      <textarea
        id="projectDescription"
        rows={6} // Slightly reduced rows to make space for new buttons
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400 text-sm"
        placeholder="e.g., A simple to-do list app with a clean interface, or a blog platform with user authentication..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading || isDownloading}
        aria-label="Project description"
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || isDownloading || !description.trim()}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center text-sm"
        aria-live="polite"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
            </svg>
            Generate Project
          </>
        )}
      </button>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleDownloadProject}
          disabled={isLoading || isDownloading || generatedFiles.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center text-sm"
          aria-live="polite"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.905 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              Download Project
            </>
          )}
        </button>
        <button
          onClick={() => setShowVSCodeInstructions(true)}
          disabled={isLoading || isDownloading || generatedFiles.length === 0}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center text-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          Open in VS Code
        </button>
      </div>
      {showVSCodeInstructions && <InstructionModal onClose={() => setShowVSCodeInstructions(false)} />}
    </div>
  );
};
