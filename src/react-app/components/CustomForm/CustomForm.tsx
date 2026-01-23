import React, { useState, useMemo, useCallback } from "react";
import type { FormSchema, FormData, FormErrors, FormProps } from "./types";
import { FormValidator } from "./validation";
import { FieldRenderer } from "./FieldRenderer";
import { mergeTheme } from "./defaultTheme";

function getDefaultFormData(schema: FormSchema, initialFormData: FormData) {
  const defaultData: FormData = {};
  Object.keys(schema.properties).forEach((key) => {
    const field = schema.properties[key];
    defaultData[key] = initialFormData[key] ?? field.default ?? "";
  });

  return defaultData;
}

/**
 * CustomForm component
 *
 * @param id - The id of the form
 * @param schema - The JSON schema for the form
 * @param formData - The initial form data
 * @param onChange - The function to call when the form data changes
 * @param onSubmit - The function to call when the form is submitted
 * @param className - The className for the form
 * @param theme - The theme for the form
 */
export const CustomForm: React.FC<FormProps> = ({
  id,
  schema,
  formData: initialFormData = {},
  onChange,
  onSubmit,
  className = "",
  theme,
  labels,
  translate,
  renderActions,
  renderField,
}) => {
  const formTheme = useMemo(() => mergeTheme(theme), [theme]);
  const t = useCallback(
    (key: string | undefined, fallback?: string) => {
      if (!translate) return key ?? fallback ?? "";
      if (!key && fallback) return translate(fallback, fallback);
      if (!key) return "";
      return translate(key, fallback ?? key);
    },
    [translate]
  );

  const filteredProperties = useMemo(() => {
    return Object.fromEntries(
      Object.entries(schema.properties).filter(
        ([_, field]: any) => !field.readOnly
      )
    );
  }, [schema.properties]);

  const filteredSchema = useMemo(
    () => ({
      ...schema,
      properties: filteredProperties,
    }),
    [schema, filteredProperties]
  );

  const [formData, setFormData] = useState<FormData>(
    getDefaultFormData(filteredSchema, initialFormData)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (fieldName: string, value: any) => {
    const newFormData = {
      ...formData,
      [fieldName]: value,
    };

    setFormData(newFormData);

    // 实时校验单个字段
    const field = filteredProperties[fieldName];
    const error = FormValidator.validateField(
      value,
      field,
      fieldName,
      filteredSchema,
      t
    );
    const newErrors = { ...errors };

    if (error) {
      newErrors[fieldName] = error;
    } else {
      delete newErrors[fieldName];
    }

    setErrors(newErrors);

    // 触发外部onChange回调
    if (onChange) {
      onChange(newFormData, newErrors);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // 提交时进行完整校验
    const allErrors = FormValidator.validateForm(filteredSchema, formData, t);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
        fetch("/api/webhooks/form-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData }),
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const defaultData: FormData = {};
    Object.keys(filteredProperties).forEach((key) => {
      const field = filteredProperties[key];
      defaultData[key] = field.default ?? "";
    });
    setFormData(defaultData);
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${formTheme.form.container} ${className}`}
      data-schema-id={id}
    >
      <div className={formTheme.form.fieldsContainer}>
        {Object.keys(filteredProperties).map((fieldName) => {
          const field = filteredProperties[fieldName];
          const isRequired =
            filteredSchema.required?.includes(fieldName) ?? false;

          const defaultRenderer = () => (
            <FieldRenderer
              key={fieldName}
              fieldName={fieldName}
              field={field}
              value={formData[fieldName]}
              onChange={(value) => handleFieldChange(fieldName, value)}
              error={errors[fieldName]}
              disabled={isSubmitting}
              required={isRequired}
              theme={formTheme}
              translate={t}
            />
          );

          if (renderField) {
            return (
              <React.Fragment key={fieldName}>
                {renderField({
                  fieldName,
                  field,
                  value: formData[fieldName],
                  onChange: (value) => handleFieldChange(fieldName, value),
                  error: errors[fieldName],
                  disabled: isSubmitting,
                  required: isRequired,
                  theme: formTheme,
                  translate: t,
                  defaultRenderer,
                })}
              </React.Fragment>
            );
          }

          return defaultRenderer();
        })}
      </div>

      {renderActions ? (
        renderActions({
          isSubmitting,
          onReset: handleReset,
          onSubmit: handleSubmit,
          theme: formTheme,
          labels: {
            submit: labels?.submit ?? t("submit", "submit") ?? "submit",
            submitting:
              labels?.submitting ??
              t("submitting", "submitting...") ??
              "submitting...",
            reset: labels?.reset ?? t("reset", "reset") ?? "reset",
          },
        })
      ) : (
        <div className={formTheme.form.buttonSection}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${formTheme.buttons.submit.base} ${
              isSubmitting ? formTheme.buttons.submit.disabled : ""
            }`}
          >
            {isSubmitting
              ? labels?.submitting ??
                t("submitting", "submitting...") ??
                "submitting..."
              : labels?.submit ?? t("submit", "submit") ?? "submit"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className={`${formTheme.buttons.reset.base} ${
              isSubmitting ? formTheme.buttons.reset.disabled : ""
            }`}
          >
            {labels?.reset ?? t("reset", "reset") ?? "reset"}
          </button>
        </div>
      )}
    </form>
  );
};
