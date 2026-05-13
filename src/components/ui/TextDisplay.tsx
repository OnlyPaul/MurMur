import React, { useState } from "react";
import { SettingContainer } from "./SettingContainer";

interface TextDisplayProps {
  label: string;
  description: string;
  value: string;
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  placeholder?: string;
  copyable?: boolean;
  monospace?: boolean;
  onCopy?: (value: string) => void;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  label,
  description,
  value,
  descriptionMode = "tooltip",
  grouped = false,
  placeholder = "Not available",
  copyable = false,
  monospace = false,
  onCopy,
}) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    if (!value || !copyable) return;

    try {
      await navigator.clipboard.writeText(value);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1500);
      if (onCopy) {
        onCopy(value);
      }
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const displayValue = value || placeholder;
  const textClasses = monospace ? "font-mono break-all" : "break-words";

  return (
    <SettingContainer
      title={label}
      description={description}
      descriptionMode={descriptionMode}
      grouped={grouped}
      layout="stacked"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div
            className={`px-3 min-h-8 flex items-center bg-surface-elevated border border-hairline rounded-[8px] text-xs ${textClasses} ${value ? "text-ink" : "text-mute"}`}
          >
            {displayValue}
          </div>
        </div>
        {copyable && value && (
          <button
            onClick={handleCopy}
            className={`murmur-btn flex items-center justify-center h-8 px-3 text-xs border rounded-[8px] flex-shrink-0 cursor-pointer transition-[background,color,border-color] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] ${
              showCopied
                ? "bg-surface-elevated border-hairline text-ok"
                : "bg-surface-elevated border-hairline text-ink hover:bg-surface-card hover:border-hairline-strong"
            }`}
            title="Copy to clipboard"
          >
            {showCopied ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              "Copy"
            )}
          </button>
        )}
      </div>
    </SettingContainer>
  );
};
