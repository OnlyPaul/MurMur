import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "compact";
}

export const Textarea: React.FC<TextareaProps> = ({
  className = "",
  variant = "default",
  disabled,
  ...props
}) => {
  const baseClasses =
    "bg-surface-elevated border border-hairline rounded-[8px] text-sm text-ink placeholder:text-mute outline-none resize-y transition-[background-color,border-color] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

  const interactiveClasses = disabled
    ? "text-ash cursor-not-allowed"
    : "hover:border-hairline-strong focus-visible:border-hairline-strong";

  const variantClasses = {
    default: "px-3 py-2 min-h-[100px]",
    compact: "px-2 py-1 min-h-[80px]",
  };

  return (
    <textarea
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
