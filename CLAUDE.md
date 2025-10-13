# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Angular 16.2.0** proof-of-concept (POC) application demonstrating a drag-and-drop widget system using **GridStack.js**. The implementation follows modern Angular 16 patterns including standalone components, the `inject()` function, and `takeUntilDestroyed()`.

## Reference Implementation

This POC is based on the Angular 15 implementation in the parent project (`../mfe.custom-page`). **IMPORTANT:** Always refer to the reference documentation before implementing features:

- **[../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md](../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md)** - Complete implementation guide with code examples and migration patterns for Angular 16.2.12
- **[../mfe.custom-page/CLAUDE.md](../mfe.custom-page/CLAUDE.md)** - Reference project architecture
- **Reference source code:** `../mfe.custom-page/src/modules/common/grid-stack/`

## Development Commands

```bash
# Start development server (port 4200)
yarn start

# Build for production
yarn build

# Run tests
yarn test

# Build and watch for changes
yarn watch
```

## Key Dependencies

- **@angular/core**: ^16.2.0 - Angular framework
- **@angular/cdk**: ^16.2.12 - Angular Component Dev Kit (for drag-drop utilities)
- **gridstack**: ^10.3.1 - Drag-and-drop grid layout library
- **rxjs**: ~7.8.0 - Reactive programming
- **typescript**: ~5.1.3 - TypeScript compiler

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── grid-stack/          # Main GridStack container (standalone)
│   │   ├── widget-wrapper/      # Individual widget wrapper
│   │   └── draggable/           # Draggable directive
│   ├── models/                  # TypeScript interfaces
│   ├── services/                # Angular services
│   ├── app.component.*          # Root component
│   └── app-routing.module.ts    # Routing configuration
├── assets/                      # Static assets
└── styles.scss                  # Global styles (includes GridStack CSS)
```

## Angular 16 Patterns to Use

### 1. Standalone Components

All new components should be standalone:

```typescript
@Component({
  selector: 'app-grid-stack',
  standalone: true,
  imports: [CommonModule, FormsModule, /* other imports */],
  templateUrl: './grid-stack.component.html',
  styleUrls: ['./grid-stack.component.scss']
})
export class GridStackComponent { }
```

### 2. Inject Function (Not Constructor DI)

Use the `inject()` function for dependency injection:

```typescript
import { Component, inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({ /* ... */ })
export class GridStackComponent {
  private cd = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private elementRef = inject(ElementRef);
}
```

### 3. takeUntilDestroyed() for Cleanup

Use Angular 16's built-in operator instead of custom destroy services:

```typescript
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class GridStackComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.someObservable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(/* ... */);
  }
}
```

### 4. Required Inputs

Use the `required` flag for mandatory inputs:

```typescript
@Input({ required: true }) mode!: 'edit' | 'view';
@Input({ required: true }) widgets!: GridWidget[];
```

### 5. Signals (Optional)

Consider using signals for reactive state:

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({ /* ... */ })
export class GridStackComponent {
  widgets = signal<GridWidget[]>([]);
  isEmpty = computed(() => this.widgets().length === 0);

  addWidget(widget: GridWidget) {
    this.widgets.update(w => [...w, widget]);
  }
}
```

## Core Implementation Components

### 1. GridStack Container Component

**Location:** `src/app/components/grid-stack/`

Main wrapper component that:
- Initializes GridStack.js with options
- Manages widget lifecycle (add, remove, move, resize)
- Handles edit vs view modes
- Propagates events to parent components
- Supports global filtering across widgets

**Reference:** `../mfe.custom-page/src/modules/common/grid-stack/grid-stack/grid-stack.component.ts`

### 2. Widget Wrapper Component

**Location:** `src/app/components/widget-wrapper/`

Wraps individual widget instances:
- Dynamically loads widget content components
- Handles widget-specific events (remove, zoom, settings)
- Manages widget inputs (mode, data, filters)
- Supports both local and remote widgets

**Reference:** `../mfe.custom-page/src/modules/common/grid-stack/grid-stack-widget/grid-stack-widget.component.ts`

### 3. Draggable Directive

**Location:** `src/app/components/draggable/`

Makes sidebar widgets draggable:
- Uses GridStack's `setupDragIn()` API
- Stores widget metadata in data attributes
- Handles enable/disable states
- Creates drag clones

**Reference:** `../mfe.custom-page/src/modules/common/grid-stack/draggable-widget.directive.ts`

### 4. Data Models

**Location:** `src/app/models/`

Core TypeScript interfaces:
- `GridWidget` - Extends GridStackWidget with custom data
- `Widget` - Base widget interface
- `WidgetPrototype` - Widget template/blueprint
- Event types (WidgetTitleChangeEvent, WidgetSettingsChangeEvent)

**Reference:** `../mfe.custom-page/src/modules/common/grid-stack/grid-stack-widget.ts`

## GridStack Configuration

GridStack options are defined per mode:

**Edit Mode** (drag and resize enabled):
```typescript
const gridStackEditOptions: GridStackOptions = {
  column: 12,
  cellHeight: 'auto',
  float: false,
  disableDrag: false,
  disableResize: false,
  resizable: { autoHide: true, handles: 'e, se, s, sw, w' },
  acceptWidgets: '.draggable-widget',
  margin: 8
};
```

**View Mode** (static display):
```typescript
const gridStackViewOptions: GridStackOptions = {
  column: 12,
  cellHeight: 'auto',
  float: false,
  disableDrag: true,
  disableResize: true,
  acceptWidgets: false,
  margin: 8
};
```

**Reference:** `../mfe.custom-page/src/modules/custom-page/constants/grid-stack-options.ts`

## Implementation Guidelines

### When Creating Components

1. **Read the reference implementation first** - Check the corresponding file in `../mfe.custom-page/src/modules/common/grid-stack/`
2. **Use standalone components** - No NgModules
3. **Use inject() function** - Not constructor DI
4. **Use takeUntilDestroyed()** - For observable cleanup
5. **Follow the same event flow** - As documented in DRAG_AND_DROP_IMPLEMENTATION.md
6. **Copy core logic carefully** - GridStack initialization, event handlers, widget loading

### Key Differences from Reference

- ✅ Standalone components instead of NgModule
- ✅ `inject()` instead of constructor injection
- ✅ `takeUntilDestroyed()` instead of DestroyService
- ✅ Optional: Use signals for reactive state
- ✅ Simpler setup (no Module Federation, no NgRx initially)

### What to Keep the Same

- ✅ GridStack initialization logic
- ✅ Event handling (drag, drop, resize, remove)
- ✅ Widget loading mechanism
- ✅ Data attribute storage for drag-and-drop
- ✅ Zone management for performance
- ✅ Background grid calculation

## Testing

- Use Jasmine + Karma (default Angular setup)
- Mock GridStack methods in unit tests
- Test component creation/destruction
- Test event emissions
- Integration tests for drag-and-drop behavior

## Common Issues & Solutions

### GridStack CSS Not Loading
- Ensure `@import 'gridstack/dist/gridstack.min.css';` is in `src/styles.scss`
- Check that gridstack package is installed

### Zone Issues
- GridStack operations should run outside Angular zone:
  ```typescript
  private zone = inject(NgZone);

  this.zone.runOutsideAngular(() => {
    // GridStack operations here
  });
  ```

### TypeScript Errors with GridStack
- GridStack has its own type definitions
- Import types from 'gridstack': `import { GridStack, GridStackOptions } from 'gridstack';`

## Next Steps for Implementation

1. Create models and interfaces (`src/app/models/`)
2. Implement GridStack container component (`src/app/components/grid-stack/`)
3. Implement widget wrapper component (`src/app/components/widget-wrapper/`)
4. Create draggable directive (`src/app/components/draggable/`)
5. Create example widgets for testing
6. Test edit and view modes
7. Add styling and polish

## Additional Notes

- This is a POC - focus on core functionality first
- State management (NgRx) can be added later if needed
- Module Federation support not required for POC
- Keep it simple - add complexity only when necessary
