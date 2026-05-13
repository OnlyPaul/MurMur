import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "secondary";
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "bg-surface-elevated border-hairline text-ink",
  secondary: "bg-surface border-hairline text-body",
  success: "bg-ok-soft border-hairline text-ok",
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] border text-[11px] font-medium leading-tight ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
