
import React, { useMemo } from 'react';
import { GeneratedFile } from '../types';

interface PreviewPaneProps {
  generatedFiles: GeneratedFile[];
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ generatedFiles }) => {
  const htmlFile = useMemo(() => {
    return generatedFiles.find(file => file.path.toLowerCase() === 'index.html');
  }, [generatedFiles]);

  if (!htmlFile) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 text-gray-400 bg-gray-850 h-full">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <h3 className="text-lg font-semibold mb-1">No Preview Available</h3>
            <p className="text-sm">An <code className="bg-gray-700 px-1 rounded">index.html</code> file was not found in the generated project.</p>
            <p className="text-xs mt-2">Generate a project or ensure your prompt results in an <code className="bg-gray-700 px-1 rounded">index.html</code> file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-gray-850 h-full overflow-hidden">
       <div className="p-2 bg-gray-750 border-b border-gray-700 text-xs text-gray-300">
        <p>
          Displaying <code className="font-mono bg-gray-600 px-1 rounded">index.html</code>.
          Note: Complex JavaScript (e.g., ES modules, React via local .tsx files) may not run correctly in this basic preview.
          Tailwind CSS from CDN should apply.
        </p>
      </div>
      <iframe
        srcDoc={htmlFile.content}
        title="Project Preview"
        className="w-full h-full border-0 flex-grow"
        sandbox="allow-scripts allow-same-origin" // allow-scripts for JS, allow-same-origin might be needed for some relative asset loads if they were possible. For srcdoc, it has a unique origin.
      />
    </div>
  );
};
