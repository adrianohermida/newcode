import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface EmailFieldProps {
  fieldName: string;
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  theme: IFormTheme;
  translate?: TranslateFn;
}

export const EmailField: React.FC<EmailFieldProps> = ({
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
  const label =
    translate?.(field.titleKey || field.title || fieldName, field.title || fieldName) ||
    field.title ||
    fieldName;
  const description = field.descriptionKey
    ? translate?.(field.descriptionKey, field.description) ?? field.description
    : field.description;
  const placeholder =
    translate?.(
      field.placeholderKey || field.placeholder || `placeholder.${fieldName}`,
      field.placeholder || "Enter email address"
    ) ||
    field.placeholder ||
    "Enter email address";

  return (
    <div className={theme.field.container}>
      <label htmlFor={fieldName} className={theme.field.label}>
        {label}
        {required && <span className={theme.field.requiredIndicator}>*</span>}
      </label>
      {description && (
        <p className={theme.field.description}>{description}</p>
      )}
      <input
        type="email"
        id={fieldName}
        name={fieldName}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${theme.input.base} ${
          error ? theme.input.error : theme.input.normal
        } ${disabled ? theme.input.disabled : ""}`}
        placeholder={placeholder}
      />
      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
