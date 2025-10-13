# GridStack Container Component

The main drag-and-drop container component built with GridStack.js and Angular 16.

## Features

- ✅ Standalone component (Angular 16)
- ✅ Uses `inject()` for dependency injection
- ✅ Uses `takeUntilDestroyed()` for cleanup via `DestroyRef`
- ✅ Edit and View modes
- ✅ Drag-and-drop from sidebar
- ✅ Resize widgets
- ✅ Event propagation
- ✅ 12-column responsive grid
- ✅ Empty state handling
- ✅ Background grid pattern in edit mode

## Usage Example

```typescript
import { Component } from '@angular/core';
import { GridStackComponent } from './components/grid-stack/grid-stack.component';
import { gridStackEditModeOptions } from './config/grid-stack-options';
import { GridWidget } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GridStackComponent],
  template: `
    <app-grid-stack
      [mode]="mode"
      [widgets]="widgets"
      [options]="gridStackOptions"
      (onChange)="onLayoutChange($event)"
      (onDragStop)="onDragStop($event)"
      (onResizeStop)="onResizeStop($event)">
    </app-grid-stack>
  `
})
export class AppComponent {
  mode: 'edit' | 'view' = 'edit';
  gridStackOptions = gridStackEditModeOptions;
  widgets: GridWidget[] = [];

  onLayoutChange(widgets: GridWidget[]): void {
    console.log('Layout changed:', widgets);
    this.widgets = widgets;
  }

  onDragStop(widget: GridWidget | null): void {
    console.log('Drag stopped:', widget);
  }

  onResizeStop(widgets: GridWidget[]): void {
    console.log('Resize stopped:', widgets);
  }
}
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `mode` | `'edit' \| 'view'` | `'view'` | Display mode - 'edit' enables drag/resize, 'view' is static |
| `widgets` | `GridWidget[]` | `[]` | Array of widgets to display |
| `options` | `GridStackOptions` | `undefined` | GridStack configuration options |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `onInit` | `EventEmitter<GridWidget[]>` | Emitted when GridStack initializes |
| `onChange` | `EventEmitter<GridWidget[]>` | Emitted when layout changes (drag/resize/add/remove) |
| `onDrag` | `EventEmitter<GridWidget \| null>` | Emitted during drag |
| `onDragStart` | `EventEmitter<GridWidget \| null>` | Emitted when drag starts |
| `onDragStop` | `EventEmitter<GridWidget \| null>` | Emitted when drag stops |
| `onRemoved` | `EventEmitter<GridWidget \| null>` | Emitted when widget is removed |
| `onResize` | `EventEmitter<GridWidget[]>` | Emitted during resize |
| `onResizeStart` | `EventEmitter<GridWidget[]>` | Emitted when resize starts |
| `onResizeStop` | `EventEmitter<GridWidget[]>` | Emitted when resize stops |

## Implementation Details

### Angular 16 Patterns Used

1. **Standalone Component**
   ```typescript
   @Component({
     selector: 'app-grid-stack',
     standalone: true,
     imports: [CommonModule],
     // ...
   })
   ```

2. **Inject Function**
   ```typescript
   private readonly zone = inject(NgZone);
   private readonly cd = inject(ChangeDetectorRef);
   private readonly elementRef = inject(ElementRef);
   private readonly destroyRef = inject(DestroyRef);
   ```

3. **DestroyRef for Cleanup**
   ```typescript
   this.destroyRef.onDestroy(() => {
     resizeObserver.disconnect();
   });
   ```

### Zone Management

GridStack operations run outside Angular's zone for better performance:

```typescript
this.zone.runOutsideAngular(() => {
  this._gridStack = GridStack.init(this._options, this.nativeElement);
  // ... GridStack operations
});

// Events run inside zone to trigger change detection
this.zone.run(() => {
  this.onDragStop.emit(null);
  this.onChange.emit(this.currentWidgets);
});
```

### Background Grid Pattern

In edit mode, a visual grid pattern is generated dynamically:

- 12-column layout
- Scales with container width
- Updates on resize
- Provides visual feedback for widget placement

### Empty State

When no widgets exist in edit mode, an empty state message is displayed to guide users.

## Next Steps

To complete the drag-and-drop system, you'll need to implement:

1. **Widget Wrapper Component** - Wraps individual widget content
2. **Draggable Directive** - Makes sidebar items draggable
3. **Widget Content Components** - The actual widget implementations

See the reference documentation:
- `../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md`
- `../mfe.custom-page/src/modules/common/grid-stack/`
