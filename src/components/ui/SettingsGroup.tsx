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
          <h2 className="t-caption-sm">{title}</h2>
          {description && <p className="t-caption mt-1">{description}</p>}
        </div>
      )}
      <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[10px] overflow-visible">
        <div className="divide-y divide-[var(--hairline)]">{children}</div>
      </div>
    </div>
  );
};
