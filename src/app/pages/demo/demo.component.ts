import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridStackComponent } from '../../components/grid-stack/grid-stack.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { DraggableWidgetDirective } from '../../directives/draggable-widget.directive';
import { gridStackEditModeOptions, gridStackViewModeOptions } from '../../config/grid-stack-options';
import { GridWidget, WidgetPrototype, GlobalFilterValue } from '../../models';
import { ToastService } from '../../services/toast.service';

/**
 * Demo page component
 *
 * Demonstrates the drag-and-drop widget system with:
 * - Sidebar with draggable widget prototypes
 * - GridStack container in edit/view mode
 * - Mode toggle
 * - Layout persistence to localStorage
 * 
 * Uses Angular 21 signals for full zoneless compatibility
 */
@Component({
    selector: 'app-demo',
    standalone: true,
    imports: [CommonModule, FormsModule, GridStackComponent, ToastComponent, DraggableWidgetDirective],
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
    // TODO: This component uses signals for full zoneless compatibility.
    // Change detection is OnPush to optimize performance with signal-based state.
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoComponent {
  private toastService = inject(ToastService);

  /**
   * Current display mode (signal)
   */
  mode = signal<'edit' | 'view'>('edit');

  /**
   * Current widget layout (signal)
   */
  widgets = signal<GridWidget[]>([]);

  /**
   * Global filter values shared across all widgets (signal)
   */
  globalFilterValue = signal<GlobalFilterValue>({
    dateFilter: '',
    trending: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  /**
   * GridStack options (computed - switches based on mode)
   */
  gridStackOptions = computed(() =>
    this.mode() === 'edit' ? gridStackEditModeOptions : gridStackViewModeOptions
  );

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
    }
  ];

  constructor() {
    this.loadLayout();

    // If no layout is loaded, add a sample layout for testing
    if (this.widgets().length === 0) {
      this.addSampleLayout();
    }
  }

  /**
   * Handle date filter change
   */
  onDateFilterChange(value: string): void {
    this.globalFilterValue.update(v => ({ ...v, dateFilter: value }));
    this.onGlobalFilterChange();
  }

  /**
   * Handle trending filter change
   */
  onTrendingFilterChange(value: string): void {
    this.globalFilterValue.update(v => ({ ...v, trending: value }));
    this.onGlobalFilterChange();
  }

  /**
   * Handle global filter changes
   * Updates the global filter value which propagates to all widgets
   * Important: We need to create a new object reference to trigger change detection
   */
  onGlobalFilterChange(): void {
    // Create a new object reference to trigger change detection in GridStackComponent
    this.globalFilterValue.set({ ...this.globalFilterValue() });
    console.log('Global filter changed:', this.globalFilterValue());
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.globalFilterValue.set({
      dateFilter: '',
      trending: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
  }

  /**
   * Toggle between edit and view modes
   */
  toggleMode(): void {
    this.mode.update(current => current === 'edit' ? 'view' : 'edit');
  }

  /**
   * Handle layout changes
   * Saves to localStorage for persistence
   */
  onLayoutChange(widgets: GridWidget[]): void {
    console.log('Layout changed:', widgets);
    this.widgets.set(widgets);
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
      this.widgets.set([]);
      this.saveLayout();
    }
  }

  /**
   * Publish the current page layout
   * Switches to view mode and shows a success toast notification
   */
  publishPage(): void {
    // Switch to view mode
    this.mode.set('view');

    // Save the layout
    this.saveLayout();

    // Show success toast notification
    this.toastService.success('Page published successfully! 🎉');

    console.log('Page published:', {
      mode: this.mode(),
      widgets: this.widgets().length,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add a sample layout for demonstration
   * Creates a dashboard with chart and data widgets to showcase PX Dashboard
   */
  addSampleLayout(): void {
    const currentMode = this.mode();
    this.widgets.set([
      // Top row: Two chart widgets
      {
        x: 0,
        y: 0,
        w: 6,
        h: 3,
        minW: 3,
        minH: 2,
        mode: currentMode,
        data: {
          id: 'sample-chart-1',
          instanceId: 'inst-1',
          name: 'chart-widget',
          displayName: 'Hello Widget',
          type: 'chart',
          component: 'HelloWidgetComponent',
          defaultWidth: 6,
          defaultHeight: 3,
          minWidth: 3,
          minHeight: 2,
          properties: {},
          instanceProperties: {}
        }
      },
      {
        x: 6,
        y: 0,
        w: 6,
        h: 3,
        minW: 3,
        minH: 2,
        mode: currentMode,
        data: {
          id: 'sample-chart-2',
          instanceId: 'inst-2',
          name: 'chart-widget',
          displayName: 'Trending Analysis',
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
      // Middle row: Data table widget
      {
        x: 0,
        y: 3,
        w: 12,
        h: 4,
        minW: 4,
        minH: 3,
        mode: currentMode,
        data: {
          id: 'sample-data-1',
          instanceId: 'inst-3',
          name: 'data-widget',
          displayName: 'Data Overview',
          type: 'data',
          component: 'DataWidgetComponent',
          defaultWidth: 12,
          defaultHeight: 4,
          minWidth: 4,
          minHeight: 3,
          properties: {},
          instanceProperties: {}
        }
      },
      // Bottom row: Hello widget for status/info
      {
        x: 0,
        y: 7,
        w: 4,
        h: 2,
        minW: 2,
        minH: 1,
        mode: currentMode,
        data: {
          id: 'sample-hello-1',
          instanceId: 'inst-4',
          name: 'hello-widget',
          displayName: 'Welcome',
          type: 'hello',
          component: 'HelloWidgetComponent',
          defaultWidth: 4,
          defaultHeight: 2,
          minWidth: 2,
          minHeight: 1,
          properties: {},
          instanceProperties: {}
        }
      }
    ]);
    this.saveLayout();
  }

  /**
   * Save layout to localStorage
   */
  private saveLayout(): void {
    try {
      localStorage.setItem('dnd-layout', JSON.stringify(this.widgets()));
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
        const loadedWidgets = JSON.parse(saved);
        const currentMode = this.mode();
        // Update mode for all widgets
        loadedWidgets.forEach((w: GridWidget) => w.mode = currentMode);
        this.widgets.set(loadedWidgets);
      }
    } catch (error) {
      console.error('Failed to load layout:', error);
    }
  }
}
