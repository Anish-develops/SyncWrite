import React from 'react';
import { FileNode } from '@syncwrite/shared';
import { useFileTreeStore } from '../../store/fileTreeStore';
import { useEditorStore } from '../../store/editorStore';
import { getFileIcon } from '../../utils/fileIcons';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface FileTreeNodeProps {
  node: FileNode;
  level?: number;
  onContextMenu: (e: React.MouseEvent, node: FileNode) => void;
}

export const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  level = 0,
  onContextMenu,
}) => {
  const { expandedFolders, toggleFolder } = useFileTreeStore();
  const { openFile, activeTabPath } = useEditorStore();

  const isDirectory = node.type === 'directory';
  const isExpanded = expandedFolders.has(node.path);
  const isActive = activeTabPath === node.path;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) {
      toggleFolder(node.path);
    } else {
      openFile(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, node);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`flex items-center gap-1.5 h-7 px-2 cursor-pointer select-none transition-colors border-l-2 ${
          isActive
            ? 'bg-surface-raised border-accent font-medium text-text-primary'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised/70'
        }`}
        style={{ paddingLeft: `${Math.max(level * 14 + 6, 6)}px` }}
      >
        {isDirectory ? (
          <span className="w-3.5 h-3.5 flex items-center justify-center text-text-tertiary">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        ) : (
          <span className="w-3.5" />
        )}

        {getFileIcon(node.name, isDirectory, isExpanded)}
        <span className="text-xs truncate">{node.name}</span>
      </div>

      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};
