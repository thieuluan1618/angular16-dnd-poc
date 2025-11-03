import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

/**
 * Toast notification service
 * Manages toast notifications for the application
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private toastId = 0;

  /**
   * Show a toast notification
   */
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): string {
    const id = `toast-${++this.toastId}`;
    const toast: Toast = { id, message, type, duration };

    this.toasts.update(toasts => [...toasts, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  /**
   * Remove a toast notification
   */
  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Show success toast
   */
  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  /**
   * Show error toast
   */
  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration);
  }

  /**
   * Show info toast
   */
  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  /**
   * Show warning toast
   */
  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }
}