import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { GlobalFilterValue, Widget } from '../models';

/**
 * Base class for all widget components
 *
 * All custom widget implementations should extend this class to ensure
 * they implement the required interface for the widget system.
 *
 * Example:
 * ```typescript
 * @Component({
 *   selector: 'app-hello-widget',
 *   standalone: true,
 *   template: '<div>Hello {{ widget.displayName }}!</div>'
 * })
 * export class HelloWidgetComponent extends BaseWidgetComponent {
 *   // Widget implementation
 * }
 * ```
 */
@Directive()
export abstract class BaseWidgetComponent {
  /**
   * Display mode - 'edit' allows editing, 'view' is read-only
   */
  @Input() mode: 'view' | 'edit' = 'view';

  /**
   * Widget data and configuration
   */
  @Input() widget!: Widget;

  /**
   * Global filter value shared across all widgets
   */
  @Input() globalFilterValue: GlobalFilterValue = {};

  /**
   * Emitted when user wants to remove this widget
   */
  @Output() remove = new EventEmitter<void>();

  /**
   * Emitted when user wants to zoom in (expand) this widget
   */
  @Output() zoomIn = new EventEmitter<void>();

  /**
   * Emitted when user wants to zoom out (collapse) this widget
   */
  @Output() zoomOut = new EventEmitter<void>();

  /**
   * Emitted when the widget title changes
   */
  @Output() titleChange = new EventEmitter<string>();

  /**
   * Emitted when the widget settings change
   */
  @Output() settingsChange = new EventEmitter<Record<string, unknown>>();

  /**
   * Generic event emitter for custom events (resize, etc.)
   */
  emitEvent(eventName: string, data: any): void {
    // Can be overridden by subclasses to handle custom events
  }

  /**
   * Optional lifecycle hook called when global filter changes
   * Implement this in your widget if you need to respond to filter changes
   */
  onGlobalFilterChanges?(change: { previousValue: any; currentValue: any; firstChange: boolean }): void;
}

/**
 * Type guard to check if a component implements onGlobalFilterChanges
 */
export function isOnGlobalFilterChanges(
  component: any
): component is { onGlobalFilterChanges: (change: any) => void } {
  return typeof component?.onGlobalFilterChanges === 'function';
}
