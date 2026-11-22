import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-surface-ground text-center select-none">
      <div className="text-6xl font-black font-mono text-accent mb-2">404</div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h1>
      <p className="text-xs text-text-secondary max-w-sm mb-6">
        The workspace or resource you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
};
