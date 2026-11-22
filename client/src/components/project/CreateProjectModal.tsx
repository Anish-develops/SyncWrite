import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TemplateSelector } from './TemplateSelector';
import { SupportedLanguage } from '@syncwrite/shared';
import { ProjectAPI } from '../../api/projects';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('python-flask');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsLoading(true);
    try {
      const project = await ProjectAPI.create({
        name: name.trim(),
        language,
        description: description.trim(),
        template: selectedTemplate,
      });

      toast.success('Project created successfully');
      onCreated?.();
      onClose();
      navigate(`/project/${project.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (templateId: string | null, lang: SupportedLanguage) => {
    setSelectedTemplate(templateId);
    setLanguage(lang);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <Input
          label="Project Name"
          placeholder="e.g. My Collaborative App"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />

        <Input
          label="Description (Optional)"
          placeholder="What are you building together?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelect={handleSelectTemplate}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
