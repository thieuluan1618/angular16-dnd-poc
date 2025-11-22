import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

/**
 * Toast notification container component
 * Displays all active toasts
 */
@Component({
    selector: 'app-toast-container',
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  private toastService = inject(ToastService);

  toasts = this.toastService.toasts;

  /**
   * Get CSS class for toast type
   */
  getToastClass(type: string): string {
    return `toast toast-${type}`;
  }

  /**
   * Remove a toast
   */
  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}