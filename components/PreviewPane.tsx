import React, { useMemo } from 'react';
import { GeneratedFile } from '../types';

interface PreviewPaneProps {
  generatedFiles: GeneratedFile[];
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ generatedFiles }) => {
  const previewContent = useMemo(() => {
    // First, try to find index.html
    const htmlFile = generatedFiles.find(file => 
      file.path.toLowerCase() === 'index.html' || 
      file.path.toLowerCase().endsWith('/index.html')
    );

    if (htmlFile) {
      return htmlFile.content;
    }

    // If no index.html, create a preview from available files
    const cssFiles = generatedFiles.filter(file => file.path.endsWith('.css'));
    const jsFiles = generatedFiles.filter(file => file.path.endsWith('.js'));
    const tsxFiles = generatedFiles.filter(file => file.path.endsWith('.tsx'));
    const jsxFiles = generatedFiles.filter(file => file.path.endsWith('.jsx'));

    // Create a basic HTML structure with available CSS and JS
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Project Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>`;

    // Add CSS files
    cssFiles.forEach(cssFile => {
      htmlContent += `
    <style>
${cssFile.content}
    </style>`;
    });

    htmlContent += `
</head>
<body>`;

    // If we have React files, show a message about React preview limitations
    if (tsxFiles.length > 0 || jsxFiles.length > 0) {
      htmlContent += `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div class="max-w-2xl mx-auto text-center">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <svg class="w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 class="text-xl font-semibold text-blue-800 mb-2">React Project Detected</h2>
                <p class="text-blue-700">This appears to be a React project. The preview pane shows a simplified view since React components require a build process.</p>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Generated Files:</h3>
                <div class="grid gap-2 text-left">`;

      generatedFiles.forEach(file => {
        const fileType = file.path.split('.').pop()?.toUpperCase() || 'FILE';
        htmlContent += `
                    <div class="flex items-center p-3 bg-gray-50 rounded border">
                        <span class="inline-block w-12 text-xs font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded mr-3">${fileType}</span>
                        <span class="font-mono text-sm text-gray-800">${file.path}</span>
                    </div>`;
      });

      htmlContent += `
                </div>
                <p class="text-sm text-gray-600 mt-4">Download the project and run it locally to see the full React application in action.</p>
            </div>
        </div>
    </div>`;
    } else {
      // For non-React projects, try to create a basic preview
      htmlContent += `
    <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-6">Generated Project</h1>
        <div class="grid gap-4">`;

      generatedFiles.forEach(file => {
        if (file.path.endsWith('.js')) {
          htmlContent += `
        <script>
${file.content}
        </script>`;
        }
      });

      htmlContent += `
        </div>
    </div>`;
    }

    htmlContent += `
</body>
</html>`;

    return htmlContent;
  }, [generatedFiles]);

  if (generatedFiles.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 text-gray-400 bg-gray-850 h-full">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <h3 className="text-lg font-semibold mb-1">No Preview Available</h3>
          <p className="text-sm">Generate a project first to see the preview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-gray-850 h-full overflow-hidden">
      <div className="p-2 bg-gray-750 border-b border-gray-700 text-xs text-gray-300">
        <p>
          Project Preview - Generated files are rendered in a sandboxed environment.
        </p>
      </div>
      <iframe
        srcDoc={previewContent}
        title="Project Preview"
        className="w-full h-full border-0 flex-grow"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};