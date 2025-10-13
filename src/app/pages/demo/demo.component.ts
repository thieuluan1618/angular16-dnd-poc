import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridStackComponent } from '../../components/grid-stack/grid-stack.component';
import { DraggableWidgetDirective } from '../../directives/draggable-widget.directive';
import { gridStackEditModeOptions, gridStackViewModeOptions } from '../../config/grid-stack-options';
import { GridWidget, WidgetPrototype, GlobalFilterValue } from '../../models';

/**
 * Demo page component
 *
 * Demonstrates the drag-and-drop widget system with:
 * - Sidebar with draggable widget prototypes
 * - GridStack container in edit/view mode
 * - Mode toggle
 * - Layout persistence to localStorage
 */
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, GridStackComponent, DraggableWidgetDirective],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  /**
   * Current display mode
   */
  mode: 'edit' | 'view' = 'edit';

  /**
   * Current widget layout
   */
  widgets: GridWidget[] = [];

  /**
   * Global filter values shared across all widgets
   */
  globalFilterValue: GlobalFilterValue = {
    searchTerm: '',
    dateRange: {
      start: '',
      end: ''
    },
    category: '',
    showInactive: true
  };

  /**
   * GridStack options (switches based on mode)
   */
  get gridStackOptions() {
    return this.mode === 'edit' ? gridStackEditModeOptions : gridStackViewModeOptions;
  }

  /**
   * Available widget prototypes for dragging
   */
  widgetPrototypes: WidgetPrototype[] = [
    {
      id: 'hello-1',
      name: 'hello-widget',
      displayName: 'Hello Widget',
      type: 'hello',
      component: 'HelloWidgetComponent',
      defaultWidth: 4,
      defaultHeight: 2,
      minWidth: 2,
      minHeight: 1,
      icon: '👋'
    },
    {
      id: 'chart-1',
      name: 'chart-widget',
      displayName: 'Chart Widget',
      type: 'chart',
      component: 'ChartWidgetComponent',
      defaultWidth: 6,
      defaultHeight: 3,
      minWidth: 3,
      minHeight: 2,
      icon: '📊'
    },
    {
      id: 'data-1',
      name: 'data-widget',
      displayName: 'Data Table Widget',
      type: 'data',
      component: 'DataWidgetComponent',
      defaultWidth: 8,
      defaultHeight: 4,
      minWidth: 4,
      minHeight: 3,
      icon: '📋'
    },
    {
      id: 'hello-2',
      name: 'hello-widget-2',
      displayName: 'Another Hello',
      type: 'hello',
      component: 'HelloWidgetComponent',
      defaultWidth: 3,
      defaultHeight: 2,
      minWidth: 2,
      minHeight: 1,
      icon: '👋',
      disabled: false
    }
  ];

  constructor() {
    this.loadLayout();
    
    // If no layout is loaded, add a sample layout for testing
    if (this.widgets.length === 0) {
      this.addSampleLayout();
    }
  }

  /**
   * Handle global filter changes
   * Updates the global filter value which propagates to all widgets
   */
  onGlobalFilterChange(): void {
    console.log('Global filter changed:', this.globalFilterValue);
    // The filter value is automatically passed to widgets via the grid-stack component
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.globalFilterValue = {
      searchTerm: '',
      dateRange: {
        start: '',
        end: ''
      },
      category: '',
      showInactive: true
    };
  }

  /**
   * Get available categories for filter dropdown
   */
  get filterCategories(): string[] {
    return ['All', 'Sales', 'Marketing', 'Development', 'Support'];
  }

  /**
   * Toggle between edit and view modes
   */
  toggleMode(): void {
    this.mode = this.mode === 'edit' ? 'view' : 'edit';
  }

  /**
   * Handle layout changes
   * Saves to localStorage for persistence
   */
  onLayoutChange(widgets: GridWidget[]): void {
    console.log('Layout changed:', widgets);
    this.widgets = widgets;
    this.saveLayout();
  }

  /**
   * Handle drag stop event
   */
  onDragStop(widget: GridWidget | null): void {
    console.log('Drag stopped:', widget);
  }

  /**
   * Handle resize stop event
   */
  onResizeStop(widgets: GridWidget[]): void {
    console.log('Resize stopped:', widgets);
  }

  /**
   * Handle widget removed event
   */
  onWidgetRemoved(widget: GridWidget | null): void {
    console.log('Widget removed:', widget);
  }

  /**
   * Clear all widgets
   */
  clearLayout(): void {
    if (confirm('Are you sure you want to clear all widgets?')) {
      this.widgets = [];
      this.saveLayout();
    }
  }

  /**
   * Add a sample layout for demonstration
   */
  addSampleLayout(): void {
    this.widgets = [
      {
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        mode: this.mode,
        data: {
          id: 'sample-hello-1',
          instanceId: 'inst-1',
          name: 'hello-widget',
          displayName: 'Sample Hello Widget',
          type: 'hello',
          component: 'HelloWidgetComponent',
          defaultWidth: 4,
          defaultHeight: 2,
          minWidth: 2,
          minHeight: 1,
          properties: {},
          instanceProperties: {}
        }
      },
      {
        x: 4,
        y: 0,
        w: 6,
        h: 3,
        mode: this.mode,
        data: {
          id: 'sample-chart-1',
          instanceId: 'inst-2',
          name: 'chart-widget',
          displayName: 'Sample Chart Widget',
          type: 'chart',
          component: 'ChartWidgetComponent',
          defaultWidth: 6,
          defaultHeight: 3,
          minWidth: 3,
          minHeight: 2,
          properties: {},
          instanceProperties: {}
        }
      },
      {
        x: 0,
        y: 2,
        w: 3,
        h: 2,
        mode: this.mode,
        data: {
          id: 'sample-hello-2',
          instanceId: 'inst-3',
          name: 'hello-widget',
          displayName: 'Another Sample',
          type: 'hello',
          component: 'HelloWidgetComponent',
          defaultWidth: 3,
          defaultHeight: 2,
          minWidth: 2,
          minHeight: 1,
          properties: {},
          instanceProperties: {}
        }
      }
    ];
    this.saveLayout();
  }

  /**
   * Save layout to localStorage
   */
  private saveLayout(): void {
    try {
      localStorage.setItem('dnd-layout', JSON.stringify(this.widgets));
    } catch (error) {
      console.error('Failed to save layout:', error);
    }
  }

  /**
   * Load layout from localStorage
   */
  private loadLayout(): void {
    try {
      const saved = localStorage.getItem('dnd-layout');
      if (saved) {
        this.widgets = JSON.parse(saved);
        // Update mode for all widgets
        this.widgets.forEach(w => w.mode = this.mode);
      }
    } catch (error) {
      console.error('Failed to load layout:', error);
    }
  }
}
