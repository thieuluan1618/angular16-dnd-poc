import { GridStackWidget } from 'gridstack';
import { Widget } from './widget';

/**
 * GridWidget extends GridStack's GridStackWidget with custom data
 * This combines GridStack's layout properties (x, y, w, h) with our Widget data
 */
export type GridWidget<T extends Widget = Widget> = GridStackWidget & {
  data: T;
  mode: 'view' | 'edit';
};

/**
 * Event emitted when a widget's title changes
 */
export type WidgetTitleChangeEvent = {
  id: string;
  title: string;
};

/**
 * Event emitted when a widget's settings change
 */
export type WidgetSettingsChangeEvent = {
  id: string;
  settings: Record<string, unknown>;
};
