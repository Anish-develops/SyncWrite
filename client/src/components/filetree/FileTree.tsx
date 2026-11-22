import React, { useState } from 'react';
import { useFileTreeStore } from '../../store/fileTreeStore';
import { useProjectStore } from '../../store/projectStore';
import { FileTreeNode } from './FileTreeNode';
import { FileContextMenu } from './FileContextMenu';
import { NewFileDialog } from './NewFileDialog';
import { FileNode } from '@syncwrite/shared';
import { FileAPI } from '../../api/files';
import { FilePlus, FolderPlus, RefreshCw, FolderTree } from 'lucide-react';
import toast from 'react-hot-toast';

export const FileTree: React.FC = () => {
  const { tree, loadTree } = useFileTreeStore();
  const { currentProject } = useProjectStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    path: string;
    type: 'file' | 'directory';
  } | null>(null);

  const [newDialog, setNewDialog] = useState<{
    isOpen: boolean;
    type: 'file' | 'directory';
    parentPath: string;
  }>({
    isOpen: false,
    type: 'file',
    parentPath: '',
  });

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      path: node.path,
      type: node.type,
    });
  };

  const handleCreate = async (path: string, type: 'file' | 'directory') => {
    if (!currentProject) return;
    try {
      await FileAPI.createFile(currentProject.id, { path, type });
      toast.success(`${type === 'file' ? 'File' : 'Folder'} created`);
      loadTree(currentProject.id);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Creation failed');
    }
  };

  const handleDelete = async (path: string) => {
    if (!currentProject) return;
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;

    try {
      await FileAPI.deleteFile(currentProject.id, path);
      toast.success('Deleted successfully');
      loadTree(currentProject.id);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Delete failed');
    }
  };

  const handleRename = async (path: string) => {
    if (!currentProject) return;
    const newName = prompt('Enter new name:', path.split('/').pop());
    if (!newName || newName.trim() === '') return;

    const parts = path.split('/');
    parts[parts.length - 1] = newName.trim();
    const newPath = parts.join('/');

    try {
      await FileAPI.renameFile(currentProject.id, path, { newPath });
      toast.success('Renamed successfully');
      loadTree(currentProject.id);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Rename failed');
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-surface-sunken border-r border-border select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, path: '', type: 'directory' });
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-raised">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <FolderTree className="w-3.5 h-3.5 text-accent" />
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setNewDialog({ isOpen: true, type: 'file', parentPath: '' })}
            className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-sunken transition-colors"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setNewDialog({ isOpen: true, type: 'directory', parentPath: '' })}
            className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-sunken transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => currentProject && loadTree(currentProject.id)}
            className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-sunken transition-colors"
            title="Refresh Files"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-tertiary italic">
            No files in workspace. Click + to create one.
          </div>
        ) : (
          tree.map((node) => (
            <FileTreeNode key={node.path} node={node} onContextMenu={handleContextMenu} />
          ))
        )}
      </div>

      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          path={contextMenu.path}
          type={contextMenu.type}
          onClose={() => setContextMenu(null)}
          onNewFile={(parent) => setNewDialog({ isOpen: true, type: 'file', parentPath: parent })}
          onNewFolder={(parent) =>
            setNewDialog({ isOpen: true, type: 'directory', parentPath: parent })
          }
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}

      <NewFileDialog
        isOpen={newDialog.isOpen}
        onClose={() => setNewDialog({ ...newDialog, isOpen: false })}
        type={newDialog.type}
        parentPath={newDialog.parentPath}
        onSubmit={handleCreate}
      />
    </div>
  );
};
