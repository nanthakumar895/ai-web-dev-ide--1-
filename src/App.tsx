import React, { useState, useCallback } from 'react';
import { UserInputPane } from '../components/UserInputPane';
import { FileExplorer } from '../components/FileExplorer';
import { CodeViewer } from '../components/CodeViewer';
import { PreviewPane } from '../components/PreviewPane';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { GeneratedFile, ProjectData } from './types';
import { generateProjectFiles } from './services/geminiService';

type ActiveRightPane = 'code' | 'preview';

const App: React.FC = () => {
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRightPane, setActiveRightPane] = useState<ActiveRightPane>('preview');

  const handleGenerateProject = useCallback(async () => {
    if (!projectDescription.trim()) {
      setError('Please enter a project description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedFiles([]);
    setSelectedFilePath(null);

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
      className={`px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out rounded-t-lg
        ${activeRightPane === pane
          ? 'bg-gray-800 text-indigo-400 shadow-lg transform translate-y-px'
          : 'text-gray-400 hover:text-indigo-300 hover:bg-gray-750'
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight flex items-center gap-3">
          AI Web Dev IDE
        </h1>
      </header>

      <main className="flex-grow flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <UserInputPane
            description={projectDescription}
            setDescription={setProjectDescription}
            onGenerate={handleGenerateProject}
            isLoading={isLoading}
            generatedFiles={generatedFiles}
          />
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {isLoading && (
            <div className="flex justify-center items-center p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg">
              <LoadingSpinner />
              <span className="ml-3 text-indigo-300">Generating project...</span>
            </div>
          )}
          {generatedFiles.length > 0 && !isLoading && (
            <FileExplorer
              files={generatedFiles}
              selectedFilePath={selectedFilePath}
              onSelectFile={handleSelectFile}
            />
          )}
        </div>

        <div className="w-full md:w-2/3 flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-700/50 bg-gray-750/50 rounded-t-xl px-2 pt-2">
            <TabButton pane="code" label="Code" />
            <TabButton pane="preview" label="Preview" />
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
        </div>
      </main>

      <footer className="bg-gray-800 bg-opacity-50 backdrop-blur-sm text-center p-4 text-sm text-gray-400 border-t border-gray-700/30">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-500">
          Powered by Gemini AI. Generated code is for demonstration purposes. Preview functionality depends on the generated code structure.
        </p>
      </footer>
    </div>
  );
};

export default App;