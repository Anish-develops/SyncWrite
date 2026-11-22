import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface NewFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (path: string, type: 'file' | 'directory') => void;
  type: 'file' | 'directory';
  parentPath: string;
}

export const NewFileDialog: React.FC<NewFileDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  parentPath,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const fullPath = parentPath ? `${parentPath}/${name.trim()}` : name.trim();
    onSubmit(fullPath, type);
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'file' ? 'Create New File' : 'Create New Folder'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={type === 'file' ? 'File Name' : 'Folder Name'}
          placeholder={type === 'file' ? 'e.g. main.py, utils.js' : 'e.g. src, models'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        {parentPath && (
          <span className="text-[11px] text-text-tertiary font-mono">
            Location: /{parentPath}/
          </span>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={!name.trim()}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
