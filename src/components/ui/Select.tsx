import React from "react";
import SelectComponent from "react-select";
import CreatableSelect from "react-select/creatable";
import type {
  ActionMeta,
  Props as ReactSelectProps,
  SingleValue,
  StylesConfig,
} from "react-select";

export type SelectOption = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

type BaseProps = {
  value: string | null;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  onChange: (value: string | null, action: ActionMeta<SelectOption>) => void;
  onBlur?: () => void;
  className?: string;
  formatCreateLabel?: (input: string) => string;
};

type CreatableProps = {
  isCreatable: true;
  onCreateOption: (value: string) => void;
};

type NonCreatableProps = {
  isCreatable?: false;
  onCreateOption?: never;
};

export type SelectProps = BaseProps & (CreatableProps | NonCreatableProps);

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: state.isFocused ? "var(--hairline-strong)" : "var(--hairline)",
    boxShadow: "none",
    backgroundColor: state.isFocused
      ? "var(--surface-card)"
      : "var(--surface-elevated)",
    fontSize: 14,
    color: "var(--ink)",
    transition:
      "background-color 120ms cubic-bezier(0.4, 0, 0.2, 1), border-color 120ms cubic-bezier(0.4, 0, 0.2, 1)",
    ":hover": {
      backgroundColor: "var(--surface-card)",
      borderColor: "var(--hairline-strong)",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    paddingInline: 12,
    paddingBlock: 4,
  }),
  input: (base) => ({
    ...base,
    color: "var(--ink)",
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--ink)",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--mute)",
    paddingInline: 6,
    ":hover": { color: "var(--ink)" },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--mute)",
    paddingInline: 6,
    ":hover": { color: "var(--ink)" },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 30,
    marginTop: 6,
    backgroundColor: "var(--surface)",
    color: "var(--ink)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    boxShadow: "none",
    overflow: "hidden",
  }),
  menuList: (base) => ({
    ...base,
    paddingTop: 4,
    paddingBottom: 4,
  }),
  option: (base, state) => ({
    ...base,
    minHeight: 32,
    paddingInline: 12,
    paddingBlock: 6,
    backgroundColor:
      state.isSelected || state.isFocused
        ? "var(--surface-elevated)"
        : "transparent",
    color: "var(--ink)",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    fontSize: 14,
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--mute)",
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "var(--mute)",
  }),
  loadingMessage: (base) => ({
    ...base,
    color: "var(--mute)",
  }),
};

export const Select: React.FC<SelectProps> = React.memo(
  ({
    value,
    options,
    placeholder,
    disabled,
    isLoading,
    isClearable = true,
    onChange,
    onBlur,
    className = "",
    isCreatable,
    formatCreateLabel,
    onCreateOption,
  }) => {
    const selectValue = React.useMemo(() => {
      if (!value) return null;
      const existing = options.find((option) => option.value === value);
      if (existing) return existing;
      return { value, label: value, isDisabled: false };
    }, [value, options]);

    const handleChange = (
      option: SingleValue<SelectOption>,
      action: ActionMeta<SelectOption>,
    ) => {
      onChange(option?.value ?? null, action);
    };

    const sharedProps: Partial<ReactSelectProps<SelectOption, false>> = {
      className,
      classNamePrefix: "app-select",
      value: selectValue,
      options,
      onChange: handleChange,
      placeholder,
      isDisabled: disabled,
      isLoading,
      onBlur,
      isClearable,
      styles: selectStyles,
    };

    if (isCreatable) {
      return (
        <CreatableSelect<SelectOption, false>
          {...sharedProps}
          onCreateOption={onCreateOption}
          formatCreateLabel={formatCreateLabel}
        />
      );
    }

    return <SelectComponent<SelectOption, false> {...sharedProps} />;
  },
);

Select.displayName = "Select";
