import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface DateFieldProps {
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

export const DateField: React.FC<DateFieldProps> = ({
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
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };
  const label =
    translate?.(field.titleKey || field.title || fieldName, field.title || fieldName) ||
    field.title ||
    fieldName;
  const description = field.descriptionKey
    ? translate?.(field.descriptionKey, field.description) ?? field.description
    : field.description;

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
        type="date"
        id={fieldName}
        name={fieldName}
        value={value ? formatDate(value) : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${theme.dateInput.base} ${
          error ? theme.dateInput.error : theme.dateInput.normal
        } ${disabled ? theme.dateInput.disabled : ""}`}
      />
      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
