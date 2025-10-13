import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule],
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

    // Apply search filter
    const searchTerm = this.globalFilterValue.searchTerm?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    const category = this.globalFilterValue.category;
    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.category === category);
    }

    // Apply date range filter
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

    // Apply inactive filter
    if (!this.globalFilterValue.showInactive) {
      filtered = filtered.filter(item => item.status === 'active');
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
    if (this.globalFilterValue.searchTerm) activeFilters.push('Search');
    if (this.globalFilterValue.category) activeFilters.push('Category');
    if (this.globalFilterValue.dateRange?.start || this.globalFilterValue.dateRange?.end) activeFilters.push('Date');
    if (this.globalFilterValue.showInactive !== undefined) activeFilters.push('Status');
    
    const showing = `Showing: ${this.filteredData.length}/${this.allData.length}`;
    return activeFilters.length > 0 ? `${showing} | Filters: ${activeFilters.join(', ')}` : showing;
  }

  /**
   * Get filter summary for display
   */
  get filterSummary(): string {
    const parts: string[] = [];

    if (this.globalFilterValue.searchTerm) {
      parts.push(`search: "${this.globalFilterValue.searchTerm}"`);
    }

    if (this.globalFilterValue.category) {
      parts.push(`category: ${this.globalFilterValue.category}`);
    }

    if (this.globalFilterValue.dateRange?.start || this.globalFilterValue.dateRange?.end) {
      const start = this.globalFilterValue.dateRange?.start || '∞';
      const end = this.globalFilterValue.dateRange?.end || '∞';
      parts.push(`date: ${start} to ${end}`);
    }

    if (!this.globalFilterValue.showInactive) {
      parts.push('active only');
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