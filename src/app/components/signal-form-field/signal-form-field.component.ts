import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalFormField, ValidationResult } from '../../models/signal-form';

@Component({
  selector: 'app-signal-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signal-form-field.component.html',
  styleUrls: ['./signal-form-field.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignalFormFieldComponent {
  /**
   * The form field configuration
   */
  field = input<SignalFormField>();

  /**
   * Current validation errors for this field
   */
  errors = input<string[]>([]);

  /**
   * Whether to show validation errors
   */
  showErrors = input(false);

  /**
   * Whether the field is touched (for error display)
   */
  touched = model(false);

  /**
   * Emitted when field value changes
   */
  valueChange = output<any>();

  /**
   * Emitted when field is touched
   */
  touchedChange = output<boolean>();

  /**
   * Computed CSS classes for the field container
   */
  containerClasses = computed(() => {
    // Handle case where field input is not yet available (NG0950)
    const field = this.field();
    if (!field) {
      return {
        'signal-form-field': true
      };
    }

    const hasErrors = this.errors().length > 0 && this.showErrors();
    const isDisabled = field.disabled();

    return {
      'signal-form-field': true,
      'signal-form-field--invalid': hasErrors,
      'signal-form-field--disabled': isDisabled,
      'signal-form-field--required': field.required,
      [`signal-form-field--${field.type}`]: true
    };
  });

  /**
   * Computed input element classes
   */
  inputClasses = computed(() => {
    const field = this.field();
    if (!field) {
      return {
        'signal-form-input': true
      };
    }

    const hasErrors = this.errors().length > 0 && this.showErrors();

    return {
      'signal-form-input': true,
      'signal-form-input--invalid': hasErrors,
      'signal-form-input--disabled': field.disabled()
    };
  });

  /**
   * Computed label classes
   */
  labelClasses = computed(() => {
    const field = this.field();
    if (!field) {
      return {
        'signal-form-label': true
      };
    }

    return {
      'signal-form-label': true,
      'signal-form-label--required': field.required,
      'signal-form-label--disabled': field.disabled()
    };
  });

  /**
   * Handle input value change
   */
  onValueChange(newValue: any): void {
    const field = this.field();
    if (!field) {
      return; // Skip if field is not yet available
    }

    let processedValue: any = newValue;

    switch (field.type) {
      case 'number':
        processedValue = newValue ? Number(newValue) : null;
        break;
      case 'checkbox':
        processedValue = newValue === true || newValue === 'true';
        break;
      default:
        processedValue = newValue;
    }

    field.value.set(processedValue);
    this.valueChange.emit(processedValue);
  }

  /**
   * Handle input for proper event binding
   */
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    this.onValueChange({ target });
  }

  /**
   * Handle field blur (touch)
   */
  onBlur(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.touchedChange.emit(true);
    }
  }

  /**
   * Get field value for binding
   */
  get fieldValue(): any {
    const field = this.field();
    return field ? field.value() : '';
  }

  /**
   * Get error message
   */
  getErrorMessage(): string {
    return this.errors()[0] || '';
  }
}