import React from 'react';

interface SiteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showFallbackIcon?: boolean;
}

const sizeMap = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-14 w-auto',
};

export const SiteLogo: React.FC<SiteLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const imgFilter = variant === 'dark' ? 'brightness-0 invert' : '';

  return (
    <img
      src="/logo.png"
      alt="Site Logo"
      className={`${sizeMap[size]} object-contain ${imgFilter} ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};

export default SiteLogo;
