# Angular 16.2.12 Drag-and-Drop POC

This is a proof-of-concept implementation of the drag-and-drop widget feature using Angular 16.2.12.

## Reference Implementation

This POC is based on the Angular 15 implementation in the main project. See:
- [DRAG_AND_DROP_IMPLEMENTATION.md](../DRAG_AND_DROP_IMPLEMENTATION.md) - Detailed implementation guide
- [CLAUDE.md](../CLAUDE.md) - Project overview and architecture

## Directory Structure

```
poc-angular16-drag-drop/
├── src/
│   └── app/
│       ├── components/
│       │   ├── grid-stack/           # Main grid container (standalone component)
│       │   ├── widget-wrapper/       # Widget wrapper component
│       │   └── draggable-widget/     # Draggable directive
│       ├── models/                   # TypeScript interfaces and types
│       └── services/                 # Services for widget management
└── README.md
```

## Key Differences from Angular 15 Implementation

### 1. Standalone Components
All components are standalone (no NgModule):
```typescript
@Component({
  selector: 'app-grid-stack',
  standalone: true,
  imports: [CommonModule, /* other imports */],
  // ...
})
```

### 2. Inject Function
Using `inject()` instead of constructor DI:
```typescript
export class GridStackComponent {
  private destroyRef = inject(DestroyRef);
  private cd = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
}
```

### 3. takeUntilDestroyed()
Using Angular 16's built-in operator:
```typescript
this.observable$
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(/*...*/);
```

### 4. Signals (Optional)
Consider using signals for reactive state:
```typescript
widgets = signal<GridWidget[]>([]);
isEmpty = computed(() => this.widgets().length === 0);
```

### 5. Required Inputs
Using the `required` flag:
```typescript
@Input({ required: true }) mode!: 'edit' | 'view';
@Input({ required: true }) widgets!: GridWidget[];
```

## Dependencies

```json
{
  "dependencies": {
    "@angular/core": "^16.2.12",
    "@angular/common": "^16.2.12",
    "@angular/cdk": "^16.2.12",
    "gridstack": "^10.3.1"
  }
}
```

## Implementation Steps

1. **Grid Stack Container Component**
   - Main wrapper for GridStack.js
   - Handles initialization and event management
   - Manages widget lifecycle

2. **Widget Wrapper Component**
   - Wraps individual widgets
   - Handles dynamic component loading
   - Manages widget-specific events

3. **Draggable Widget Directive**
   - Makes sidebar widgets draggable
   - Stores widget metadata in data attributes

4. **Models**
   - GridWidget type
   - Widget base interfaces
   - Event types

5. **Services** (Optional)
   - Widget registry service
   - Widget state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install @angular/core@^16.2.12 gridstack@^10.3.1
   ```

2. Import GridStack CSS in your styles:
   ```scss
   @import 'gridstack/dist/gridstack.min.css';
   ```

3. Implement components following the patterns in the reference implementation

4. Test with both edit and view modes

## Testing

- Unit tests for component logic
- Integration tests for drag-and-drop behavior
- E2E tests for user workflows

## Notes

- This POC focuses on the core drag-and-drop functionality
- Module Federation support can be added later if needed
- State management (NgRx) is optional for POC
- Consider performance optimizations after basic implementation works