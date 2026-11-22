import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@syncwrite/shared';
import { ProjectAPI } from '../api/projects';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { CreateProjectModal } from '../components/project/CreateProjectModal';
import { UserAvatar } from '../components/collaboration/UserAvatar';
import { Button } from '../components/common/Button';
import { formatRelativeTime } from '../utils/formatters';
import { Plus, FolderGit2, Trash2, Moon, Sun, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useSettingsStore();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await ProjectAPI.list();
      setProjects(data.projects);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project? All files will be removed.')) return;

    try {
      await ProjectAPI.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-surface-ground text-text-primary flex flex-col select-none overflow-y-auto">
      {/* Dashboard Header */}
      <header className="h-14 border-b border-border px-8 flex items-center justify-between bg-surface-raised">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center text-white font-bold font-mono text-xs">
            SW
          </div>
          <span className="font-bold text-base tracking-tight">SyncWrite</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {user && (
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <UserAvatar username={user.username} avatarColor={user.avatarColor} size="sm" />
              <span className="text-xs font-semibold">{user.username}</span>
              <button
                onClick={logout}
                className="p-1 text-text-tertiary hover:text-semantic-error ml-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content Area: Table / List Layout */}
      <main className="max-w-5xl mx-auto w-full px-8 py-10 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Projects</h1>
            <p className="text-xs text-text-secondary">Workspaces you own or collaborate in.</p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </div>

        {/* Project Table / List */}
        <div className="bg-surface-raised border border-border rounded overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-text-tertiary">
              Loading your workspaces...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <FolderGit2 className="w-8 h-8 text-text-tertiary" />
              <div className="text-sm font-semibold text-text-secondary">No projects yet</div>
              <p className="text-xs text-text-tertiary max-w-xs">
                Create a project from scratch or bootstrap using any of our 9 starter templates.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create your first project →
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="flex items-center justify-between px-5 py-4 hover:bg-surface-sunken/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-surface-sunken border border-border flex items-center justify-center text-accent font-bold font-mono text-xs shrink-0">
                      {project.language.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                          {project.name}
                        </span>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-surface-sunken text-accent font-semibold rounded">
                          {project.language}
                        </span>
                        {project.role === 'owner' && (
                          <span className="text-[10px] text-text-tertiary italic">Owner</span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary truncate max-w-md mt-0.5">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-xs text-text-tertiary">
                      {formatRelativeTime(project.updatedAt)}
                    </span>

                    {project.role === 'owner' && (
                      <button
                        onClick={(e) => handleDelete(e, project.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-text-tertiary hover:text-semantic-error rounded hover:bg-surface-raised transition-all"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchProjects}
      />
    </div>
  );
};
