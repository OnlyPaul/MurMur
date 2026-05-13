import React from "react";

interface SettingsGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-2">
      {title && (
        <div className="px-4">
          <h2 className="text-xs font-medium text-mute uppercase tracking-wide">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-mute mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="bg-canvas border border-mute/20 rounded-lg overflow-visible">
        <div className="divide-y divide-mute/20">{children}</div>
      </div>
    </div>
  );
};
