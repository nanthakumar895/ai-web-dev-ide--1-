import React, { useState } from 'react';
import JSZip from 'jszip';
import { GeneratedFile } from '../types';
import { InstructionModal } from './InstructionModal';

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
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/30">
      <label htmlFor="projectDescription" className="block text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">
        Describe your web application:
      </label>
      <textarea
        id="projectDescription"
        rows={6}
        className="w-full p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-500 text-sm transition-all duration-200 ease-in-out"
        placeholder="e.g., A simple to-do list app with a clean interface, or a blog platform with user authentication..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading || isDownloading}
        aria-label="Project description"
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || isDownloading || !description.trim()}
        className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:translate-y-px flex items-center justify-center text-sm shadow-lg"
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
          'Generate Project'
        )}
      </button>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadProject}
          disabled={isLoading || isDownloading || generatedFiles.length === 0}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:translate-y-px flex items-center justify-center text-sm shadow-lg"
          aria-live="polite"
        >
          {isDownloading ? 'Downloading...' : 'Download Project'}
        </button>
        <button
          onClick={() => setShowVSCodeInstructions(true)}
          disabled={isLoading || isDownloading || generatedFiles.length === 0}
          className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:translate-y-px flex items-center justify-center text-sm shadow-lg"
        >
          Open in VS Code
        </button>
      </div>
      {showVSCodeInstructions && <InstructionModal onClose={() => setShowVSCodeInstructions(false)} />}
    </div>
  );
};