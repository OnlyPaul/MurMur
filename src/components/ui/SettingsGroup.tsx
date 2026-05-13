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
          <h2 className="text-xs font-medium text-mute uppercase tracking-[0.4px]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-mute mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="bg-surface border border-hairline rounded-[10px] overflow-visible">
        <div className="divide-y divide-hairline-soft">{children}</div>
      </div>
    </div>
  );
};
