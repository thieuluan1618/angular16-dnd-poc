import { Component } from '@angular/core';

import { BaseWidgetComponent } from '../../base/base-widget.component';
import { GlobalFilterValue } from '../../models';

/**
 * Hello Mom Widget - A special greeting widget
 *
 * A simple widget that displays a special greeting to mom.
 * Demonstrates basic widget structure and edit/view modes.
 */
@Component({
    selector: 'app-hello-mom-widget',
    imports: [],
    templateUrl: './hello-mom-widget.component.html',
    styleUrls: ['./hello-mom-widget.component.scss']
})
export class HelloMomWidgetComponent extends BaseWidgetComponent {
  isVisible = true;
  filterMessage = '';

  get greeting(): string {
    const baseGreeting = this.mode === 'edit'
      ? `Hello Mom (Edit Mode)`
      : `Hello Mom`;

    return baseGreeting;
  }

  get debugInfo(): string {
    return `Debug: ID=${this.widget.id} | Type=${this.widget.type} | Mode=${this.mode}`;
  }

  get headerFilterStatus(): string {
    const activeFilters = [];
    if (this.globalFilterValue.dateFilter) activeFilters.push('Date');
    if (this.globalFilterValue.trending) activeFilters.push('Trending');

    return activeFilters.length > 0 ? `Filters: ${activeFilters.join(', ')}` : 'No Filters';
  }

  onGlobalFilterChanges(change: { previousValue: GlobalFilterValue; currentValue: GlobalFilterValue; firstChange: boolean }): void {
    console.log('Hello Mom widget received filter change:', change);
    this.isVisible = true;

    if (change.currentValue.dateFilter || change.currentValue.trending) {
      this.filterMessage = 'Filters applied';
    } else {
      this.filterMessage = '';
    }
  }

  onRemoveClick(): void {
    this.remove.emit();
  }

  onZoomInClick(): void {
    this.zoomIn.emit();
  }
}
