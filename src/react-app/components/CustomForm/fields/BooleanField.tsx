import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface BooleanFieldProps {
  fieldName: string;
  field: FormField;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  theme: IFormTheme;
  translate?: TranslateFn;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
  fieldName,
  field,
  value = false,
  onChange,
  error,
  disabled = false,
  required = false,
  theme,
  translate,
}) => {
  const label =
    translate?.(field.titleKey || field.title || fieldName, field.title || fieldName) ||
    field.title ||
    fieldName;
  const description = field.descriptionKey
    ? translate?.(field.descriptionKey, field.description) ?? field.description
    : field.description;

  return (
    <div className={theme.field.container}>
      <label className={theme.booleanCheckbox.container}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={theme.booleanCheckbox.input}
        />
        <span className={theme.booleanCheckbox.label}>
          {label}
          {required && <span className={theme.field.requiredIndicator}>*</span>}
        </span>
      </label>
      {description && (
        <p className={theme.booleanCheckbox.description}>{description}</p>
      )}
      {error && <p className={`${theme.field.errorMessage} ml-6`}>{error}</p>}
    </div>
  );
};
