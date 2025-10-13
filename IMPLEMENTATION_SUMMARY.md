# Drag-and-Drop Implementation Summary

This document provides an overview of the drag-and-drop widget system implementation for Angular 16.

## ✅ Implementation Status

All core components have been successfully implemented following Angular 16 best practices:

### 🎯 Core Features

- ✅ Standalone components (no NgModules)
- ✅ `inject()` function for dependency injection
- ✅ `DestroyRef` for lifecycle cleanup
- ✅ GridStack.js integration
- ✅ Edit and View modes
- ✅ Drag-and-drop from sidebar
- ✅ Widget resize functionality
- ✅ Dynamic component loading
- ✅ Global filter support
- ✅ Event propagation system

## 📁 File Structure

```
src/app/
├── base/
│   └── base-widget.component.ts          # Base class for all widgets
├── components/
│   ├── grid-stack/                       # Main GridStack container
│   │   ├── grid-stack.component.ts
│   │   ├── grid-stack.component.html
│   │   ├── grid-stack.component.scss
│   │   └── README.md
│   └── widget-wrapper/                   # Widget wrapper component
│       ├── widget-wrapper.component.ts
│       ├── widget-wrapper.component.html
│       └── widget-wrapper.component.scss
├── config/
│   └── grid-stack-options.ts             # GridStack configuration (edit/view modes)
├── directives/
│   └── draggable-widget.directive.ts     # Makes sidebar items draggable
├── models/
│   ├── widget.ts                         # Widget and WidgetPrototype interfaces
│   ├── grid-widget.ts                    # GridWidget type & event types
│   └── index.ts                          # Model exports
├── tokens/
│   └── grid-stack-widget-config.token.ts # DI tokens for widget config
├── utils/
│   └── add-remove-widget-handler.ts      # Widget creation handler
└── widgets/
    ├── hello-widget/                     # Example: Hello World widget
    │   ├── hello-widget.component.ts
    │   ├── hello-widget.component.html
    │   └── hello-widget.component.scss
    ├── chart-widget/                     # Example: Chart widget
    │   ├── chart-widget.component.ts
    │   ├── chart-widget.component.html
    │   └── chart-widget.component.scss
    └── widget-registry.ts                # Central widget registry
```

## 🔧 Key Components

### 1. GridStack Container (`components/grid-stack/`)

The main container component that wraps GridStack.js:

**Features:**
- Initializes GridStack with edit/view mode options
- Manages widget lifecycle (add, remove, move, resize)
- Handles event propagation to parent components
- Runs outside Angular zone for performance
- Dynamic background grid pattern in edit mode
- Empty state handling

**Angular 16 Patterns:**
- Standalone component
- `inject()` for DI: `NgZone`, `ChangeDetectorRef`, `ElementRef`, `DestroyRef`
- `DestroyRef.onDestroy()` for cleanup

### 2. Widget Wrapper (`components/widget-wrapper/`)

Wraps individual widget instances and handles dynamic loading:

**Features:**
- Dynamic component creation
- Widget event subscriptions (remove, zoom, title/settings changes)
- Global filter propagation
- Mode switching support

**Angular 16 Patterns:**
- Standalone component
- `inject()` for DI with injection tokens
- Dynamic component creation with custom injector

### 3. Draggable Directive (`directives/draggable-widget.directive.ts`)

Makes sidebar widgets draggable into the grid:

**Features:**
- Sets GridStack attributes (`gs-w`, `gs-h`)
- Stores widget metadata in data attributes (survives DOM cloning)
- Registers with GridStack's `setupDragIn()`
- Enable/disable states with visual feedback

**Angular 16 Patterns:**
- Standalone directive
- `inject()` for ElementRef

### 4. Base Widget Component (`base/base-widget.component.ts`)

Abstract base class that all widgets extend:

**Provides:**
- Standard inputs: `mode`, `widget`, `globalFilterValue`
- Standard outputs: `remove`, `zoomIn`, `zoomOut`, `titleChange`, `settingsChange`
- Optional `onGlobalFilterChanges()` lifecycle hook
- Generic `emitEvent()` method for custom events

### 5. Widget Registry (`widgets/widget-registry.ts`)

Central registry mapping widget component keys to component classes:

**Purpose:**
- Maps `component` string (from widget data) to actual component class
- Enables dynamic widget loading
- Easily extendable with new widgets

## 📦 Data Models

### Widget
```typescript
interface Widget {
  id: string;
  instanceId: string | null;
  name: string;
  displayName: string;
  type: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  properties: Record<string, unknown>;
  instanceProperties: Record<string, unknown>;
}
```

### WidgetPrototype
```typescript
interface WidgetPrototype {
  id: string;
  name: string;
  displayName: string;
  type: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  disabled?: boolean;
  icon?: string;
}
```

### GridWidget
```typescript
type GridWidget<T extends Widget = Widget> = GridStackWidget & {
  data: T;
  mode: 'view' | 'edit';
};
```

## 🎨 Example Widgets

### Hello World Widget
- Simple demonstration widget
- Shows widget properties and mode
- Edit mode actions (remove, zoom)
- Styled with header and content areas

### Chart Widget
- Demonstrates data visualization
- Pure CSS bar chart
- Interactive hover effects
- Settings and remove actions

## 🔄 Data Flow

### Adding a Widget (Drag from Sidebar)

1. User drags widget prototype from sidebar (tracked by `DraggableWidgetDirective`)
2. GridStack creates DOM clone with data attributes
3. User drops widget on grid
4. `droppedHandler()` fires in `GridStackComponent`
5. GridStack's clone is removed
6. Widget metadata extracted from data attributes
7. New `GridWidget` object created
8. `gridStack.addWidget()` called
9. `addOrRemoveWidgetHandler()` creates `WidgetWrapperComponent` with custom injector
10. `WidgetWrapperComponent` dynamically loads widget content from registry
11. `onChange` event emitted with updated layout

### Moving/Resizing a Widget

1. User drags/resizes widget
2. GridStack handles DOM manipulation
3. `dragStopHandler()` or `resizeStopHandler()` fires
4. Current widget positions retrieved via `gridStack.save()`
5. `onChange` event emitted with new layout
6. Parent component can save to backend/state

### Removing a Widget

1. User clicks remove button on widget
2. Widget emits `remove` event
3. `WidgetWrapperComponent` receives event
4. Calls `gridStack.removeWidget()`
5. `handleRemoved()` fires
6. `onChange` event emitted
7. Empty state checked and updated

### Global Filter Propagation

1. Parent component updates `[globalFilterValue]` input
2. `ngOnChanges` detects change
3. `onGlobalFilterValueChange()` iterates through all widgets
4. Uses `setInput()` to update each widget's `globalFilterValue`
5. Calls `onGlobalFilterChanges()` if widget implements it
6. Widgets can react to filter changes (e.g., filter data, update charts)

## 🚀 Next Steps

To complete the full application, you'll need to:

1. **Create a test page/component** that uses the GridStack container:
   - Import `GridStackComponent`
   - Set up widget prototypes
   - Implement drag-from-sidebar functionality
   - Handle layout change events

2. **Add persistence**:
   - Save widget layout to backend/localStorage
   - Load saved layouts on page load
   - Handle concurrent editing (if needed)

3. **Expand widget library**:
   - Create more widget types (tables, forms, maps, etc.)
   - Add to `WIDGET_REGISTRY`

4. **Add advanced features** (optional):
   - Widget settings dialog
   - Undo/redo functionality
   - Copy/paste widgets
   - Widget templates
   - Export/import layouts

## 📝 Usage Example

```typescript
import { Component } from '@angular/core';
import { GridStackComponent } from './components/grid-stack/grid-stack.component';
import { DraggableWidgetDirective } from './directives/draggable-widget.directive';
import { gridStackEditModeOptions } from './config/grid-stack-options';
import { GridWidget, WidgetPrototype } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GridStackComponent, DraggableWidgetDirective],
  template: `
    <div class="app-container">
      <aside class="sidebar">
        <h3>Available Widgets</h3>
        <div
          *ngFor="let widget of widgetPrototypes"
          class="widget-item draggable-widget"
          [appDraggableWidget]
          [disabled]="widget.disabled"
          [widget]="widget">
          {{ widget.displayName }}
        </div>
      </aside>

      <main class="content">
        <app-grid-stack
          [mode]="'edit'"
          [widgets]="widgets"
          [options]="gridStackOptions"
          (onChange)="onLayoutChange($event)">
        </app-grid-stack>
      </main>
    </div>
  `
})
export class AppComponent {
  gridStackOptions = gridStackEditModeOptions;
  widgets: GridWidget[] = [];

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
      minHeight: 1
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
      minHeight: 2
    }
  ];

  onLayoutChange(widgets: GridWidget[]): void {
    console.log('Layout changed:', widgets);
    this.widgets = widgets;
    // Save to backend/localStorage
  }
}
```

## 🎓 Key Learnings

### Angular 16 Migration Patterns

1. **Standalone Components**: All components are standalone, no NgModules needed
2. **inject() Function**: Used instead of constructor-based DI throughout
3. **DestroyRef**: Used for lifecycle cleanup instead of custom destroy services
4. **Signals**: Not used in this implementation, but could be added for reactive state

### GridStack Integration

1. **Zone Management**: GridStack operations run outside Angular zone for performance
2. **Data Attributes**: Used to preserve widget metadata during DOM cloning
3. **Custom Handler**: `addRemoveCB` callback creates Angular components dynamically
4. **Event Handling**: All GridStack events properly wrapped to run inside Angular zone

### Dynamic Component Loading

1. **Custom Injectors**: Created to pass widget configuration to dynamically created components
2. **InjectionTokens**: Used to provide widget config and global filter values
3. **ComponentRef**: Used to interact with dynamically created components
4. **setInput()**: Preferred method for setting inputs on dynamic components

## 📚 References

- [GridStack.js Documentation](https://gridstackjs.com/)
- [Angular 16 Documentation](https://v16.angular.io/)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- Reference Implementation: `../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md`

## 🐛 Known Limitations

1. **No Module Federation Support**: This POC uses local widgets only. Module Federation can be added later.
2. **No State Management**: No NgRx/signals for global state. Can be added when needed.
3. **Basic Styling**: Minimal CSS provided. Customize as needed.
4. **No Persistence**: Widget layouts are not saved. Add backend integration.

## ✨ Highlights

- **Type-Safe**: Full TypeScript support with strict typing
- **Performance**: Zone-optimized for smooth drag-and-drop
- **Extensible**: Easy to add new widgets and features
- **Modern**: Uses latest Angular 16 patterns and best practices
- **Well-Documented**: Comprehensive comments and documentation throughout
