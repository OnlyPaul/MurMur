import React from "react";
import { Loader2 } from "lucide-react";
import { SettingContainer } from "./SettingContainer";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  isUpdating?: boolean;
  label: string;
  description: string;
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  tooltipPosition?: "top" | "bottom";
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  isUpdating = false,
  label,
  description,
  descriptionMode = "tooltip",
  grouped = false,
  tooltipPosition = "top",
}) => {
  const interactionDisabled = disabled || isUpdating;
  return (
    <SettingContainer
      title={label}
      description={description}
      descriptionMode={descriptionMode}
      grouped={grouped}
      disabled={disabled}
      tooltipPosition={tooltipPosition}
    >
      <div className="relative inline-flex items-center">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={interactionDisabled}
          onClick={() => onChange(!checked)}
          className={`murmur-toggle ${checked ? "is-on" : ""} ${
            interactionDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <span className="murmur-toggle__thumb" aria-hidden="true" />
        </button>
        {isUpdating && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-3 w-3 animate-spin text-mute" />
          </span>
        )}
      </div>
    </SettingContainer>
  );
};
