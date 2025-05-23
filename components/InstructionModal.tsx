
import React from 'react';

interface InstructionModalProps {
  onClose: () => void;
}

export const InstructionModal: React.FC<InstructionModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vscode-instruction-title"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full border border-indigo-500">
        <div className="flex justify-between items-center mb-4">
          <h2 id="vscode-instruction-title" className="text-xl font-semibold text-indigo-300">How to Open Project in VS Code</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200"
            aria-label="Close instructions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-sm text-gray-200 space-y-3">
          <p>
            1. If you haven't already, click the <strong className="text-green-400">"Download Project"</strong> button to get a <code className="bg-gray-700 px-1 rounded text-xs">.zip</code> file.
          </p>
          <p>
            2. <strong className="text-indigo-300">Extract the ZIP file</strong> to a folder on your computer.
          </p>
          <p>
            3. Open Visual Studio Code.
          </p>
          <p>
            4. In VS Code, go to <code className="bg-gray-700 px-1 rounded text-xs">File &gt; Open Folder...</code> (or use shortcut <code className="bg-gray-700 px-1 rounded text-xs">Ctrl+K Ctrl+O</code> on Windows/Linux, <code className="bg-gray-700 px-1 rounded text-xs">Cmd+O</code> then select folder on macOS).
          </p>
          <p>
            5. Navigate to and select the folder where you extracted the project files.
          </p>
          <div className="pt-2 mt-2 border-t border-gray-700">
            <p className="font-semibold text-indigo-400">Alternatively (using the terminal):</p>
            <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
              <li>Open your terminal or command prompt.</li>
              <li>Navigate into the extracted project folder (e.g., <code className="bg-gray-700 px-1 rounded text-xs">cd path/to/your/extracted-project</code>).</li>
              <li>Type <code className="bg-gray-700 px-1 rounded text-xs">code .</code> and press Enter. (This requires the 'code' command to be in your system's PATH, which is typical for VS Code installations).</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
