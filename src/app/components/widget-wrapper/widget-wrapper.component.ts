import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridItemHTMLElement } from 'gridstack';

import { BaseWidgetComponent, isOnGlobalFilterChanges } from '../../base/base-widget.component';
import { GridWidget } from '../../models';
import { GRID_STACK_WIDGET_CONFIG_TOKEN, GLOBAL_FILTER_VALUE_TOKEN } from '../../tokens/grid-stack-widget-config.token';
import { WIDGET_REGISTRY } from '../../widgets/widget-registry';
import { FallbackWidgetComponent } from '../../widgets/fallback-widget/fallback-widget.component';

/**
 * Extended GridItemHTMLElement with reference to WidgetWrapperComponent
 */
export interface GridStackWidgetNativeElement extends GridItemHTMLElement {
  gridStackWidgetComponent?: WidgetWrapperComponent;
}

/**
 * Widget Wrapper Component
 *
 * This component wraps individual widget instances and handles:
 * - Dynamic component loading
 * - Widget event subscriptions (remove, zoom, title/settings changes)
 * - Global filter propagation
 * - Mode switching (edit/view)
 *
 * The wrapper is created dynamically by the GridStack container
 * and receives its configuration via dependency injection tokens.
 */
@Component({
    selector: 'app-widget-wrapper',
    imports: [CommonModule],
    templateUrl: './widget-wrapper.component.html',
    styleUrls: ['./widget-wrapper.component.scss']
})
export class WidgetWrapperComponent implements OnInit, OnDestroy {
  // Angular 16: Use inject() for dependency injection
  private readonly elementRef = inject(ElementRef);
  public readonly globalFilterValue = inject(GLOBAL_FILTER_VALUE_TOKEN);
  public readonly gridWidgetOption = inject(GRID_STACK_WIDGET_CONFIG_TOKEN);

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public containerRef!: ViewContainerRef;

  @HostBinding('class.expanded')
  expanded = false;

  @Output() remove = new EventEmitter<void>();
  @Output() titleChange = new EventEmitter<string>();
  @Output() settingsChange = new EventEmitter<Record<string, unknown>>();

  /**
   * Reference to the wrapper component itself (set by add-remove handler)
   */
  componentRef?: ComponentRef<WidgetWrapperComponent>;

  /**
   * Reference to the actual widget content component
   */
  widgetComponentRef!: ComponentRef<BaseWidgetComponent>;

  /**
   * Get the native HTML element
   */
  get nativeElement(): GridStackWidgetNativeElement {
    return this.elementRef.nativeElement;
  }

  constructor() {
    // Store reference to this component on the native element
    this.nativeElement.gridStackWidgetComponent = this;
  }

  ngOnInit(): void {
    this.createComponent();
  }

  ngOnDestroy(): void {
    if (this.widgetComponentRef) {
      this.widgetComponentRef.destroy();
    }
  }

  /**
   * Create the widget content component dynamically
   */
  createComponent(): void {
    this.getWidgetContentComponent().then((componentType) => {
      // Create the widget component
      this.widgetComponentRef = this.containerRef!.createComponent(componentType);

      if (this.widgetComponentRef?.instance) {
        // Set inputs using setInput() for better change detection
        this.widgetComponentRef.setInput('mode', this.gridWidgetOption.mode ?? 'view');
        this.widgetComponentRef.setInput('widget', this.gridWidgetOption.data);
        this.widgetComponentRef.setInput('globalFilterValue', this.globalFilterValue);

        // Trigger onGlobalFilterChanges if widget implements it
        if (isOnGlobalFilterChanges(this.widgetComponentRef.instance)) {
          const change = new SimpleChange(undefined, this.globalFilterValue, true);
          this.widgetComponentRef.instance.onGlobalFilterChanges(change);
        }

        // Subscribe to widget events
        this.subscribeToWidgetEvents();
      }
    });
  }

  /**
   * Subscribe to all widget events and propagate them up
   */
  private subscribeToWidgetEvents(): void {
    const instance = this.widgetComponentRef.instance;

    instance.remove.subscribe(() => {
      this.remove.emit();
    });

    instance.zoomIn.subscribe(() => {
      this.zoomIn();
    });

    instance.zoomOut.subscribe(() => {
      this.zoomOut();
    });

    instance.titleChange.subscribe((title: string) => {
      this.titleChange.emit(title);
    });

    instance.settingsChange.subscribe((settings: Record<string, unknown>) => {
      this.settingsChange.emit(settings);
    });
  }

  /**
   * Zoom in (expand) the widget
   */
  zoomIn(): void {
    this.expanded = true;
  }

  /**
   * Zoom out (collapse) the widget
   */
  zoomOut(): void {
    this.expanded = false;
  }

  /**
   * Get the widget content component type
   * Supports local widgets from the registry and fallback widget
   */
  private getWidgetContentComponent(): Promise<Type<BaseWidgetComponent>> {
    return new Promise((resolve) => {
      if (!this.gridWidgetOption?.data) {
        resolve(FallbackWidgetComponent);
        return;
      }

      const { component } = this.gridWidgetOption.data;

      if (!component) {
        resolve(FallbackWidgetComponent);
        return;
      }

      // Look up widget in local registry
      const localComponentConfig = WIDGET_REGISTRY.find((item) => item.key === component);

      if (localComponentConfig) {
        resolve(localComponentConfig.component);
      } else {
        // Widget not found, use fallback
        console.warn(`Widget component '${component}' not found in registry. Using fallback.`);
        resolve(FallbackWidgetComponent);
      }
    });
  }

}
