import React from 'react';
import {
  FileCode2,
  FileText,
  FileJson,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  File,
} from 'lucide-react';

export function getFileIcon(name: string, isDirectory: boolean, isExpanded?: boolean) {
  if (isDirectory) {
    return isExpanded ? (
      <FolderOpen className="w-4 h-4 text-accent/80 shrink-0" />
    ) : (
      <Folder className="w-4 h-4 text-accent/80 shrink-0" />
    );
  }

  const ext = name.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'py':
      return <span className="text-xs font-mono font-bold text-amber-600 shrink-0">PY</span>;
    case 'js':
    case 'jsx':
      return <span className="text-xs font-mono font-bold text-amber-500 shrink-0">JS</span>;
    case 'ts':
    case 'tsx':
      return <span className="text-xs font-mono font-bold text-blue-600 shrink-0">TS</span>;
    case 'go':
      return <span className="text-xs font-mono font-bold text-cyan-600 shrink-0">GO</span>;
    case 'rs':
      return <span className="text-xs font-mono font-bold text-orange-700 shrink-0">RS</span>;
    case 'java':
      return <span className="text-xs font-mono font-bold text-red-600 shrink-0">JV</span>;
    case 'c':
    case 'h':
      return <span className="text-xs font-mono font-bold text-blue-500 shrink-0">C</span>;
    case 'cpp':
    case 'hpp':
      return <span className="text-xs font-mono font-bold text-blue-700 shrink-0">C+</span>;
    case 'json':
      return <FileJson className="w-4 h-4 text-amber-600 shrink-0" />;
    case 'md':
      return <FileText className="w-4 h-4 text-text-secondary shrink-0" />;
    case 'html':
      return <FileCode2 className="w-4 h-4 text-orange-600 shrink-0" />;
    case 'css':
      return <FileCode2 className="w-4 h-4 text-blue-400 shrink-0" />;
    default:
      return <File className="w-4 h-4 text-text-tertiary shrink-0" />;
  }
}
