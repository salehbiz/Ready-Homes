import React from 'react';

type LogoProps = {
  className?: string;
  color?: string;
};

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto", color = "currentColor" }) => (
  <svg
    viewBox="0 0 170 60"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
  >
    {/* Geometric flooring plank icon */}
    <g fill={color}>
      <rect x="5" y="10" width="12" height="40" rx="1.5" />
      <rect x="21" y="10" width="12" height="24" rx="1.5" opacity="0.75" />
      <rect x="21" y="38" width="12" height="12" rx="1.5" opacity="0.45" />
      
      {/* Brand typography */}
      <text
        x="45"
        y="32"
        fontSize="20"
        fontWeight="800"
        fontFamily="Inter Tight, Inter, sans-serif"
        letterSpacing="-0.03em"
      >
        FLOORING
      </text>
      <text
        x="45"
        y="48"
        fontSize="11.5"
        fontWeight="500"
        fontFamily="Inter Tight, Inter, sans-serif"
        letterSpacing="0.32em"
        opacity="0.75"
      >
        STUDIO
      </text>
    </g>
  </svg>
);
