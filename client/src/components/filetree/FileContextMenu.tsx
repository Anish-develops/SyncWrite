import React, { useEffect, useRef } from 'react';
import { FilePlus, FolderPlus, Edit2, Trash2, Copy } from 'lucide-react';

interface FileContextMenuProps {
  x: number;
  y: number;
  path: string;
  type: 'file' | 'directory';
  onClose: () => void;
  onNewFile: (parentPath: string) => void;
  onNewFolder: (parentPath: string) => void;
  onRename: (path: string) => void;
  onDelete: (path: string) => void;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  x,
  y,
  path,
  type,
  onClose,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const targetDir = type === 'directory' ? path : path.split('/').slice(0, -1).join('/');

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-44 bg-surface-ground border border-border shadow-xl rounded py-1 text-xs select-none animate-in fade-in zoom-in-95 duration-75"
      style={{ top: y, left: x }}
    >
      <button
        onClick={() => {
          onNewFile(targetDir);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-raised text-text-primary text-left"
      >
        <FilePlus className="w-3.5 h-3.5 text-accent" />
        New File
      </button>

      <button
        onClick={() => {
          onNewFolder(targetDir);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-raised text-text-primary text-left"
      >
        <FolderPlus className="w-3.5 h-3.5 text-accent" />
        New Folder
      </button>

      <div className="h-px bg-border my-1" />

      <button
        onClick={() => {
          onRename(path);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-raised text-text-primary text-left"
      >
        <Edit2 className="w-3.5 h-3.5 text-text-secondary" />
        Rename
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(path);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-raised text-text-primary text-left"
      >
        <Copy className="w-3.5 h-3.5 text-text-secondary" />
        Copy Path
      </button>

      <div className="h-px bg-border my-1" />

      <button
        onClick={() => {
          onDelete(path);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-semantic-error/10 text-semantic-error text-left"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  );
};
