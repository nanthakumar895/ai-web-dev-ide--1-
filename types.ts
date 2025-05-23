
export interface GeneratedFile {
  path: string;
  content: string;
}

export interface ProjectData {
  files: GeneratedFile[];
}

// Used for parsed file structure in FileExplorer
export interface FileSystemNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileSystemNode[];
}
