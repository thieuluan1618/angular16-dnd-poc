import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseWidgetComponent } from '../../base/base-widget.component';

/**
 * Hello World Widget - Example widget implementation
 *
 * A simple widget that displays a greeting message.
 * Demonstrates basic widget structure and edit/view modes.
 */
@Component({
  selector: 'app-hello-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello-widget.component.html',
  styleUrls: ['./hello-widget.component.scss']
})
export class HelloWidgetComponent extends BaseWidgetComponent {
  /**
   * Get greeting message based on mode
   */
  get greeting(): string {
    if (this.mode === 'edit') {
      return `Hello ${this.widget.displayName} (Edit Mode)`;
    }
    return `Hello ${this.widget.displayName}`;
  }

  /**
   * Handle remove button click
   */
  onRemoveClick(): void {
    this.remove.emit();
  }

  /**
   * Handle zoom in button click
   */
  onZoomInClick(): void {
    this.zoomIn.emit();
  }
}
