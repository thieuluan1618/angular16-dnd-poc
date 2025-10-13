/**
 * Base Widget interface
 * Represents the core data structure for a widget
 */
export interface Widget {
  id: string;
  instanceId: string | null;
  name: string;
  displayName: string;
  type: string;
  entryPoint?: string;
  component: string;
  exposedModule?: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  properties: Record<string, unknown>;
  instanceProperties: Record<string, unknown>;
}

/**
 * Widget prototype - represents a template/blueprint for creating widget instances
 */
export interface WidgetPrototype {
  id: string;
  name: string;
  displayName: string;
  type: string;
  component: string;
  entryPoint?: string;
  exposedModule?: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  disabled?: boolean;
  icon?: string;
}

/**
 * Global filter value type
 * Used to propagate filter values across all widgets
 */
export type GlobalFilterValue = Record<string, unknown>;
