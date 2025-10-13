import { Type } from '@angular/core';
import { BaseWidgetComponent } from '../base/base-widget.component';

/**
 * Widget registry configuration
 */
export interface WidgetRegistryEntry {
  /**
   * Unique key to identify the widget component
   * Must match the 'component' field in Widget data
   */
  key: string;

  /**
   * The widget component class
   */
  component: Type<BaseWidgetComponent>;

  /**
   * Optional display name for the widget
   */
  displayName?: string;
}

/**
 * Central registry for all available widget components
 *
 * Add your widget components here to make them available in the grid.
 *
 * Example:
 * ```typescript
 * import { HelloWidgetComponent } from './hello-widget/hello-widget.component';
 *
 * export const WIDGET_REGISTRY: WidgetRegistryEntry[] = [
 *   {
 *     key: 'HelloWidgetComponent',
 *     component: HelloWidgetComponent,
 *     displayName: 'Hello World Widget'
 *   }
 * ];
 * ```
 */
import { HelloWidgetComponent } from './hello-widget/hello-widget.component';
import { ChartWidgetComponent } from './chart-widget/chart-widget.component';

export const WIDGET_REGISTRY: WidgetRegistryEntry[] = [
  {
    key: 'HelloWidgetComponent',
    component: HelloWidgetComponent,
    displayName: 'Hello World Widget'
  },
  {
    key: 'ChartWidgetComponent',
    component: ChartWidgetComponent,
    displayName: 'Chart Widget'
  }
];
