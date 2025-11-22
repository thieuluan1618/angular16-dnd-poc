import { Injectable, signal, computed } from '@angular/core';
import {
  SignalForm,
  SignalFormField,
  SignalValidator,
  ValidationResult,
  UserProfile,
  ContactForm
} from '../models/signal-form';

@Injectable({
  providedIn: 'root'
})
export class SignalFormService {

  /**
   * Built-in validators
   */
  static validators = {
    required: (message = 'This field is required'): SignalValidator => ({
      name: 'required',
      validate: (value: any): ValidationResult => ({
        isValid: value !== null && value !== undefined && value !== '',
        message: message
      })
    }),

    email: (message = 'Please enter a valid email'): SignalValidator<string> => ({
      name: 'email',
      validate: (value: string): ValidationResult => ({
        isValid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: message
      })
    }),

    minLength: (min: number, message?: string): SignalValidator<string> => ({
      name: 'minLength',
      validate: (value: string): ValidationResult => ({
        isValid: !value || value.length >= min,
        message: message || `Minimum ${min} characters required`
      })
    }),

    maxLength: (max: number, message?: string): SignalValidator<string> => ({
      name: 'maxLength',
      validate: (value: string): ValidationResult => ({
        isValid: !value || value.length <= max,
        message: message || `Maximum ${max} characters allowed`
      })
    }),

    min: (min: number, message?: string): SignalValidator<number> => ({
      name: 'min',
      validate: (value: number): ValidationResult => ({
        isValid: value === null || value === undefined || value >= min,
        message: message || `Value must be at least ${min}`
      })
    }),

    max: (max: number, message?: string): SignalValidator<number> => ({
      name: 'max',
      validate: (value: number): ValidationResult => ({
        isValid: value === null || value === undefined || value <= max,
        message: message || `Value must be at most ${max}`
      })
    })
  };

  /**
   * Create a signal-based form
   */
  createForm<T>(fields: SignalFormField[]): SignalForm<T> {
    const values = signal<Partial<T>>({});
    const errors = signal<Record<string, string[]>>({});
    const isValid = signal(true);
    const isDirty = signal(false);
    const isSubmitting = signal(false);

    // Computed validation
    const validateField = (field: SignalFormField): string[] => {
      const fieldErrors: string[] = [];
      const value = field.value();

      if (field.validators) {
        field.validators.forEach(validator => {
          const result = validator.validate(value);
          if (!result.isValid && result.message) {
            fieldErrors.push(result.message);
          }
        });
      }

      return fieldErrors;
    };

    const validateAll = () => {
      const newErrors: Record<string, string[]> = {};
      let formIsValid = true;

      fields.forEach(field => {
        const fieldErrors = validateField(field);
        if (fieldErrors.length > 0) {
          newErrors[field.id] = fieldErrors;
          formIsValid = false;
        }
      });

      errors.set(newErrors);
      isValid.set(formIsValid);
    };

    // Initialize form values and validation
    const initializeForm = () => {
      const initialValues: Partial<T> = {};
      fields.forEach(field => {
        initialValues[field.id as keyof T] = field.value();
      });
      values.set(initialValues);
      validateAll();
    };

    initializeForm();

    return {
      fields,
      values,
      errors,
      isValid,
      isDirty,
      isSubmitting
    };
  }

  /**
   * Create user profile form
   */
  createUserProfileForm(): SignalForm<UserProfile> {
    const fields: SignalFormField[] = [
      {
        id: 'firstName',
        label: 'First Name',
        type: 'text',
        value: signal(''),
        required: true,
        disabled: signal(false),
        placeholder: 'Enter your first name',
        validators: [
          SignalFormService.validators.required(),
          SignalFormService.validators.minLength(2)
        ]
      },
      {
        id: 'lastName',
        label: 'Last Name',
        type: 'text',
        value: signal(''),
        required: true,
        disabled: signal(false),
        placeholder: 'Enter your last name',
        validators: [
          SignalFormService.validators.required()
        ]
      },
      {
        id: 'email',
        label: 'Email',
        type: 'email',
        value: signal(''),
        required: true,
        disabled: signal(false),
        placeholder: 'your.email@example.com',
        validators: [
          SignalFormService.validators.required(),
          SignalFormService.validators.email()
        ]
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        value: signal(25),
        required: true,
        disabled: signal(false),
        placeholder: 'Enter your age',
        validators: [
          SignalFormService.validators.required(),
          SignalFormService.validators.min(18),
          SignalFormService.validators.max(120)
        ]
      },
      {
        id: 'bio',
        label: 'Bio',
        type: 'textarea',
        value: signal(''),
        required: false,
        disabled: signal(false),
        placeholder: 'Tell us about yourself...',
        validators: [
          SignalFormService.validators.maxLength(500)
        ]
      },
      {
        id: 'newsletter',
        label: 'Subscribe to newsletter',
        type: 'checkbox',
        value: signal(true),
        required: false,
        disabled: signal(false)
      },
      {
        id: 'country',
        label: 'Country',
        type: 'select',
        value: signal('us'),
        required: true,
        disabled: signal(false),
        options: [
          { label: 'United States', value: 'us' },
          { label: 'Canada', value: 'ca' },
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Australia', value: 'au' },
          { label: 'Germany', value: 'de' },
          { label: 'France', value: 'fr' }
        ]
      },
      {
        id: 'experience',
        label: 'Experience Level',
        type: 'select',
        value: signal('beginner'),
        required: true,
        disabled: signal(false),
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
          { label: 'Expert', value: 'expert' }
        ]
      }
    ];

    return this.createForm<UserProfile>(fields);
  }

  /**
   * Create contact form
   */
  createContactForm(): SignalForm<ContactForm> {
    const fields: SignalFormField[] = [
      {
        id: 'name',
        label: 'Your Name',
        type: 'text',
        value: signal(''),
        required: true,
        disabled: signal(false),
        placeholder: 'John Doe',
        validators: [
          SignalFormService.validators.required(),
          SignalFormService.validators.minLength(2)
        ]
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        value: signal(''),
        required: true,
        disabled: signal(false),
        placeholder: 'john@example.com',
        validators: [
          SignalFormService.validators.required(),
          SignalFormService.validators.email()
        ]
      },
      {
        id: 'subject',
        label: 'Subject',
        type: 'select',
        value: signal('general'),
        required: true,
        disabled: signal(false),
        options: [
          { label: 'General Inquiry', value: 'general' },
          { label: 'Technical Support', value: 'support' },
          { label: 'Feature Request', value: 'feature' },
          { label: 'Bug Report', value: 'bug' },
          { label: 'Partnership', value: 'partnership' }
        ]
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        value: signal('medium'),
        required: true,
        disabled: signal(false),
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' }
        ]
      },
      {
        id: 'message',
        label: 'Message',
        type: 'textarea',
        value: signal(''),
        required: true,
        disabled: signal(false),
        placeholder: 'Describe your message in detail...',
        validators: [
          SignalFormService.validators.required(),
          SignalFormService.validators.minLength(10),
          SignalFormService.validators.maxLength(1000)
        ]
      },
      {
        id: 'attachment',
        label: 'I want to attach files',
        type: 'checkbox',
        value: signal(false),
        required: false,
        disabled: signal(false)
      }
    ];

    return this.createForm<ContactForm>(fields);
  }

  /**
   * Submit form (mock implementation)
   */
  async submitForm<T>(form: SignalForm<T>): Promise<{ success: boolean; message: string }> {
    form.isSubmitting.set(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate 90% success rate
      const success = Math.random() > 0.1;

      return {
        success,
        message: success
          ? 'Form submitted successfully!'
          : 'Submission failed. Please try again.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during submission.'
      };
    } finally {
      form.isSubmitting.set(false);
    }
  }

  /**
   * Reset form to initial values
   */
  resetForm<T>(form: SignalForm<T>): void {
    form.fields.forEach(field => {
      if (field.type === 'checkbox') {
        field.value.set(false);
      } else if (field.type === 'number') {
        field.value.set(0);
      } else {
        field.value.set('');
      }
    });

    form.errors.set({});
    form.isDirty.set(false);
    form.isValid.set(true);
  }
}