import React from "react";

export interface ProgressData {
  id: string;
  percentage: number;
  speed?: number;
  label?: string;
}

interface ProgressBarProps {
  progress: ProgressData[];
  className?: string;
  size?: "small" | "medium" | "large";
  showSpeed?: boolean;
  showLabel?: boolean;
}

const sizeClasses = {
  small: "w-16 h-[3px]",
  medium: "w-full h-[3px]",
  large: "w-full h-1",
} as const;

const trackClasses =
  "[&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[var(--hairline)] [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[var(--ink)] [&::-webkit-progress-value]:transition-all [&::-moz-progress-bar]:bg-[var(--ink)]";

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = "",
  size = "medium",
  showSpeed = false,
  showLabel = false,
}) => {
  if (progress.length === 0) {
    return null;
  }

  if (progress.length === 1) {
    const item = progress[0];
    const percentage = Math.max(0, Math.min(100, item.percentage));

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <progress
          value={percentage}
          max={100}
          className={`${sizeClasses[size]} ${trackClasses}`}
        />
        {(showSpeed || showLabel) && (
          <div className="text-xs text-mute tabular-nums min-w-fit">
            {showLabel && item.label && (
              <span className="me-2">{item.label}</span>
            )}
            {showSpeed && item.speed !== undefined && item.speed > 0 ? (
              // eslint-disable-next-line i18next/no-literal-string
              <span>{item.speed.toFixed(1)}MB/s</span>
            ) : showSpeed ? (
              <span>Downloading...</span>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1">
        {progress.map((item) => {
          const percentage = Math.max(0, Math.min(100, item.percentage));
          return (
            <progress
              key={item.id}
              value={percentage}
              max={100}
              title={item.label || `${percentage}%`}
              className={`w-3 ${trackClasses}`}
            />
          );
        })}
      </div>
      <div className="text-xs text-mute min-w-fit">
        {progress.length} downloading...
      </div>
    </div>
  );
};

export default ProgressBar;
