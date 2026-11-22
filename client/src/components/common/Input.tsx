import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 text-sm bg-surface-raised border border-border text-text-primary rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-text-tertiary transition-colors ${
          error ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-semantic-error">{error}</span>}
    </div>
  );
};
