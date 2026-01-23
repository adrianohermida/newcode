import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface NumberFieldProps {
  fieldName: string;
  field: FormField;
  value: number | string;
  onChange: (value: number | string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  theme: IFormTheme;
  translate?: TranslateFn;
}

export const NumberField: React.FC<NumberFieldProps> = ({
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange("");
    } else {
      const num = Number(val);
      onChange(isNaN(num) ? val : num);
    }
  };
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
      <input
        type="number"
        id={fieldName}
        name={fieldName}
        value={value === undefined || value === null ? "" : value}
        onChange={handleChange}
        disabled={disabled}
        min={field.minimum}
        max={field.maximum}
        step={field.type === "integer" ? 1 : "any"}
        className={`${theme.input.base} ${
          error ? theme.input.error : theme.input.normal
        } ${disabled ? theme.input.disabled : ""}`}
        placeholder={placeholder}
      />
      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
