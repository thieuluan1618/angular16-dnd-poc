import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridHTMLElement, GridStack, GridStackNode, GridStackOptions } from 'gridstack';

import { GlobalFilterValue, GridWidget, Widget, WidgetSettingsChangeEvent, WidgetTitleChangeEvent } from '../../models';
import { addOrRemoveWidgetHandler } from '../../utils/add-remove-widget-handler';
import { GridStackWidgetNativeElement } from '../widget-wrapper/widget-wrapper.component';
import { isOnGlobalFilterChanges } from '../../base/base-widget.component';

/**
 * Extended GridHTMLElement with reference to the GridStackComponent
 */
export interface GridStackNativeElement extends GridHTMLElement {
  gridStackComponent?: GridStackComponent;
}

/**
 * Main GridStack container component
 *
 * This component wraps GridStack.js and provides:
 * - Drag-and-drop functionality
 * - Edit vs View modes
 * - Widget lifecycle management
 * - Event propagation
 * - Global filter support
 *
 * Usage:
 * ```html
 * <app-grid-stack
 *   [mode]="'edit'"
 *   [widgets]="widgets"
 *   [options]="gridStackOptions"
 *   (onChange)="onLayoutChange($event)">
 * </app-grid-stack>
 * ```
 */
@Component({
  selector: 'app-grid-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid-stack.component.html',
  styleUrls: ['./grid-stack.component.scss']
})
export class GridStackComponent implements OnChanges, OnInit, AfterViewInit {
  // Angular 16: Use inject() instead of constructor DI
  private readonly zone = inject(NgZone);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('container', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  @Input() mode: 'edit' | 'view' = 'view';
  @Input() widgets: Array<GridWidget> = [];
  @Input() globalFilterValue: GlobalFilterValue = {};

  @Output() onInit = new EventEmitter<GridWidget[]>();
  @Output() onChange = new EventEmitter<GridWidget[]>();
  @Output() onDrag = new EventEmitter<GridWidget | null>();
  @Output() onDragStart = new EventEmitter<GridWidget | null>();
  @Output() onDragStop = new EventEmitter<GridWidget | null>();
  @Output() onRemoved = new EventEmitter<GridWidget | null>();
  @Output() onResize = new EventEmitter<GridWidget[]>();
  @Output() onResizeStart = new EventEmitter<GridWidget[]>();
  @Output() onResizeStop = new EventEmitter<GridWidget[]>();
  @Output() callToAction = new EventEmitter<void>();
  @Output() widgetTitleChange = new EventEmitter<WidgetTitleChangeEvent>();
  @Output() widgetSettingsChange = new EventEmitter<WidgetSettingsChangeEvent>();

  isEmpty = false;

  private _options?: GridStackOptions;
  private _gridStack?: GridStack;
  private _initialized = false;
  private _rendering = false;

  constructor() {
    // Store reference to this component on the native element
    this.nativeElement.gridStackComponent = this;
  }

  @HostBinding('class.edit')
  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  /**
   * Get the current GridStack options
   */
  public get options(): GridStackOptions {
    return (this.gridStack?.opts as GridStackOptions) || this._options || {};
  }

  /**
   * Set GridStack options
   */
  @Input()
  public set options(val: GridStackOptions) {
    this._options = val;
  }

  /**
   * Get the GridStack instance
   */
  get gridStack(): GridStack | undefined {
    return this._gridStack;
  }

  /**
   * Get the native HTML element
   */
  public get nativeElement(): GridStackNativeElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Get current widget positions and data
   */
  public get currentWidgets(): Array<GridWidget> {
    if (!this.gridStack) {
      return [];
    }

    return (this.gridStack.save(false, false) as Array<GridWidget>).map((item) => {
      return {
        ...item,
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.onModeChange(changes['mode']);
    }

    if (changes['options'] && !changes['options'].firstChange) {
      this.onOptionsChange(changes['options']);
    }

    if (changes['widgets']) {
      this.rerenderWidgets();
    }

    if (changes['globalFilterValue']) {
      this.onGlobalFilterValueChange(changes['globalFilterValue']);
    }
  }

  ngOnInit(): void {
    this.initialGridStack();
    this.checkEmpty();
  }

  /**
   * Handle mode changes (edit <-> view)
   * Updates GridStack options to enable/disable drag and resize
   */
  private onModeChange(change: SimpleChange): void {
    if (!this._initialized || !this.gridStack) {
      return;
    }

    const isEditMode = change.currentValue === 'edit';

    this.zone.runOutsideAngular(() => {
      // Update GridStack options based on mode
      this.gridStack!.setStatic(!isEditMode);

      // Update individual widget properties
      if (isEditMode) {
        this.gridStack!.enableMove(true);
        this.gridStack!.enableResize(true);
      } else {
        this.gridStack!.enableMove(false);
        this.gridStack!.enableResize(false);
      }
    });

    // Update widget modes
    this.updateWidgetModes(change.currentValue);

    // Recalculate background (only shown in edit mode)
    this.calculateBackgroundSize();
  }

  /**
   * Update all widget modes when parent mode changes
   * Propagates the mode change to all widget wrapper components
   */
  private updateWidgetModes(mode: 'edit' | 'view'): void {
    if (!this.gridStack) {
      return;
    }

    const gridItems = this.gridStack.getGridItems();
    if (!gridItems?.length) {
      return;
    }

    gridItems.forEach((item: GridStackWidgetNativeElement) => {
      const widgetWrapperComponentRef = item.gridStackWidgetComponent?.widgetComponentRef;
      if (widgetWrapperComponentRef) {
        widgetWrapperComponentRef.setInput('mode', mode);
      }
    });
  }

  /**
   * Handle options changes
   * Updates GridStack configuration when options input changes
   */
  private onOptionsChange(change: SimpleChange): void {
    if (!this._initialized || !this.gridStack) {
      return;
    }

    const newOptions = change.currentValue as GridStackOptions;

    this.zone.runOutsideAngular(() => {
      // Update GridStack options
      if (newOptions.disableDrag !== undefined) {
        this.gridStack!.enableMove(!newOptions.disableDrag);
      }
      if (newOptions.disableResize !== undefined) {
        this.gridStack!.enableResize(!newOptions.disableResize);
      }
      if (newOptions.acceptWidgets !== undefined) {
        this.gridStack!.setStatic(newOptions.disableDrag === true);
      }
    });
  }

  ngAfterViewInit(): void {
    // Observe container size changes to update background grid and recalculate cellHeight
    const resizeObserver = new ResizeObserver(() => {
      this.calculateBackgroundSize();
      this.updateCellHeight();
    });
    resizeObserver.observe(this.elementRef.nativeElement);

    // Cleanup observer on destroy
    this.destroyRef.onDestroy(() => {
      resizeObserver.disconnect();
    });
  }

  /**
   * Update cellHeight dynamically when container size changes
   * Ensures cells remain proportional after window resize
   */
  private updateCellHeight(): void {
    if (!this.gridStack) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const containerWidth = this.elementRef.nativeElement.clientWidth;
      const columnWidth = containerWidth / 12;

      // Update GridStack's cellHeight
      this.gridStack.cellHeight(columnWidth - 8);
    });
  }

  /**
   * Initialize GridStack instance with options and event handlers
   */
  private initialGridStack(): void {
    if (!this._options) {
      return;
    }

    // Calculate dynamic cellHeight based on container width
    const containerWidth = this.elementRef.nativeElement.clientWidth;
    const columnWidth = containerWidth / 12;

    // Set cellHeight to match column width (accounting for margins will be handled by GridStack)
    const dynamicCellHeight = columnWidth; // Subtract margin to account for spacing

    // Override the cellHeight with calculated value
    const optionsWithDynamicHeight = {
      ...this._options,
      cellHeight: dynamicCellHeight
    };

    // Set the global addRemoveCB handler for GridStack
    // This must be set before calling GridStack.init()
    GridStack.addRemoveCB = addOrRemoveWidgetHandler;

    // Run GridStack initialization outside Angular zone for better performance
    this.zone.runOutsideAngular(() => {
      this._gridStack = GridStack.init(optionsWithDynamicHeight, this.nativeElement);

      if (this._gridStack) {
        // Register all GridStack event handlers
        this.gridStack!
          .on('drag', this.dragHandler.bind(this))
          .on('dragstart', this.dragStartHandler.bind(this))
          .on('dragstop', this.dragStopHandler.bind(this))
          .on('dropped', this.droppedHandler.bind(this))
          .on('removed', this.handleRemoved.bind(this))
          .on('resizestart', this.resizeStartHandler.bind(this))
          .on('resize', this.resizeHandler.bind(this))
          .on('resizestop', this.resizeStopHandler.bind(this));

        this._initialized = true;
        this.renderWidgets();

        // Run change detection and emit onInit inside Angular zone
        this.zone.run(() => {
          this.onInit.emit(this.currentWidgets);
        });

        delete this._options; // GridStack has the options now
      }
    });
  }

  /**
   * Initial render of widgets
   */
  private renderWidgets(): void {
    if (this._initialized && this.gridStack) {
      const widgets = this.widgets ?? [];
      this.gridStack.load(widgets);
      this.checkEmpty();
    }
  }

  /**
   * Re-render widgets when input changes
   * Compares JSON to avoid unnecessary re-renders
   */
  private rerenderWidgets(): void {
    if (!this._initialized || !this.gridStack) {
      return;
    }

    const hasChange = JSON.stringify(this.widgets) !== JSON.stringify(this.currentWidgets);

    if (!hasChange) {
      return;
    }

    this._rendering = true;
    this.gridStack.removeAll(true, true);
    if (this.widgets?.length) {
      this.gridStack.load(this.widgets);
    }
    this.checkEmpty();
    this._rendering = false;
  }

  /**
   * Event Handlers
   */

  private dragHandler(): void {
    this.zone.run(() => {
      this.onDrag.emit(null);
    });
  }

  private dragStartHandler(event: Event, element: GridStackNativeElement): void {
    this.zone.run(() => {
      this.onDragStart.emit(null);
    });
  }

  private dragStopHandler(): void {
    this.zone.run(() => {
      this.onDragStop.emit(null);
      this.onChange.emit(this.currentWidgets);
    });
  }

  private handleRemoved(): void {
    // Ignore remove events during re-rendering
    if (this._rendering) {
      return;
    }

    this.zone.run(() => {
      this.onRemoved.emit(null);
      this.onChange.emit(this.currentWidgets);
      this.checkEmpty();
    });
  }

  private resizeStartHandler(event: Event): void {
    this.zone.run(() => {
      this.onResizeStart.emit(event as any);
    });
  }

  private resizeHandler(event: Event): void {
    this.zone.run(() => {
      this.onResize.emit(event as any);
    });
  }

  private resizeStopHandler(event: Event): void {
    this.zone.run(() => {
      this.onResizeStop.emit(event as any);
      this.onChange.emit(this.currentWidgets);
    });
  }

  /**
   * Handle widget dropped from sidebar
   *
   * Called when a widget is dragged from the sidebar and dropped onto the grid.
   * GridStack creates a DOM clone, which we remove and replace with a proper Angular component.
   *
   * @param event - The drop event
   * @param previousNode - Previous widget node (if dragged from another grid)
   * @param newNode - The new widget node that was dropped
   */
  private droppedHandler(event: Event, previousNode: GridStackNode, newNode: GridStackNode): void {
    if (!this.gridStack) {
      return;
    }

    this.zone.run(() => {
      /**
       * GridStack creates a DOM clone when dropping from sidebar.
       * We need to:
       * 1. Remove the clone
       * 2. Extract widget metadata from data attributes
       * 3. Create a proper widget instance
       * 4. Add it back to GridStack
       */

      this.gridStack!.removeWidget(newNode.el!, true, false);

      const { x, y, w, h } = newNode;
      const dataSet = (newNode.el as HTMLElement).dataset;

      // Create widget instance from prototype data
      const widget: Widget = {
        id: dataSet['id']!,
        instanceId: null,
        name: dataSet['name']!,
        displayName: dataSet['title']!,
        type: dataSet['type']!,
        entryPoint: dataSet['entryPoint'],
        component: dataSet['component']!,
        exposedModule: dataSet['exposedModule'],
        defaultWidth: parseInt(dataSet['defaultWidth']!),
        defaultHeight: parseInt(dataSet['defaultHeight']!),
        minWidth: parseInt(dataSet['minWidth']!),
        minHeight: parseInt(dataSet['minHeight']!),
        properties: {},
        instanceProperties: {},
      };

      const gridWidget: GridWidget = {
        x,
        y,
        w,
        h,
        minW: widget.minWidth,
        minH: widget.minHeight,
        mode: 'edit',
        data: widget,
      };

      this.gridStack!.addWidget(gridWidget);

      this.onChange.emit(this.currentWidgets);
      this.checkEmpty();
      // Recalculate background when widgets are added
      setTimeout(() => this.calculateBackgroundSize(), 0);
    });
  }

  /**
   * Check if grid is empty and update empty state
   */
  private checkEmpty(): void {
    if (!this.gridStack) {
      return;
    }

    this.isEmpty = this.gridStack.engine.nodes.length === 0;
  }

  /**
   * Calculate and apply background grid pattern for edit mode
   * Creates a visual grid that matches the 12-column layout
   */
  private calculateBackgroundSize(): void {
    this.zone.runOutsideAngular(() => {
      if (this.elementRef.nativeElement && this.isEditMode) {
        const width = this.elementRef.nativeElement.clientWidth;
        const size = width / 12;
        const bgSize = `${size}px ${size}px`;
        const bgImage = `linear-gradient(90deg, rgb(255, 255, 255) 0px, rgb(255, 255, 255) 16px, rgba(232, 232, 232, 0) 16px, rgba(232, 232, 232, 0) ${size}px), linear-gradient(0deg, rgb(255, 255, 255) 0px, rgb(255, 255, 255) 16px, rgba(232, 232, 232, 0) 16px, rgba(232, 232, 232, 0) ${size}px)`;
        this.elementRef.nativeElement.style.setProperty('background-size', bgSize);
        this.elementRef.nativeElement.style.setProperty('background-image', bgImage);

        console.log(this.elementRef.nativeElement);

        this.cd.detectChanges();
      }
    });
  }

  /**
   * Handle global filter value changes
   * Propagates filter changes to all widget instances
   */
  private onGlobalFilterValueChange(change: SimpleChange): void {
    if (!this.gridStack) {
      return;
    }

    const gridItems = this.gridStack.getGridItems();
    if (!gridItems?.length) {
      return;
    }

    gridItems.forEach((item: GridStackWidgetNativeElement) => {
      const widgetWrapperComponentRef = item.gridStackWidgetComponent?.widgetComponentRef;
      if (widgetWrapperComponentRef) {
        const widgetComponent = widgetWrapperComponentRef.instance;
        if (isOnGlobalFilterChanges(widgetComponent)) {
          widgetWrapperComponentRef.setInput('globalFilterValue', change.currentValue);
          widgetComponent.onGlobalFilterChanges(change);
        }
      }
    });
  }
}
