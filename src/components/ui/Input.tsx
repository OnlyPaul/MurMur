import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "compact";
}

export const Input: React.FC<InputProps> = ({
  className = "",
  variant = "default",
  disabled,
  ...props
}) => {
  const baseClasses =
    "bg-surface-elevated border border-hairline rounded-[8px] text-sm text-ink placeholder:text-mute outline-none transition-[background-color,border-color] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

  const interactiveClasses = disabled
    ? "text-ash cursor-not-allowed"
    : "hover:border-hairline-strong focus-visible:border-hairline-strong";

  const variantClasses = {
    default: "h-9 px-3",
    compact: "h-7 px-2",
  } as const;

  return (
    <input
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
