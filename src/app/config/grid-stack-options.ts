import { GridStackOptions } from 'gridstack';

/**
 * GridStack options for edit/design mode
 * - Enables dragging and resizing
 * - Accepts widgets from sidebar (.draggable-widget class)
 * - Shows resize handles on all sides
 */
export const gridStackEditModeOptions: GridStackOptions = {
  column: 12,
  minRow: 4,
  animate: true,
  marginTop: 8,
  marginLeft: 8,
  marginBottom: 8,
  marginRight: 8,
  marginUnit: 'px',
  cellHeight: 'auto',
  float: false,
  disableDrag: false,
  disableResize: false,
  resizable: {
    autoHide: true,
    handles: 'e, se, s, sw, w'
  },
  acceptWidgets: '.draggable-widget',
  children: []
};

/**
 * GridStack options for view mode
 * - Disables dragging and resizing
 * - Static display only
 */
export const gridStackViewModeOptions: GridStackOptions = {
  column: 12,
  minRow: 4,
  animate: true,
  marginTop: 8,
  marginLeft: 8,
  marginBottom: 8,
  marginRight: 8,
  marginUnit: 'px',
  cellHeight: 'auto',
  float: false,
  disableDrag: true,
  disableResize: true,
  acceptWidgets: false,
  children: []
};
