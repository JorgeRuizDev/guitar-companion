import React from "react";
import { ColorVariant } from "../types/common";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: ColorVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "secondary",
  className = "",
}) => {
  const variantClasses = {
    primary: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    secondary: "bg-slate-800 text-slate-300 border-slate-700",
    accent: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    ghost: "bg-transparent text-slate-400 border-transparent",
    danger: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
