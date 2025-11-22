import { Component, OnInit } from '@angular/core';

import { BaseWidgetComponent } from '../../base/base-widget.component';
import { GlobalFilterValue } from '../../models';

interface DataItem {
  id: number;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  createdDate: string;
  value: number;
  description: string;
}

/**
 * Data Table Widget - Advanced widget with filtering capabilities
 *
 * Demonstrates complex global filter integration with:
 * - Search filtering across multiple fields
 * - Category filtering
 * - Date range filtering
 * - Status filtering (active/inactive)
 */
@Component({
    selector: 'app-data-widget',
    imports: [],
    templateUrl: './data-widget.component.html',
    styleUrls: ['./data-widget.component.scss']
})
export class DataWidgetComponent extends BaseWidgetComponent implements OnInit {
  /**
   * Sample data for the table
   */
  allData: DataItem[] = [
    {
      id: 1,
      name: 'Sales Report Q1',
      category: 'Sales',
      status: 'active',
      createdDate: '2024-01-15',
      value: 1250.50,
      description: 'First quarter sales performance report'
    },
    {
      id: 2,
      name: 'Marketing Campaign Analysis',
      category: 'Marketing',
      status: 'active',
      createdDate: '2024-02-20',
      value: 890.25,
      description: 'Analysis of recent marketing campaign effectiveness'
    },
    {
      id: 3,
      name: 'Development Sprint Review',
      category: 'Development',
      status: 'inactive',
      createdDate: '2024-01-30',
      value: 2150.75,
      description: 'Sprint retrospective and performance metrics'
    },
    {
      id: 4,
      name: 'Customer Support Metrics',
      category: 'Support',
      status: 'active',
      createdDate: '2024-03-10',
      value: 675.80,
      description: 'Monthly customer satisfaction and response times'
    },
    {
      id: 5,
      name: 'Sales Forecast Q2',
      category: 'Sales',
      status: 'active',
      createdDate: '2024-03-25',
      value: 1875.60,
      description: 'Projected sales figures for second quarter'
    },
    {
      id: 6,
      name: 'Legacy System Migration',
      category: 'Development',
      status: 'inactive',
      createdDate: '2024-01-05',
      value: 3200.00,
      description: 'Migration project from legacy systems'
    },
    {
      id: 7,
      name: 'Brand Awareness Study',
      category: 'Marketing',
      status: 'active',
      createdDate: '2024-03-01',
      value: 1150.25,
      description: 'Market research on brand recognition and perception'
    },
    {
      id: 8,
      name: 'Technical Support Training',
      category: 'Support',
      status: 'inactive',
      createdDate: '2024-02-14',
      value: 450.00,
      description: 'Training program for new support staff members'
    }
  ];

  /**
   * Filtered data based on global filters
   */
  filteredData: DataItem[] = [];

  /**
   * Filter statistics
   */
  filterStats = {
    total: 0,
    filtered: 0,
    hidden: 0
  };

  ngOnInit(): void {
    this.applyFilters();
  }

  /**
   * Handle global filter changes
   */
  onGlobalFilterChanges(change: { previousValue: GlobalFilterValue; currentValue: GlobalFilterValue; firstChange: boolean }): void {
    console.log('Data widget received filter change:', change.currentValue);
    this.applyFilters();
  }

  /**
   * Apply all global filters to the data
   */
  private applyFilters(): void {
    let filtered = [...this.allData];

    // Apply date filter (dateFilter: last-12-months, last-6-months, etc.)
    const dateFilter = this.globalFilterValue.dateFilter;
    if (dateFilter && dateFilter !== 'custom') {
      const now = new Date();
      let monthsToSubtract = 0;

      switch (dateFilter) {
        case 'last-month':
          monthsToSubtract = 1;
          break;
        case 'last-3-months':
          monthsToSubtract = 3;
          break;
        case 'last-6-months':
          monthsToSubtract = 6;
          break;
        case 'last-12-months':
          monthsToSubtract = 12;
          break;
      }

      if (monthsToSubtract > 0) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(now.getMonth() - monthsToSubtract);

        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdDate);
          return itemDate >= cutoffDate;
        });
      }
    }

    // Apply custom date range filter if custom is selected
    if (dateFilter === 'custom') {
      const dateRange = this.globalFilterValue.dateRange;
      if (dateRange?.start || dateRange?.end) {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdDate);
          const startDate = dateRange.start ? new Date(dateRange.start) : null;
          const endDate = dateRange.end ? new Date(dateRange.end) : null;

          if (startDate && itemDate < startDate) return false;
          if (endDate && itemDate > endDate) return false;

          return true;
        });
      }
    }

    // Trending filter can be used for sorting or grouping
    // (For now, we just acknowledge it exists)
    const trending = this.globalFilterValue.trending;
    if (trending) {
      console.log(`Trending filter applied: ${trending}`);
      // In a real app, this might sort by trend data
    }

    this.filteredData = filtered;
    this.updateFilterStats();
  }

  /**
   * Update filter statistics
   */
  private updateFilterStats(): void {
    this.filterStats = {
      total: this.allData.length,
      filtered: this.filteredData.length,
      hidden: this.allData.length - this.filteredData.length
    };
  }

  /**
   * Get debug header information
   */
  get debugInfo(): string {
    return `Debug: ID=${this.widget.id} | Type=${this.widget.type} | Mode=${this.mode} | Records=${this.filteredData.length}/${this.allData.length}`;
  }

  /**
   * Get current filter status for header display
   */
  get headerFilterStatus(): string {
    const activeFilters = [];
    if (this.globalFilterValue.dateFilter) activeFilters.push('Date');
    if (this.globalFilterValue.trending) activeFilters.push('Trending');

    const showing = `Showing: ${this.filteredData.length}/${this.allData.length}`;
    return activeFilters.length > 0 ? `${showing} | Filters: ${activeFilters.join(', ')}` : showing;
  }

  /**
   * Get filter summary for display
   */
  get filterSummary(): string {
    const parts: string[] = [];

    if (this.globalFilterValue.dateFilter) {
      const dateLabels: Record<string, string> = {
        'last-month': 'Last month',
        'last-3-months': 'Last 3 months',
        'last-6-months': 'Last 6 months',
        'last-12-months': 'Last 12 months',
        'custom': 'Custom range'
      };
      parts.push(`date: ${dateLabels[this.globalFilterValue.dateFilter] || this.globalFilterValue.dateFilter}`);
    }

    if (this.globalFilterValue.trending) {
      const trendingLabels: Record<string, string> = {
        'daily': 'Daily trend',
        'weekly': 'Weekly trend',
        'monthly': 'Monthly trend'
      };
      parts.push(`trending: ${trendingLabels[this.globalFilterValue.trending] || this.globalFilterValue.trending}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'No filters applied';
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Handle remove button click
   */
  onRemoveClick(): void {
    this.remove.emit();
  }

  /**
   * Handle settings button click
   */
  onSettingsClick(): void {
    console.log('Data widget settings clicked');
    // In a real app, this would open a settings dialog
  }
}