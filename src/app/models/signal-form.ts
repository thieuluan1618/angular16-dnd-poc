import { signal, computed, WritableSignal } from '@angular/core';

/**
 * Signal-based form field interface
 */
export interface SignalFormField<T = any> {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  value: WritableSignal<T>;
  required: boolean;
  disabled: WritableSignal<boolean>;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  validators?: SignalValidator<T>[];
}

/**
 * Signal validator interface
 */
export interface SignalValidator<T = any> {
  name: string;
  validate: (value: T) => ValidationResult;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Signal form interface
 */
export interface SignalForm<T = any> {
  fields: SignalFormField[];
  values: WritableSignal<Partial<T>>;
  errors: WritableSignal<Record<string, string[]>>;
  isValid: WritableSignal<boolean>;
  isDirty: WritableSignal<boolean>;
  isSubmitting: WritableSignal<boolean>;
}

/**
 * User profile data model
 */
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  bio: string;
  newsletter: boolean;
  country: string;
  experience: string;
}

/**
 * Contact form data model
 */
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  attachment: boolean;
}