import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

interface SettingContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  layout?: "horizontal" | "stacked";
  disabled?: boolean;
  tooltipPosition?: "top" | "bottom";
}

const titleClass = (disabled: boolean) =>
  `text-sm font-medium ${disabled ? "text-ash" : "text-ink"}`;

const descriptionClass = (disabled: boolean) =>
  `text-sm ${disabled ? "text-ash" : "text-mute"}`;

export const SettingContainer: React.FC<SettingContainerProps> = ({
  title,
  description,
  children,
  descriptionMode = "tooltip",
  grouped = false,
  layout = "horizontal",
  disabled = false,
  tooltipPosition = "top",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTooltip]);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const baseContainer = grouped
    ? "px-4 py-3"
    : "px-4 py-3 rounded-[10px] border border-hairline bg-surface";

  const infoIcon = (
    <div
      ref={tooltipRef}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={toggleTooltip}
    >
      <svg
        className="w-4 h-4 text-mute cursor-help hover:text-ink transition-colors duration-[120ms] select-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-label="More information"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTooltip();
          }
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {showTooltip && (
        <Tooltip targetRef={tooltipRef} position={tooltipPosition}>
          <p className="text-[13px] text-center leading-relaxed">
            {description}
          </p>
        </Tooltip>
      )}
    </div>
  );

  if (layout === "stacked") {
    if (descriptionMode === "tooltip") {
      return (
        <div className={baseContainer}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className={titleClass(disabled)}>{title}</h3>
            {infoIcon}
          </div>
          <div className="w-full">{children}</div>
        </div>
      );
    }

    return (
      <div className={baseContainer}>
        <div className="mb-2">
          <h3 className={titleClass(disabled)}>{title}</h3>
          <p className={descriptionClass(disabled)}>{description}</p>
        </div>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  const horizontalContainer = `flex items-center justify-between gap-4 ${baseContainer}`;

  if (descriptionMode === "tooltip") {
    return (
      <div className={horizontalContainer}>
        <div className="max-w-2/3">
          <div className="flex items-center gap-2">
            <h3 className={titleClass(disabled)}>{title}</h3>
            {infoIcon}
          </div>
        </div>
        <div className="relative">{children}</div>
      </div>
    );
  }

  return (
    <div className={horizontalContainer}>
      <div className="max-w-2/3">
        <h3 className={titleClass(disabled)}>{title}</h3>
        <p className={descriptionClass(disabled)}>{description}</p>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};
