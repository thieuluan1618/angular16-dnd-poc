import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseWidgetComponent } from '../../base/base-widget.component';

/**
 * Fallback Widget Component
 *
 * Displayed when a requested widget component is not found in the registry.
 * Shows widget information and error message for debugging.
 */
@Component({
    selector: 'app-fallback-widget',
    imports: [CommonModule],
    templateUrl: './fallback-widget.component.html',
    styleUrls: ['./fallback-widget.component.scss']
})
export class FallbackWidgetComponent extends BaseWidgetComponent {
  /**
   * Handle remove button click
   */
  onRemoveClick(): void {
    this.remove.emit();
  }
}