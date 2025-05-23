
import React from 'react';

interface CodeViewerProps {
  filePath: string | null;
  code: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ filePath, code }) => {
  const getLanguage = (path: string | null): string => {
    if (!path) return 'plaintext';
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const language = getLanguage(filePath);

  return (
    <div className="flex-grow flex flex-col bg-gray-800 overflow-hidden h-full"> {/* Ensured h-full for flex context */}
      <div className="p-3 bg-gray-750 border-b border-gray-700 text-sm text-indigo-300">
        {filePath ? (
          <span className="font-mono">{filePath}</span>
        ) : (
          <span>No file selected</span>
        )}
        {filePath && <span className="ml-4 px-2 py-0.5 bg-gray-600 text-xs text-gray-300 rounded">{language}</span>}
      </div>
      {/* This div needs to grow to make textarea fill available space */}
      <div className="flex-grow p-1 overflow-auto bg-gray-850"> 
        <textarea
          readOnly
          value={code}
          className="w-full h-full p-3 bg-gray-900 text-gray-200 font-mono text-sm border-none focus:ring-0 resize-none leading-relaxed"
          placeholder="// Code will appear here..."
          spellCheck="false"
          aria-label={filePath ? `Code for ${filePath}` : "Code editor"}
        />
      </div>
    </div>
  );
};
