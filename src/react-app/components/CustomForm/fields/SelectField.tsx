import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface SelectFieldProps {
  fieldName: string;
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  theme: IFormTheme;
  translate?: TranslateFn;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  fieldName,
  field,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  theme,
  translate,
}) => {
  const options = field.enum || [];
  const optionLabels = field.enumNames || options;
  const optionLabelKeys = field.enumNameKeys;
  const label =
    translate?.(field.titleKey || field.title || fieldName, field.title || fieldName) ||
    field.title ||
    fieldName;
  const description = field.descriptionKey
    ? translate?.(field.descriptionKey, field.description) ?? field.description
    : field.description;

  return (
    <div className={theme.field.container}>
      <label className={theme.field.label}>
        {label}
        {required && <span className={theme.field.requiredIndicator}>*</span>}
      </label>
      {description && (
        <p className={theme.field.description}>{description}</p>
      )}

      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${theme.select.base} ${
            error ? theme.select.error : theme.select.normal
          } ${disabled ? theme.select.disabled : ""}`}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {translate?.(
                optionLabelKeys?.[index] || optionLabels[index] || option,
                optionLabels[index] || option
              ) || optionLabels[index] || option}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
