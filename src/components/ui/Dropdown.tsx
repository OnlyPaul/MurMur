import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  className?: string;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onRefresh?: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  className = "",
  placeholder = "Select an option...",
  disabled = false,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && onRefresh) onRefresh();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`h-9 px-3 text-sm bg-surface-elevated border rounded-[8px] min-w-[200px] text-start flex items-center justify-between gap-2 outline-none transition-[background-color,border-color] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          disabled
            ? "border-hairline text-ash cursor-not-allowed"
            : "border-hairline text-ink cursor-pointer hover:bg-surface-card hover:border-hairline-strong focus-visible:border-hairline-strong"
        }`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 text-mute transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-hairline rounded-[10px] z-50 max-h-60 overflow-y-auto py-1">
          {options.length === 0 ? (
            <div className="px-3 h-8 flex items-center text-sm text-mute">
              {t("common.noOptionsFound")}
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-full h-8 px-3 text-sm text-start flex items-center transition-colors duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  option.disabled
                    ? "text-ash cursor-not-allowed"
                    : "text-ink hover:bg-surface-elevated cursor-pointer"
                } ${
                  selectedValue === option.value && !option.disabled
                    ? "bg-surface-elevated"
                    : ""
                }`}
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
              >
                <span className="truncate">{option.label}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
