import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:ring-blue-500",
    secondary:
      "bg-[var(--primary-light)] text-blue-600 hover:bg-blue-200/20 border border-blue-100 dark:border-blue-900/30 focus:ring-blue-500",
    outline:
      "bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-main)] hover:border-[var(--border-hover)] shadow-sm focus:ring-[var(--border)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] focus:ring-[var(--border)]",
    danger:
      "bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100/50 border border-rose-100 dark:border-rose-500/20 focus:ring-rose-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? "w-full" : ""} 
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin" size={size === "sm" ? 14 : 18} />
      )}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
