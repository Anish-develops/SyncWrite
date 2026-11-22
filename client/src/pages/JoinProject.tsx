import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectAPI } from '../api/projects';
import { Loading } from '../components/common/Loading';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

export const JoinProject: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteCode) return;

    ProjectAPI.join(inviteCode)
      .then((res) => {
        toast.success('Successfully joined project!');
        navigate(`/project/${res.projectId}`);
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          // Already a member - fetch or redirect
          toast('Already a member of this project');
          navigate('/dashboard');
        } else {
          setError(err.response?.data?.error?.message || 'Invalid or expired invite code');
        }
      });
  }, [inviteCode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-surface-ground text-center">
        <h2 className="text-xl font-bold text-semantic-error mb-2">Unable to Join Project</h2>
        <p className="text-xs text-text-secondary max-w-sm mb-6">{error}</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-ground">
      <Loading message="Joining workspace..." />
    </div>
  );
};
