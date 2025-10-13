import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule],
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
    const searchMatch = this.checkSearchMatch();
    const baseGreeting = this.mode === 'edit' 
      ? `Hello ${this.widget.displayName} (Edit Mode)` 
      : `Hello ${this.widget.displayName}`;
    
    return searchMatch ? `🔍 ${baseGreeting}` : baseGreeting;
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
    if (this.globalFilterValue.searchTerm) activeFilters.push('Search');
    if (this.globalFilterValue.category) activeFilters.push('Category');
    if (this.globalFilterValue.dateRange?.start || this.globalFilterValue.dateRange?.end) activeFilters.push('Date');
    if (this.globalFilterValue.showInactive !== undefined) activeFilters.push('Status');
    
    return activeFilters.length > 0 ? `Filters: ${activeFilters.join(', ')}` : 'No Filters';
  }

  /**
   * Get current filter info for display
   */
  get filterInfo(): string {
    const filters: string[] = [];
    
    if (this.globalFilterValue.searchTerm) {
      filters.push(`Search: "${this.globalFilterValue.searchTerm}"`);
    }
    
    if (this.globalFilterValue.category) {
      filters.push(`Category: ${this.globalFilterValue.category}`);
    }
    
    if (this.globalFilterValue.dateRange?.start || this.globalFilterValue.dateRange?.end) {
      const start = this.globalFilterValue.dateRange?.start || 'N/A';
      const end = this.globalFilterValue.dateRange?.end || 'N/A';
      filters.push(`Date: ${start} to ${end}`);
    }

    return filters.length > 0 ? filters.join(' | ') : 'No active filters';
  }

  /**
   * Check if widget content matches search term
   */
  private checkSearchMatch(): boolean {
    const searchTerm = this.globalFilterValue.searchTerm?.toLowerCase();
    if (!searchTerm) return false;
    
    const searchableText = [
      this.widget.displayName,
      this.widget.name,
      this.widget.type,
      'hello',
      'greeting',
      'sample'
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  }

  /**
   * Handle global filter changes
   * Called whenever global filter values change
   */
  onGlobalFilterChanges(change: { previousValue: GlobalFilterValue; currentValue: GlobalFilterValue; firstChange: boolean }): void {
    console.log('Hello widget received filter change:', change);
    
    // Apply search filter
    const searchTerm = change.currentValue.searchTerm?.toLowerCase();
    if (searchTerm) {
      this.isVisible = this.checkSearchMatch();
      this.filterMessage = this.isVisible 
        ? `Matches search: "${searchTerm}"` 
        : `No match for: "${searchTerm}"`;
    } else {
      this.isVisible = true;
      this.filterMessage = '';
    }

    // Apply category filter (simulate widget having categories)
    const category = change.currentValue.category;
    if (category && category !== 'All') {
      // Simulate this widget belonging to 'Development' category
      const widgetCategory = 'Development';
      this.isVisible = this.isVisible && (category === widgetCategory);
      if (category !== widgetCategory) {
        this.filterMessage = `Filtered out by category: ${category} (this widget is ${widgetCategory})`;
      }
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
