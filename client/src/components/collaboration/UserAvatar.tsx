import React from 'react';

interface UserAvatarProps {
  username: string;
  avatarColor: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  avatarColor,
  size = 'md',
  showTooltip = false,
  className = '',
}) => {
  const initial = (username?.[0] || 'U').toUpperCase();

  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none shadow-sm ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: avatarColor || '#C85A32' }}
      title={showTooltip ? username : undefined}
    >
      {initial}
    </div>
  );
};
