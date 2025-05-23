
import React from 'react';
import { GeneratedFile, FileSystemNode } from '../types';

interface FileExplorerProps {
  files: GeneratedFile[];
  selectedFilePath: string | null;
  onSelectFile: (path: string) => void;
}

// Helper to build a simple tree structure (can be enhanced)
// For now, it just lists all files, sorting them by path.
// A more complex version would parse paths into a tree.
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
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-sm text-gray-400">
        No files generated yet.
      </div>
    );
  }

  const fileNodes = buildFileTree(files);

  return (
    // Adjusted max-height: calc(100vh - approx height of header, footer, UserInputPane, and some padding)
    // This is an estimate; for perfect results, a more complex layout or JS height calculation might be needed.
    // For now, 60vh should give it ample space without being too greedy on smaller screens.
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg overflow-y-auto" style={{maxHeight: 'calc(100vh - 20rem)'}}  aria-labelledby="file-explorer-heading">
      <h3 id="file-explorer-heading" className="text-lg font-semibold text-indigo-300 mb-3 border-b border-gray-700 pb-2">Project Files</h3>
      <ul role="listbox" aria-orientation="vertical">
        {fileNodes.map((node) => (
          <li key={node.path} role="option" aria-selected={selectedFilePath === node.path} className="mb-1">
            <button
              onClick={() => onSelectFile(node.path)}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors duration-150 ease-in-out
                ${selectedFilePath === node.path 
                  ? 'bg-indigo-600 text-white' 
                  : 'hover:bg-gray-700 text-gray-200'
                }`}
            >
              <FileIcon />
              <span className="truncate text-sm">{node.name}</span>
              {node.path !== node.name && <span className="text-xs text-gray-400 ml-auto pl-2 truncate hidden sm:inline">{node.path.substring(0, node.path.lastIndexOf('/') + 1)}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
