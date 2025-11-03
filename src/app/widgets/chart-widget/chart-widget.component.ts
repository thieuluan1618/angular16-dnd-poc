import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseWidgetComponent } from '../../base/base-widget.component';
import { GlobalFilterValue } from '../../models';

interface ChartDataPoint {
  label: string;
  value: number;
}

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
  @Input() globalFilterValue: GlobalFilterValue = {};

  /**
   * Sample chart data
   */
  chartData: ChartDataPoint[] = [
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
   * Generate random chart data with specified number of points
   */
  private generateRandomChartData(numPoints: number = 6): ChartDataPoint[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: ChartDataPoint[] = [];

    for (let i = 0; i < numPoints; i++) {
      data.push({
        label: months[i % months.length],
        value: Math.floor(Math.random() * 100) + 20 // Random value between 20-120
      });
    }

    return data;
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

  /**
   * Handle global filter changes - regenerate chart with random data
   */
  onGlobalFilterChanges(change: { previousValue: GlobalFilterValue; currentValue: GlobalFilterValue; firstChange: boolean }): void {
    const currentFilter = change.currentValue;

    // Determine number of data points based on trending filter
    let numPoints = 6; // default
    if (currentFilter.trending === 'daily') {
      numPoints = 7; // Show 7 days for daily
    } else if (currentFilter.trending === 'weekly') {
      numPoints = 12; // Show 12 weeks for weekly
    } else if (currentFilter.trending === 'monthly') {
      numPoints = 6; // Show 6 months for monthly
    }

    // Generate new random data and update chart
    this.chartData = this.generateRandomChartData(numPoints);

    // console.log('Chart widget received filter change:', currentFilter);
    console.log('Updated chart data:', this.chartData);
  }
}
