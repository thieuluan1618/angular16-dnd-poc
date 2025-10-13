import { AfterViewInit, Directive, ElementRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridStack } from 'gridstack';
import { WidgetPrototype } from '../models';

/**
 * Draggable Widget Directive
 *
 * Makes widget prototypes in a sidebar draggable into the GridStack container.
 *
 * This directive:
 * - Sets GridStack attributes (gs-w, gs-h) on the element
 * - Stores widget metadata in data attributes (survives DOM cloning)
 * - Registers the element with GridStack's drag system
 * - Handles enable/disable states
 *
 * Usage:
 * ```html
 * <div
 *   class="widget-item draggable-widget"
 *   [appDraggableWidget]
 *   [disabled]="widget.disabled"
 *   [widget]="widget">
 *   {{ widget.displayName }}
 * </div>
 * ```
 *
 * Why data attributes?
 * When GridStack drags an element, it creates a DOM clone. Angular component
 * data doesn't survive cloning, so we store all necessary metadata in HTML
 * data attributes which do survive the cloning process.
 */
@Directive({
  selector: '[appDraggableWidget]',
  standalone: true
})
export class DraggableWidgetDirective implements OnChanges, AfterViewInit {
  // Angular 16: Use inject() for dependency injection
  private readonly elementRef = inject(ElementRef);

  /**
   * Whether dragging is disabled for this widget
   */
  @Input() disabled = false;

  /**
   * Widget prototype data
   */
  @Input() widget!: WidgetPrototype;

  private initialized = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      if (this.disabled) {
        this.setDisableStyle();
      } else {
        this.setEnableStyle();
      }
    }
  }

  ngAfterViewInit(): void {
    this.initialize();
  }

  /**
   * Initialize the draggable widget
   * Sets GridStack attributes and metadata, then registers with GridStack
   */
  private initialize(): void {
    if (this.disabled || !this.widget) {
      return;
    }

    const element = this.elementRef.nativeElement as HTMLElement;

    // Set GridStack size attributes
    element.setAttribute('gs-w', `${this.widget.defaultWidth}`);
    element.setAttribute('gs-h', `${this.widget.defaultHeight}`);

    // Store widget metadata in data attributes
    // These attributes survive DOM cloning when dragging
    element.setAttribute('data-id', `${this.widget.id}`);
    element.setAttribute('data-name', this.widget.name);
    element.setAttribute('data-title', this.widget.displayName);
    element.setAttribute('data-type', this.widget.type);
    element.setAttribute('data-entry-point', this.widget.entryPoint || '');
    element.setAttribute('data-component', this.widget.component);
    element.setAttribute('data-exposed-module', this.widget.exposedModule || '');
    element.setAttribute('data-default-width', `${this.widget.defaultWidth}`);
    element.setAttribute('data-min-width', `${this.widget.minWidth}`);
    element.setAttribute('data-default-height', `${this.widget.defaultHeight}`);
    element.setAttribute('data-min-height', `${this.widget.minHeight}`);

    // Register this element with GridStack's drag system
    GridStack.setupDragIn([element], {
      cancel: '.no-drag',        // Elements with this class won't trigger drag
      appendTo: 'body',           // Clone appends to body during drag
      helper: this.cloneElement.bind(this),  // Custom clone function
    });

    this.initialized = true;
  }

  /**
   * Clone the element for dragging
   * GridStack calls this to create the drag preview
   */
  private cloneElement(event: Event): HTMLElement {
    const target = event.target as HTMLElement;
    const element = target.cloneNode(true) as HTMLElement;
    return element;
  }

  /**
   * Apply disabled styles
   * Prevents dragging and shows visual feedback
   */
  private setDisableStyle(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    element.classList.add('no-drag', 'disabled');
  }

  /**
   * Remove disabled styles
   * Re-enables dragging
   */
  private setEnableStyle(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    element.classList.remove('no-drag', 'disabled');
  }
}
