import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface TextAreaFieldProps {
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

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
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
  // Extract rows and cols from field properties if available
  const rows = (field as any).rows || 4;
  const cols = (field as any).cols;
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
      field.placeholder || `Enter ${label}`
    ) ||
    field.placeholder ||
    `Enter ${label}`;

  return (
    <div className={theme.field.container}>
      <label htmlFor={fieldName} className={theme.field.label}>
        {label}
        {required && <span className={theme.field.requiredIndicator}>*</span>}
      </label>
      {description && (
        <p className={theme.field.description}>{description}</p>
      )}
      <textarea
        id={fieldName}
        name={fieldName}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        cols={cols}
        className={`${theme.textarea.base} ${
          error ? theme.textarea.error : theme.textarea.normal
        } ${disabled ? theme.textarea.disabled : ""}`}
        placeholder={placeholder}
        minLength={field.minLength}
        maxLength={field.maxLength}
      />
      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
