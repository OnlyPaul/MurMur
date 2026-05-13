import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "primary-soft"
    | "secondary"
    | "danger"
    | "danger-ghost"
    | "ghost";
  size?: "sm" | "md" | "lg";
}

const baseClasses =
  "murmur-btn inline-flex items-center justify-center gap-2 rounded-[8px] border font-medium tracking-[0.2px] cursor-pointer outline-none transition-[background,transform,border-color,color] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:text-ash disabled:active:scale-100";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-on-primary border-transparent hover:bg-[#f7f7f7] focus-visible:border-hairline-strong",
  "primary-soft":
    "bg-surface-elevated text-ink border-hairline hover:bg-surface-card focus-visible:border-hairline-strong",
  secondary:
    "bg-surface-elevated text-ink border-hairline hover:bg-surface-card focus-visible:border-hairline-strong",
  danger:
    "bg-surface-elevated text-err border-hairline hover:bg-surface-card hover:border-err focus-visible:border-hairline-strong",
  "danger-ghost":
    "bg-transparent text-err border-transparent hover:bg-err-soft focus-visible:border-hairline-strong",
  ghost:
    "bg-transparent text-ink border-transparent hover:bg-surface-elevated focus-visible:border-hairline-strong",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-7 px-3 text-[12px]",
  md: "h-9 px-4 text-[14px]",
  lg: "h-10 px-5 text-[14px]",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
