import { FieldData } from '../types';

export const validateField = (value: any, field: FieldData): string | null => {
  if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${field.label} is required`;
  }

  if (typeof value === 'string' && field.validation) {
    const { minLength, maxLength, pattern } = field.validation;

    if (minLength && value.length < minLength) {
      return `${field.label} must be at least ${minLength} characters`;
    }

    if (maxLength && value.length > maxLength) {
      return `${field.label} must not exceed ${maxLength} characters`;
    }

    if (pattern && !new RegExp(pattern).test(value)) {
      return `${field.label} format is invalid`;
    }
  }

  return null;
};

export const validateForm = (formData: Record<string, any>, fields: FieldData[]): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const error = validateField(formData[field.id], field);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
};

export const isValidApiKey = (apiKey: string): boolean => {
  return apiKey.trim().length > 0 && apiKey.startsWith('sk-');
}; 