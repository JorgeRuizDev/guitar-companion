import React from "react";
import { ColorVariant } from "../types/common";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "secondary",
  size = "md",
  isActive = false,
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none min-h-[44px] min-w-[44px] px-4 py-2.5";

  const sizeClasses = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3 font-semibold",
  };

  const variantClasses = {
    primary: isActive
      ? "bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30"
      : "bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 shadow-md shadow-amber-500/20",
    secondary: isActive
      ? "bg-slate-700 text-white border-2 border-amber-500 shadow-md"
      : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 active:bg-slate-900",
    accent: isActive
      ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30"
      : "bg-cyan-600 text-white hover:bg-cyan-500 active:bg-cyan-700 shadow-md shadow-cyan-600/20",
    ghost: isActive
      ? "bg-slate-800 text-amber-400 font-semibold"
      : "bg-transparent text-slate-300 hover:bg-slate-800/60 active:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
