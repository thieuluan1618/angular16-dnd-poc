import { Component } from '@angular/core';

import { BaseWidgetComponent } from '../../base/base-widget.component';
import { GlobalFilterValue } from '../../models';

/**
 * Hello World Widget - Example widget implementation
 *
 * A simple widget that displays a greeting message.
 * Demonstrates basic widget structure and edit/view modes.
 * Also demonstrates global filter integration.
 */
@Component({
    selector: 'app-hello-widget',
    imports: [],
    templateUrl: './hello-widget.component.html',
    styleUrls: ['./hello-widget.component.scss']
})
export class HelloWidgetComponent extends BaseWidgetComponent {
  /**
   * Filtered display state - used to show/hide content based on filters
   */
  isVisible = true;
  filterMessage = '';

  /**
   * Get greeting message based on mode
   */
  get greeting(): string {
    const baseGreeting = this.mode === 'edit'
      ? `Hello ${this.widget.displayName} (Edit Mode)`
      : `Hello ${this.widget.displayName}`;

    return baseGreeting;
  }

  /**
   * Get debug header information
   */
  get debugInfo(): string {
    return `Debug: ID=${this.widget.id} | Type=${this.widget.type} | Mode=${this.mode} | Visible=${this.isVisible}`;
  }

  /**
   * Get current filter status for header display
   */
  get headerFilterStatus(): string {
    const activeFilters = [];
    if (this.globalFilterValue.dateFilter) activeFilters.push('Date');
    if (this.globalFilterValue.trending) activeFilters.push('Trending');

    return activeFilters.length > 0 ? `Filters: ${activeFilters.join(', ')}` : 'No Filters';
  }

  /**
   * Get current filter info for display
   */
  get filterInfo(): string {
    const filters: string[] = [];

    if (this.globalFilterValue.dateFilter) {
      const dateLabels: Record<string, string> = {
        'last-month': 'Last month',
        'last-3-months': 'Last 3 months',
        'last-6-months': 'Last 6 months',
        'last-12-months': 'Last 12 months',
        'custom': 'Custom range'
      };
      filters.push(`Date: ${dateLabels[this.globalFilterValue.dateFilter] || this.globalFilterValue.dateFilter}`);
    }

    if (this.globalFilterValue.trending) {
      const trendingLabels: Record<string, string> = {
        'daily': 'Daily trend',
        'weekly': 'Weekly trend',
        'monthly': 'Monthly trend'
      };
      filters.push(`Trending: ${trendingLabels[this.globalFilterValue.trending] || this.globalFilterValue.trending}`);
    }

    return filters.length > 0 ? filters.join(' | ') : 'No active filters';
  }

  /**
   * Handle global filter changes
   * Called whenever global filter values change
   */
  onGlobalFilterChanges(change: { previousValue: GlobalFilterValue; currentValue: GlobalFilterValue; firstChange: boolean }): void {
    console.log('Hello widget received filter change:', change);

    // Update visibility based on filter (always visible for now)
    this.isVisible = true;

    // Build filter message
    if (change.currentValue.dateFilter || change.currentValue.trending) {
      this.filterMessage = `Filters applied: ${this.filterInfo}`;
    } else {
      this.filterMessage = '';
    }
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
