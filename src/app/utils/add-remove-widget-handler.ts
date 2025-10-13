import { Injector } from '@angular/core';
import { GridStackNativeElement } from '../components/grid-stack/grid-stack.component';
import { WidgetWrapperComponent } from '../components/widget-wrapper/widget-wrapper.component';
import { GridWidget } from '../models';
import { GRID_STACK_WIDGET_CONFIG_TOKEN, GLOBAL_FILTER_VALUE_TOKEN } from '../tokens/grid-stack-widget-config.token';

/**
 * Handler function for adding or removing widgets from the GridStack
 *
 * This function is called by GridStack when widgets are added or removed.
 * It creates Angular components dynamically with proper dependency injection.
 *
 * @param host - The GridStack container element
 * @param gridStackWidget - The widget data
 * @param isAdding - Whether we're adding (true) or removing (false)
 * @param isGrid - Whether this is a sub-grid (we don't support sub-grids)
 * @returns The created element or undefined
 */
export function addOrRemoveWidgetHandler(
  host: GridStackNativeElement | HTMLElement,
  gridStackWidget: GridWidget,
  isAdding: boolean,
  isGrid: boolean
): HTMLElement | undefined {
  console.log('[addOrRemoveWidgetHandler] Called:', { isAdding, isGrid, widget: gridStackWidget });

  if (isAdding) {
    return addGridStackWidgetHandler(host, gridStackWidget, isGrid);
  }

  return removeGridStackWidgetHandler(gridStackWidget);
}

/**
 * Add a widget to the grid
 *
 * Creates a WidgetWrapperComponent with the proper injector context,
 * subscribes to its events, and returns the native element.
 */
function addGridStackWidgetHandler(
  host: GridStackNativeElement | HTMLElement,
  gridWidget: GridWidget,
  isGrid: boolean
): HTMLElement | undefined {
  if (!host) {
    return undefined;
  }

  // We only support one level of grid (no sub-grids)
  if (isGrid) {
    return undefined;
  }

  const gridStackComponent = (host as GridStackNativeElement).gridStackComponent;

  if (!gridStackComponent || !gridStackComponent.containerRef) {
    return undefined;
  }

  // Create an injector with the widget configuration
  const injector = Injector.create({
    providers: [
      { provide: GRID_STACK_WIDGET_CONFIG_TOKEN, useValue: gridWidget },
      { provide: GLOBAL_FILTER_VALUE_TOKEN, useValue: gridStackComponent.globalFilterValue || {} },
    ],
  });

  // Create the widget wrapper component
  const widgetWrapperComponentRef = gridStackComponent.containerRef.createComponent(WidgetWrapperComponent, {
    injector,
  });

  const widgetWrapperInstance = widgetWrapperComponentRef?.instance;

  if (!widgetWrapperInstance) {
    return undefined;
  }

  // Store component reference
  widgetWrapperInstance.componentRef = widgetWrapperComponentRef;

  // Subscribe to resize events and propagate to widget
  gridStackComponent.onResizeStart.subscribe((event) => {
    if (widgetWrapperInstance.widgetComponentRef?.instance) {
      widgetWrapperInstance.widgetComponentRef.instance.emitEvent('resizeStart', event);
    }
  });

  gridStackComponent.onResize.subscribe((event) => {
    if (widgetWrapperInstance.widgetComponentRef?.instance) {
      widgetWrapperInstance.widgetComponentRef.instance.emitEvent('resize', event);
    }
  });

  gridStackComponent.onResizeStop.subscribe((event) => {
    if (widgetWrapperInstance.widgetComponentRef?.instance) {
      widgetWrapperInstance.widgetComponentRef.instance.emitEvent('resizeStop', event);
    }
  });

  // Subscribe to widget remove event
  widgetWrapperInstance.remove.subscribe(() => {
    if (gridStackComponent.gridStack) {
      gridStackComponent.gridStack.removeWidget(widgetWrapperInstance.nativeElement);
      gridStackComponent.onChange.emit(gridStackComponent.currentWidgets);
    }
  });

  // Subscribe to title change event
  widgetWrapperInstance.titleChange.subscribe((title) => {
    if (gridStackComponent.mode === 'view') {
      gridStackComponent.widgetTitleChange.emit({
        id: gridWidget.data.instanceId || gridWidget.data.id,
        title
      });
    }
  });

  // Subscribe to settings change event
  widgetWrapperInstance.settingsChange.subscribe((settings) => {
    if (gridStackComponent.mode === 'view') {
      gridStackComponent.widgetSettingsChange.emit({
        id: gridWidget.data.instanceId || gridWidget.data.id,
        settings
      });
    }
  });

  return widgetWrapperInstance.nativeElement;
}

/**
 * Remove a widget from the grid
 *
 * Currently not implemented as GridStack handles removal automatically.
 * Return undefined to let GridStack use its default removal behavior.
 */
function removeGridStackWidgetHandler(gridStackWidget: GridWidget): HTMLElement | undefined {
  return undefined;
}
