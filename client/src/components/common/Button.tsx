import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded';

  const sizes = {
    sm: 'px-2.5 py-1 text-xs h-7',
    md: 'px-3.5 py-1.5 text-sm h-9',
    lg: 'px-5 py-2.5 text-base h-11',
  };

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover active:translate-y-px',
    secondary: 'bg-surface-sunken text-text-primary hover:bg-surface-raised border border-border',
    outline: 'border border-border text-text-primary hover:bg-surface-raised active:translate-y-px',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-raised',
    danger: 'bg-semantic-error text-white hover:opacity-90 active:translate-y-px',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
