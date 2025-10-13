import { InjectionToken } from '@angular/core';
import { GridWidget, GlobalFilterValue } from '../models';

/**
 * Injection token for GridWidget configuration
 * Used to pass widget data to dynamically created widget wrapper components
 */
export const GRID_STACK_WIDGET_CONFIG_TOKEN = new InjectionToken<GridWidget>('grid stack widget config');

/**
 * Injection token for global filter value
 * Used to propagate filter values across all widgets
 */
export const GLOBAL_FILTER_VALUE_TOKEN = new InjectionToken<GlobalFilterValue>('global filter value');
