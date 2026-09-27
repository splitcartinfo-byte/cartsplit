import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* SVG Icon Mark */}
      <div className={`${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="20" cy="20" r="18" fill="url(#splitcart-grad)" />
          <path
            d="M13 14C13 12.8954 13.8954 12 15 12H25C26.1046 12 27 12.8954 27 14V26C27 27.1046 26.1046 28 25 28H15C13.8954 28 13 27.1046 13 26V14Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M20 10V30" stroke="white" strokeWidth="2.5" strokeDasharray="2 2" />
          <circle cx="15.5" cy="20" r="2" fill="white" />
          <circle cx="24.5" cy="20" r="2" fill="white" />
          <defs>
            <linearGradient id="splitcart-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`${textSizes[size]} font-extrabold tracking-tight text-slate-900 font-sans`}>
          Split<span className="text-blue-600">Cart</span>
        </span>
      )}
    </div>
  );
};
