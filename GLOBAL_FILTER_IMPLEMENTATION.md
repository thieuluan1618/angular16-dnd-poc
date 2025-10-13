# Global Filter Feature Implementation

## Overview

The global filter feature allows users to apply filters across all widgets in the drag-and-drop grid system. This implementation demonstrates Angular 16 patterns with TypeScript type safety and real-time filter propagation.

## Features Implemented

### 🔍 **Global Filter Panel**

- **Search Filter**: Text-based search across widget content
- **Category Filter**: Filter by predefined categories (Sales, Marketing, Development, Support)
- **Date Range Filter**: Filter by start and end dates
- **Status Filter**: Toggle to show/hide inactive items
- **Clear All**: Reset all filters with one click

### 📊 **Filter-Aware Widgets**

1. **Enhanced Hello Widget**: Shows filter matches and current filter state
2. **Advanced Data Widget**: Real-time table filtering with statistics
3. **Filter Status Display**: Visual indicators for matched/unmatched content

### ⚡ **Real-Time Propagation**

- Filters propagate instantly to all widgets
- Each widget can respond to filter changes independently
- Change detection optimized with Angular 16 patterns

## Technical Implementation

### 1. Type-Safe Global Filter Interface

```typescript
// src/app/models/widget.ts
export interface DateRange {
  start?: string;
  end?: string;
}

export interface GlobalFilterValue {
  searchTerm?: string;
  dateRange?: DateRange;
  category?: string;
  showInactive?: boolean;
}
```

### 2. Filter Propagation Architecture

```typescript
// GridStack Component handles filter propagation
private onGlobalFilterValueChange(change: SimpleChange): void {
  if (!this.gridStack) return;

  const gridItems = this.gridStack.getGridItems();
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
```

### 3. Widget Filter Implementation

Widgets can implement the optional `onGlobalFilterChanges` method:

```typescript
// Example: Hello Widget with filter response
export class HelloWidgetComponent extends BaseWidgetComponent {
  isVisible = true;
  filterMessage = '';

  onGlobalFilterChanges(change: { 
    previousValue: GlobalFilterValue; 
    currentValue: GlobalFilterValue; 
    firstChange: boolean 
  }): void {
    // Apply search filter
    const searchTerm = change.currentValue.searchTerm?.toLowerCase();
    if (searchTerm) {
      this.isVisible = this.checkSearchMatch();
      this.filterMessage = this.isVisible 
        ? `Matches search: "${searchTerm}"` 
        : `No match for: "${searchTerm}"`;
    }
    // ... other filter logic
  }
}
```

### 4. Advanced Data Filtering

The Data Widget demonstrates complex filtering:

```typescript
// Real-time data filtering
private applyFilters(): void {
  let filtered = [...this.allData];

  // Search filter
  const searchTerm = this.globalFilterValue.searchTerm?.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  }

  // Category filter
  if (this.globalFilterValue.category) {
    filtered = filtered.filter(item => 
      item.category === this.globalFilterValue.category
    );
  }

  // Date range filter
  const dateRange = this.globalFilterValue.dateRange;
  if (dateRange?.start || dateRange?.end) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.createdDate);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      return true;
    });
  }

  // Status filter
  if (!this.globalFilterValue.showInactive) {
    filtered = filtered.filter(item => item.status === 'active');
  }

  this.filteredData = filtered;
  this.updateFilterStats();
}
```

## UI Components

### Filter Panel Layout

```html
<!-- Global Filter Panel -->
<section class="global-filter-panel">
  <div class="filter-header">
    <h2>🔍 Global Filters</h2>
    <button class="btn btn-link" (click)="clearFilters()">Clear All</button>
  </div>
  
  <div class="filter-controls">
    <div class="filter-group">
      <label for="searchTerm">Search:</label>
      <input
        id="searchTerm"
        type="text"
        [(ngModel)]="globalFilterValue.searchTerm"
        (ngModelChange)="onGlobalFilterChange()"
        placeholder="Search widgets..."
        class="filter-input">
    </div>
    <!-- More filter controls... -->
  </div>
</section>
```

### Widget Filter Display

```html
<!-- Filter Status in Widget -->
<div class="filter-status" *ngIf="filterMessage">
  <div class="filter-indicator" 
       [class.match]="isVisible" 
       [class.no-match]="!isVisible">
    {{ filterMessage }}
  </div>
</div>

<!-- Filter Info Display -->
<div class="filter-info">
  <h4>🔍 Current Global Filters:</h4>
  <p class="filter-details">{{ filterInfo }}</p>
</div>
```

## Styling Features

### Filter Panel Styling

- Clean, modern UI with proper spacing
- Responsive flex layout
- Focus states and hover effects
- Clear visual hierarchy

### Filter Status Indicators

- Green indicators for matches
- Red indicators for no matches
- Smooth opacity transitions for filtered content
- Statistics display (total, showing, hidden counts)

### Widget Visual Feedback

- Dimmed content for filtered-out items
- Filter badges and status indicators
- Responsive table layout
- Empty state messaging

## Key Angular 16 Patterns Used

### 1. **Standalone Components**
```typescript
@Component({
  selector: 'app-data-widget',
  standalone: true,
  imports: [CommonModule],
  // ...
})
```

### 2. **Inject Function**
```typescript
export class GridStackComponent {
  private readonly zone = inject(NgZone);
  private readonly cd = inject(ChangeDetectorRef);
}
```

### 3. **Type-Safe Interfaces**
```typescript
// Proper TypeScript interfaces instead of Record<string, unknown>
export interface GlobalFilterValue {
  searchTerm?: string;
  dateRange?: DateRange;
  category?: string;
  showInactive?: boolean;
}
```

### 4. **Optional Filter Implementation**
```typescript
// Type guard for filter-aware widgets
export function isOnGlobalFilterChanges(
  component: any
): component is { onGlobalFilterChanges: (change: any) => void } {
  return typeof component?.onGlobalFilterChanges === 'function';
}
```

## Demo Widgets

### 1. **Hello Widget** (`HelloWidgetComponent`)

- Basic filter response demonstration
- Shows current filter state
- Visual feedback for matches/no matches
- Category-based filtering simulation

### 2. **Data Table Widget** (`DataWidgetComponent`)

- Advanced real-time table filtering
- Multiple filter criteria support
- Filter statistics display
- Empty state handling
- Responsive design

### 3. **Chart Widget** (`ChartWidgetComponent`)

- Can be extended to support filtering
- Currently shows basic structure

## How to Test

1. **Start the development server**:
   ```bash
   yarn start
   # Server runs on http://localhost:58967/
   ```

2. **Add widgets to the grid**:
   - Switch to Edit Mode
   - Drag widgets from sidebar to grid
   - Or use "Add Sample Layout" button

3. **Test global filtering**:
   - Enter search terms (try "sales", "chart", "hello")
   - Select categories (Sales, Marketing, Development, Support)
   - Set date ranges (try 2024-01-01 to 2024-02-28)
   - Toggle "Show Inactive Items"
   - Use "Clear All" to reset filters

4. **Observe real-time updates**:
   - All widgets update immediately
   - Data table shows filtered results
   - Hello widgets show filter status
   - Statistics update in real-time

## Architecture Benefits

### ✅ **Type Safety**

- Strongly typed filter interfaces
- Compile-time error checking
- IntelliSense support

### ✅ **Performance**

- Filters run outside Angular zone when needed
- Efficient change detection
- Minimal re-renders

### ✅ **Extensibility**

- Easy to add new filter types
- Widgets can implement filtering independently
- Modular architecture

### ✅ **User Experience**

- Real-time feedback
- Clear visual indicators
- Responsive design
- Intuitive controls

## Future Enhancements

- **Saved Filter Presets**: Allow users to save and load filter combinations
- **Advanced Search**: Support for operators (AND, OR, NOT)
- **Filter History**: Undo/redo filter changes
- **Export Filtered Data**: Download filtered results
- **Performance Optimization**: Virtual scrolling for large datasets
- **More Filter Types**: Number ranges, multi-select categories, etc.

## Files Modified/Created

### Core Implementation

- `src/app/models/widget.ts` - Updated GlobalFilterValue interface
- `src/app/pages/demo/demo.component.ts` - Added filter state and methods
- `src/app/pages/demo/demo.component.html` - Added filter panel UI
- `src/app/pages/demo/demo.component.scss` - Added filter panel styling
- `src/app/components/grid-stack/grid-stack.component.ts` - Filter propagation (already implemented)

### Enhanced Widgets

- `src/app/widgets/hello-widget/hello-widget.component.ts` - Added filter response
- `src/app/widgets/hello-widget/hello-widget.component.html` - Added filter display
- `src/app/widgets/hello-widget/hello-widget.component.scss` - Added filter styling

### New Widget

- `src/app/widgets/data-widget/data-widget.component.ts` - Advanced filtering demo
- `src/app/widgets/data-widget/data-widget.component.html` - Data table with filters
- `src/app/widgets/data-widget/data-widget.component.scss` - Data table styling
- `src/app/widgets/widget-registry.ts` - Registered new widget

This implementation showcases a production-ready global filter system that demonstrates modern Angular 16 patterns while maintaining excellent performance and user experience.
