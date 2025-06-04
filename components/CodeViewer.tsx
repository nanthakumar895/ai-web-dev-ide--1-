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
    <div className="flex-grow flex flex-col bg-gray-800/50 overflow-hidden h-full">
      <div className="p-4 bg-gray-750/50 border-b border-gray-700/50 flex items-center">
        {filePath ? (
          <span className="font-mono text-sm text-indigo-300">{filePath}</span>
        ) : (
          <span className="text-gray-400">No file selected</span>
        )}
        {filePath && (
          <span className="ml-4 px-3 py-1 bg-gray-700/50 text-xs text-gray-300 rounded-full font-medium">
            {language}
          </span>
        )}
      </div>
      <div className="flex-grow p-1 overflow-auto bg-gray-850/50">
        <textarea
          readOnly
          value={code}
          className="w-full h-full p-4 bg-gray-900/50 text-gray-200 font-mono text-sm border-none focus:ring-0 resize-none leading-relaxed rounded-lg"
          placeholder="// Code will appear here..."
          spellCheck="false"
          aria-label={filePath ? `Code for ${filePath}` : "Code editor"}
        />
      </div>
    </div>
  );
};