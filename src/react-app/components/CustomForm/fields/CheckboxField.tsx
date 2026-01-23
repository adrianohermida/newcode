import React from "react";
import type { FormField, TranslateFn } from "../types";
import type { IFormTheme } from "../defaultTheme";

interface CheckboxFieldProps {
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

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
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
  // For array fields, enum is in field.items.enum
  const options = field.items?.enum || field.enum || [];
  const optionLabels = field.items?.enumNames || field.enumNames || options;
  const optionLabelKeys = field.items?.enumNameKeys || field.enumNameKeys;
  const currentValues = Array.isArray(value) ? value : [];
  const label =
    translate?.(field.titleKey || field.title || fieldName, field.title || fieldName) ||
    field.title ||
    fieldName;
  const description = field.descriptionKey
    ? translate?.(field.descriptionKey, field.description) ?? field.description
    : field.description;

  const handleChange = (option: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...currentValues, option]);
    } else {
      onChange(currentValues.filter((v) => v !== option));
    }
  };

  return (
    <div className={theme.field.container}>
      <label className={theme.field.label}>
        {label}
        {required && <span className={theme.field.requiredIndicator}>*</span>}
      </label>
      {description && (
        <p className={theme.field.description}>{description}</p>
      )}

      <div className={theme.checkboxGroup.container}>
        {options.map((option, index) => (
          <label key={index} className={theme.checkboxGroup.optionContainer}>
            <input
              type="checkbox"
              value={option}
              checked={currentValues.includes(option)}
              onChange={(e) => handleChange(option, e.target.checked)}
              disabled={disabled}
              className={theme.checkboxGroup.checkbox}
            />
            <span className={theme.checkboxGroup.optionLabel}>
              {translate?.(
                optionLabelKeys?.[index] || optionLabels[index] || option,
                optionLabels[index] || option
              ) || optionLabels[index] || option}
            </span>
          </label>
        ))}
      </div>

      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
