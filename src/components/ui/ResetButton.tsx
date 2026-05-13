import React from "react";
import ResetIcon from "../icons/ResetIcon";

interface ResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export const ResetButton: React.FC<ResetButtonProps> = React.memo(
  ({ onClick, disabled = false, className = "", ariaLabel, children }) => (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center h-7 w-7 rounded-[8px] border border-transparent bg-transparent outline-none transition-[background-color,color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] ${
        disabled
          ? "text-ash cursor-not-allowed"
          : "text-mute hover:text-ink hover:bg-surface-elevated focus-visible:border-hairline-strong cursor-pointer"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children ?? <ResetIcon />}
    </button>
  ),
);
