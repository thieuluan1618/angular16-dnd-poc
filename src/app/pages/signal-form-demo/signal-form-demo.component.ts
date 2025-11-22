import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SignalFormFieldComponent } from '../../components/signal-form-field/signal-form-field.component';
import { SignalFormValidatorComponent } from '../../components/signal-form-validator/signal-form-validator.component';

import { SignalFormService } from '../../services/signal-form.service';
import { SignalForm, UserProfile, ContactForm } from '../../models/signal-form';

@Component({
  selector: 'app-signal-form-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SignalFormFieldComponent,
    SignalFormValidatorComponent
  ],
  templateUrl: './signal-form-demo.component.html',
  styleUrls: ['./signal-form-demo.component.scss']
})
export class SignalFormDemoComponent implements OnInit {
  private formService = inject(SignalFormService);

  // Demo form instances
  userProfileForm!: SignalForm<UserProfile>;
  contactForm!: SignalForm<ContactForm>;

  // UI state signals
  activeDemo = signal<'user-profile' | 'contact'>('user-profile');
  submittedData = signal<{ type: string; data: any; timestamp: Date } | null>(null);
  submissionResult = signal<{ success: boolean; message: string } | null>(null);
  showErrors = signal(false);

  // Computed properties
  currentForm = computed(() => {
    return this.activeDemo() === 'user-profile' ? this.userProfileForm : this.contactForm;
  });

  formTitle = computed(() => {
    return this.activeDemo() === 'user-profile' ? 'User Profile Form' : 'Contact Form';
  });

  formDescription = computed(() => {
    return this.activeDemo() === 'user-profile'
      ? 'Complete your profile information with our signal-based form system.'
      : 'Send us a message using our reactive signal-based contact form.';
  });

  ngOnInit(): void {
    this.initializeForms();
  }

  /**
   * Initialize demo forms
   */
  private initializeForms(): void {
    this.userProfileForm = this.formService.createUserProfileForm();
    this.contactForm = this.formService.createContactForm();
  }

  /**
   * Switch between demo forms
   */
  switchDemo(demo: 'user-profile' | 'contact'): void {
    this.activeDemo.set(demo);
    this.showErrors.set(false);
    this.submittedData.set(null);
    this.submissionResult.set(null);
  }

  /**
   * Handle field touch events
   */
  onFieldTouched(event: { fieldId: string; touched: boolean }): void {
    if (!this.showErrors()) {
      this.showErrors.set(true);
    }

    // Update form values and validation
    this.updateFormValues();
  }

  /**
   * Update form values and run validation
   */
  updateFormValues(): void {
    const form = this.currentForm();
    const updatedValues: any = {};
    let hasChanges = false;

    form.fields.forEach(field => {
      const currentValue = field.value();
      if (JSON.stringify(currentValue) !== JSON.stringify(form.values()[field.id])) {
        updatedValues[field.id] = currentValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      form.values.set({
        ...form.values(),
        ...updatedValues
      });

      form.isDirty.set(true);
      this.runValidation();
    }
  }

  /**
   * Run form validation
   */
  runValidation(): void {
    const form = this.currentForm();
    const errors: Record<string, string[]> = {};
    let formIsValid = true;

    form.fields.forEach(field => {
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

      if (fieldErrors.length > 0) {
        errors[field.id] = fieldErrors;
        formIsValid = false;
      }
    });

    form.errors.set(errors);
    form.isValid.set(formIsValid);
  }

  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    const form = this.currentForm();

    // Update form values one more time before submission
    this.updateFormValues();
    this.runValidation();

    if (!form.isValid()) {
      this.showErrors.set(true);
      return;
    }

    try {
      this.submissionResult.set({ success: false, message: 'Submitting...' });

      const result = await this.formService.submitForm(form);
      this.submissionResult.set(result);

      if (result.success) {
        // Store submitted data
        this.submittedData.set({
          type: this.activeDemo(),
          data: form.values(),
          timestamp: new Date()
        });

        // Reset form after successful submission
        setTimeout(() => {
          this.formService.resetForm(form);
          this.showErrors.set(false);
        }, 3000);
      }
    } catch (error) {
      this.submissionResult.set({
        success: false,
        message: 'An unexpected error occurred.'
      });
    }
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    const form = this.currentForm();
    this.formService.resetForm(form);
    this.showErrors.set(false);
    this.submittedData.set(null);
    this.submissionResult.set(null);
  }

  /**
   * Toggle error display
   */
  toggleErrors(): void {
    this.showErrors.set(!this.showErrors());
  }

  /**
   * Pre-fill form with sample data
   */
  prefillForm(): void {
    const form = this.currentForm();

    if (this.activeDemo() === 'user-profile') {
      // Pre-fill user profile
      form.fields[0].value.set('John'); // firstName
      form.fields[1].value.set('Doe'); // lastName
      form.fields[2].value.set('john.doe@example.com'); // email
      form.fields[3].value.set(30); // age
      form.fields[4].value.set('Passionate developer with expertise in Angular and TypeScript.'); // bio
      form.fields[6].value.set('us'); // country
      form.fields[7].value.set('advanced'); // experience
    } else {
      // Pre-fill contact form
      form.fields[0].value.set('Jane Smith'); // name
      form.fields[1].value.set('jane.smith@example.com'); // email
      form.fields[2].value.set('support'); // subject
      form.fields[3].value.set('high'); // priority
      form.fields[4].value.set('I need help with implementing signal-based forms in my Angular 21 application. Can you provide guidance?'); // message
    }

    this.showErrors.set(true);
  }

  /**
   * Get formatted form data for display
   */
  getFormattedFormData(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(fieldId: string): string[] {
    const form = this.currentForm();
    const errors = form.errors();
    return errors[fieldId] || [];
  }

  /**
   * Get field statistics
   */
  getFieldStats(): { total: number; required: number; valid: number; invalid: number } {
    const form = this.currentForm();
    const fields = form.fields;
    const errors = form.errors();

    return {
      total: fields.length,
      required: fields.filter(f => f.required).length,
      valid: fields.filter(f => !errors[f.id]?.length).length,
      invalid: Object.keys(errors).filter(fieldId => errors[fieldId].length > 0).length
    };
  }
}