import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalForm } from '../../models/signal-form';
import { SignalFormService } from '../../services/signal-form.service';

@Component({
  selector: 'app-signal-form-validator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal-form-validator.component.html',
  styleUrls: ['./signal-form-validator.component.scss']
})
export class SignalFormValidatorComponent {
  /**
   * The signal form to validate and display
   */
  form = input.required<SignalForm>();

  /**
   * Whether to show validation errors
   */
  showErrors = input(false);

  /**
   * Whether to show submit button
   */
  showSubmit = input(true);

  /**
   * Submit button text
   */
  submitText = input('Submit');

  /**
   * Cancel button text
   */
  cancelText = input('Cancel');

  /**
   * Whether to show cancel button
   */
  showCancel = input(false);

  /**
   * Custom submit button class
   */
  submitClass = input('btn-primary');

  /**
   * Whether form is in loading state
   */
  loading = input(false);

  /**
   * Emitted when form is submitted
   */
  submit = output<void>();

  /**
   * Emitted when form is cancelled
   */
  cancel = output<void>();

  /**
   * Emitted when field is touched
   */
  fieldTouched = output<{ fieldId: string; touched: boolean }>();

  private formService = inject(SignalFormService);

  /**
   * Computed form validation status
   */
  validationStatus = computed(() => {
    const form = this.form();
    const errors = form.errors();
    const fieldCount = Object.keys(errors).length;

    return {
      isValid: form.isValid(),
      hasErrors: fieldCount > 0,
      totalErrors: fieldCount,
      isDirty: form.isDirty(),
      isSubmitting: form.isSubmitting()
    };
  });

  /**
   * Computed submit button state
   */
  submitButtonDisabled = computed(() => {
    const status = this.validationStatus();
    return status.hasErrors || !status.isDirty || status.isSubmitting || this.loading();
  });

  /**
   * Computed submit button text
   */
  submitButtonText = computed(() => {
    const status = this.validationStatus();
    if (status.isSubmitting || this.loading()) {
      return 'Submitting...';
    }
    return this.submitText();
  });

  /**
   * Get errors for a specific field
   */
  getFieldErrors(fieldId: string): string[] {
    const errors = this.form().errors();
    return errors[fieldId] || [];
  }

  /**
   * Handle field touch event
   */
  onFieldTouched(fieldId: string, touched: boolean): void {
    this.fieldTouched.emit({ fieldId, touched });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (!this.submitButtonDisabled()) {
      this.submit.emit();
    }
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Get validation summary text
   */
  getValidationSummary(): string {
    const status = this.validationStatus();

    if (status.hasErrors) {
      const errorCount = status.totalErrors;
      return `${errorCount} error${errorCount === 1 ? '' : 's'} need${errorCount === 1 ? 's' : ''} to be resolved`;
    }

    if (status.isDirty && status.isValid) {
      return 'All fields are valid';
    }

    if (!status.isDirty) {
      return 'Form has not been modified';
    }

    return 'Ready to submit';
  }

  /**
   * Get validation status icon
   */
  getValidationStatusIcon(): string {
    const status = this.validationStatus();

    if (status.hasErrors) {
      return '⚠️';
    }

    if (status.isValid && status.isDirty) {
      return '✅';
    }

    return 'ℹ️';
  }

  /**
   * Get CSS classes for validation status
   */
  getValidationStatusClasses(): { [key: string]: boolean } {
    const status = this.validationStatus();

    return {
      'signal-form-validator__status': true,
      'signal-form-validator__status--error': status.hasErrors,
      'signal-form-validator__status--success': status.isValid && status.isDirty,
      'signal-form-validator__status--info': !status.isDirty
    };
  }

  /**
   * Get the count of required fields
   */
  getRequiredFieldsCount(): number {
    return this.form().fields.filter(f => f.required).length;
  }
}