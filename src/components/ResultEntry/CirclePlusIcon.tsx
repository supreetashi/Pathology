import * as React from "react";

// A simple circled plus icon using SVG, styled to match MUI/FiPlus style
const CirclePlusIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 20, color = "#1976d2", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CirclePlusIcon;
