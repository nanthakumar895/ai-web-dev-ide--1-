import React from 'react';
import { GeneratedFile, FileSystemNode } from '../types';

interface FileExplorerProps {
  files: GeneratedFile[];
  selectedFilePath: string | null;
  onSelectFile: (path: string) => void;
}

const buildFileTree = (files: GeneratedFile[]): FileSystemNode[] => {
    return files
        .map(file => ({ name: file.path.split('/').pop() || file.path, path: file.path, type: 'file' as 'file' | 'folder' }))
        .sort((a, b) => a.path.localeCompare(b.path));
};

const FileIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true">
    <path d="M3.75 3A1.75 1.75 0 002 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25V8.25A2.25 2.25 0 0015.75 6H10.5a.75.75 0 01-.75-.75V2.5A2.75 2.75 0 007 3.75H3.75z" />
  </svg>
);

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, selectedFilePath, onSelectFile }) => {
  if (files.length === 0) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg text-sm text-gray-400">
        No files generated yet.
      </div>
    );
  }

  const fileNodes = buildFileTree(files);

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg overflow-y-auto border border-gray-700/30" style={{maxHeight: 'calc(100vh - 20rem)'}} aria-labelledby="file-explorer-heading">
      <h3 id="file-explorer-heading" className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 pb-3 border-b border-gray-700/50">Project Files</h3>
      <ul role="listbox" aria-orientation="vertical" className="space-y-1">
        {fileNodes.map((node) => (
          <li key={node.path} role="option" aria-selected={selectedFilePath === node.path}>
            <button
              onClick={() => onSelectFile(node.path)}
              className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all duration-200 ease-in-out
                ${selectedFilePath === node.path 
                  ? 'bg-gradient-to-r from-indigo-600/50 to-purple-600/50 text-white shadow-md transform translate-y-px' 
                  : 'hover:bg-gray-700/50 text-gray-300'
                }`}
            >
              <FileIcon />
              <span className="truncate text-sm font-medium">{node.name}</span>
              {node.path !== node.name && (
                <span className="text-xs text-gray-500 ml-auto pl-2 truncate hidden sm:inline">
                  {node.path.substring(0, node.path.lastIndexOf('/') + 1)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};