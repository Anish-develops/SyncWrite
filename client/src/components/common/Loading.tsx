import React from 'react';

export const Loading: React.FC<{ message?: string }> = ({ message = 'Loading workspace...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-text-secondary select-none">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-medium tracking-wide uppercase">{message}</span>
    </div>
  );
};
