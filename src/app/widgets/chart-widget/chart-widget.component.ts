import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseWidgetComponent } from '../../base/base-widget.component';

/**
 * Chart Widget - Example widget with placeholder chart
 *
 * Demonstrates a more complex widget with simulated data visualization.
 * In a real application, this would integrate with a charting library like Chart.js or D3.
 */
@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent extends BaseWidgetComponent {
  /**
   * Sample chart data
   */
  chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 59 },
    { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 56 },
    { label: 'Jun', value: 55 }
  ];

  /**
   * Get max value for chart scaling
   */
  get maxValue(): number {
    return Math.max(...this.chartData.map(d => d.value));
  }

  /**
   * Calculate bar height percentage
   */
  getBarHeight(value: number): number {
    return (value / this.maxValue) * 100;
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
    // In a real app, this would open a settings dialog
    console.log('Chart settings clicked');
  }
}
