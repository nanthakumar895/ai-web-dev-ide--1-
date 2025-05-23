import React, { useState, useCallback } from 'react';
import { UserInputPane } from './components/UserInputPane';
import { FileExplorer } from './components/FileExplorer';
import { CodeViewer } from './components/CodeViewer';
import { PreviewPane } from './components/PreviewPane';
// Removed TerminalPane import
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { GeneratedFile, ProjectData } from './types';
import { generateProjectFiles } from './services/geminiService';

type ActiveRightPane = 'code' | 'preview'; // Removed 'terminal'

const App: React.FC = () => {
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRightPane, setActiveRightPane] = useState<ActiveRightPane>('code');

  const handleGenerateProject = useCallback(async () => {
    if (!projectDescription.trim()) {
      setError('Please enter a project description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedFiles([]);
    setSelectedFilePath(null);
    // setActiveRightPane('code'); // Default to code view while generating

    try {
      const projectData: ProjectData | null = await generateProjectFiles(projectDescription);
      if (projectData && projectData.files) {
        setGeneratedFiles(projectData.files);
        const htmlFile = projectData.files.find(f => f.path.toLowerCase() === 'index.html');
        if (htmlFile) {
          setSelectedFilePath(htmlFile.path);
          setActiveRightPane('preview'); 
        } else if (projectData.files.length > 0) {
          const defaultFile = projectData.files.find(f => f.path.endsWith('App.tsx')) ||
                              projectData.files.find(f => f.path.endsWith('main.tsx')) ||
                              projectData.files.find(f => f.path.endsWith('src/App.tsx')) || 
                              projectData.files.find(f => f.path.endsWith('src/main.tsx')) ||
                              projectData.files[0];
          if (defaultFile) {
            setSelectedFilePath(defaultFile.path);
          }
          setActiveRightPane('code'); 
        } else {
           setActiveRightPane('code'); 
        }
      } else {
        setError('Failed to generate project files. The AI might have returned an unexpected response.');
        setGeneratedFiles([]);
        setActiveRightPane('code');
      }
    } catch (err) {
      console.error('Error generating project:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setGeneratedFiles([]);
      setActiveRightPane('code');
    } finally {
      setIsLoading(false);
    }
  }, [projectDescription]);

  const handleSelectFile = useCallback((path: string) => {
    setSelectedFilePath(path);
    setActiveRightPane('code'); 
  }, []);

  const selectedFileContent = selectedFilePath
    ? generatedFiles.find(file => file.path === selectedFilePath)?.content || ''
    : (activeRightPane === 'code' ? '// Select a file to view its content' : '');


  const TabButton: React.FC<{ pane: ActiveRightPane; label: string }> = ({ pane, label }) => (
    <button
      onClick={() => setActiveRightPane(pane)}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-150
        ${activeRightPane === pane
          ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
          : 'text-gray-400 hover:text-indigo-300 hover:bg-gray-750 border-b-2 border-transparent'
        }
        ${(generatedFiles.length === 0 && pane === 'preview') ? 'cursor-not-allowed opacity-50' : ''}
      `}
      aria-pressed={activeRightPane === pane}
      aria-controls={`${pane}-panel`}
      disabled={isLoading || ((generatedFiles.length === 0 && pane === 'preview'))}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-gray-800 shadow-md p-4">
        <h1 className="text-2xl font-bold text-indigo-400 tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 inline-block mr-2 -mt-1">
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.5C2.25 19.56 2.44 20 2.75 20h5A.75.75 0 0 0 8.5 19.25V6.814a.75.75 0 0 0-.23-.53l-.52-.521A6.735 6.735 0 0 1 11.25 4.533ZM12.75 4.533A9.707 9.707 0 0 1 18 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v14.5c0 .44-.19.75-.5.75h-5a.75.75 0 0 1-.75-.75V6.814a.75.75 0 0 1 .23-.53l.52-.521A6.735 6.735 0 0 0 12.75 4.533Z" />
            <path d="M15.75 9.322c0 .79-.53 1.445-1.253 1.642A.75.75 0 0 1 14.25 10.25V7.5a.75.75 0 0 1 .247-.534C15.22 6.785 15.75 7.531 15.75 8.322Z" />
          </svg>
          AI Web Dev IDE
        </h1>
      </header>

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <UserInputPane
            description={projectDescription}
            setDescription={setProjectDescription}
            onGenerate={handleGenerateProject}
            isLoading={isLoading}
            generatedFiles={generatedFiles}
          />
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {isLoading && <div className="flex justify-center items-center p-4 bg-gray-800 rounded-lg shadow"><LoadingSpinner /> <span className="ml-2">Generating project...</span></div>}
          {generatedFiles.length > 0 && !isLoading && (
            <FileExplorer
              files={generatedFiles}
              selectedFilePath={selectedFilePath}
              onSelectFile={handleSelectFile}
            />
          )}
        </div>

        <div className="w-full md:w-2/3 flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-700 bg-gray-750 rounded-t-lg">
            <TabButton pane="code" label="Code" />
            <TabButton pane="preview" label="Preview" />
            {/* Removed Terminal Tab Button */}
          </div>

          {activeRightPane === 'code' && (
            <div id="code-panel" role="tabpanel" className="flex-grow flex flex-col overflow-hidden">
              <CodeViewer
                filePath={selectedFilePath}
                code={selectedFileContent}
              />
            </div>
          )}
          {activeRightPane === 'preview' && (
             <div id="preview-panel" role="tabpanel" className="flex-grow overflow-hidden">
                <PreviewPane generatedFiles={generatedFiles} />
            </div>
          )}
          {/* Removed Terminal Pane rendering logic */}
        </div>
      </main>

      <footer className="bg-gray-800 text-center p-3 text-sm text-gray-400 border-t border-gray-700">
        Powered by Gemini AI. Generated code is for demonstration purposes. Preview functionality depends on the generated code structure.
      </footer>
    </div>
  );
};

export default App;