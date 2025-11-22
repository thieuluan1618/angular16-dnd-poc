# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Angular 21.0.0** proof-of-concept (POC) application demonstrating both a drag-and-drop widget system using **GridStack.js** and a comprehensive signal-based form system. The implementation follows modern Angular 21 patterns including standalone components, the `inject()` function, `takeUntilDestroyed()`, and Angular 21 signals for reactive state management.

### Key Features
- **GridStack.js** drag-and-drop widget dashboard system
- **Signal-based Form System** with real-time validation and Tailwind CSS styling
- **Modern Angular 21** patterns with signals and standalone components
- **Responsive Design** with beautiful UI/UX
- **Type Safety** with comprehensive TypeScript interfaces

## Reference Implementation

This POC is based on the Angular 15 implementation in the parent project (`../mfe.custom-page`). **IMPORTANT:** Always refer to the reference documentation before implementing features:

- **[../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md](../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md)** - Complete implementation guide with code examples and migration patterns for Angular 16.2.12
- **[../mfe.custom-page/CLAUDE.md](../mfe.custom-page/CLAUDE.md)** - Reference project architecture
- **Reference source code:** `../mfe.custom-page/src/modules/common/grid-stack/`

## Development Commands

```bash
# Start development server (port 4200)
pnpm start

# Build for production
pnpm run build

# Run tests
pnpm test

# Build and watch for changes
pnpm run watch
```

## Key Dependencies

- **@angular/core**: ^21.0.0 - Angular framework
- **@angular/cdk**: ^21.0.0 - Angular Component Dev Kit (for drag-drop utilities)
- **@angular/forms**: ^21.0.0 - Angular forms (for signal form system)
- **gridstack**: ^10.3.1 - Drag-and-drop grid layout library
- **rxjs**: ~7.8.0 - Reactive programming
- **typescript**: ~5.9.3 - TypeScript compiler
- **tailwindcss**: ^3.4.0 - Utility-first CSS framework for form styling

## Project Structure

```
src/
├── app/
│   ├── base/                    # Base widget class
│   ├── components/
│   │   ├── grid-stack/          # Main GridStack container (standalone)
│   │   ├── widget-wrapper/      # Individual widget wrapper
│   │   ├── signal-form-field/   # Reusable signal form field component
│   │   └── signal-form-validator/ # Form validation and status component
│   ├── directives/              # Directives (including draggable-widget)
│   ├── models/                  # TypeScript interfaces
│   │   ├── signal-form.ts       # Signal form system interfaces
│   │   └── grid-stack.ts        # GridStack widget models
│   ├── pages/                   # Page components (demo)
│   │   ├── demo/                # GridStack demo page
│   │   └── signal-form-demo/    # Signal form demo page
│   ├── services/
│   │   └── signal-form.service.ts # Signal form management service
│   ├── tokens/                  # DI tokens for widget configuration
│   ├── utils/                   # Utility functions
│   ├── widgets/                 # Widget implementations (hello, chart, data, fallback)
│   ├── app.component.*          # Root component (standalone)
│   └── app.config.ts            # App configuration
├── assets/                      # Static assets
├── styles.scss                  # Global styles (includes GridStack CSS)
├── AGENTS.md                    # Comprehensive agents and tools documentation
└── CLAUDE.md                    # This file - Claude Code guidance
```

## Available Pages and Demos

### Signal Form Demo
**URL:** `http://localhost:4200/signal-forms`

A comprehensive demonstration of the signal-based form system featuring:
- **User Profile Form**: Personal information with validation
- **Contact Form**: Support request form with multiple input types
- **Real-time Validation**: Instant feedback on field validation
- **Pre-fill Functionality**: Quick testing with sample data
- **Form Statistics**: Live validation status and field counts
- **Beautiful UI**: Glassmorphism design with Tailwind CSS

### GridStack Demo
**URL:** `http://localhost:4200/` (default route)

Interactive drag-and-drop widget dashboard with:
- **Widget Gallery**: Sidebar with draggable widgets
- **Edit Mode**: Add, move, and resize widgets
- **View Mode**: Static dashboard display
- **Global Filters**: Date and trending filters across widgets
- **Widget Types**: Hello, Chart, Data visualization widgets

## Signal Form System

### Overview
A comprehensive signal-based form management system that leverages Angular 21 signals for reactive state management and real-time validation. The system provides reusable components with beautiful Tailwind CSS styling.

### Core Components

#### SignalFormFieldComponent
**Location:** `src/app/components/signal-form-field/`

Reusable form field component supporting multiple input types with validation:
```html
<app-signal-form-field
  [field]="fieldConfig"
  [errors]="fieldErrors"
  [showErrors]="showFieldErrors"
  (touchedChange)="onFieldTouched($event)"
/>
```

**Supported Input Types:**
- text, email, password, number, date, textarea, select, checkbox
- Real-time validation with customizable error messages
- Beautiful Tailwind CSS styling with animations
- Full accessibility support

#### SignalFormValidatorComponent
**Location:** `src/app/components/signal-form-validator/`

Form validation and submission component:
```html
<app-signal-form-validator
  [form]="signalForm"
  [showErrors]="showErrors"
  [showSubmit]="true"
  [submitText]="'Submit Form'"
  (submit)="onFormSubmit()"
/>
```

**Features:**
- Real-time validation status display
- Form statistics (total, required, valid, invalid fields)
- Configurable submit/cancel buttons
- Loading states and error handling

#### SignalFormDemoComponent
**Location:** `src/app/pages/signal-form-demo/`

Complete demo showcasing signal forms:
- **User Profile Form**: Personal information validation
- **Contact Form**: Support request with multiple field types
- **Pre-fill Functionality**: Quick testing with sample data
- **Beautiful UI**: Glassmorphism design with Tailwind CSS

**Access:** `http://localhost:4200/signal-forms`

#### SignalFormService
**Location:** `src/app/services/signal-form.service.ts`

Centralized form management service providing:

**Built-in Validators:**
```typescript
SignalFormService.validators = {
  required: (message = 'This field is required') => SignalValidator,
  email: (message = 'Please enter a valid email') => SignalValidator,
  minLength: (min: number, message?: string) => SignalValidator,
  maxLength: (max: number, message?: string) => SignalValidator,
  min: (min: number, message?: string) => SignalValidator,
  max: (max: number, message?: string) => SignalValidator
};
```

**Key Methods:**
- `createForm<T>(fields: SignalFormField[]): SignalForm<T>` - Create signal-based form
- `createUserProfileForm(): SignalForm<UserProfile>` - Pre-configured user profile form
- `createContactForm(): SignalForm<ContactForm>` - Pre-configured contact form
- `submitForm<T>(form: SignalForm<T>): Promise<{ success: boolean; message: string }>` - Submit form
- `resetForm<T>(form: SignalForm<T>): void` - Reset form to initial values

### Signal Form Usage Example

```typescript
// Define form fields
const fields: SignalFormField[] = [
  {
    id: 'username',
    label: 'Username',
    type: 'text',
    value: signal(''),
    required: true,
    disabled: signal(false),
    placeholder: 'Enter username',
    validators: [
      SignalFormService.validators.required(),
      SignalFormService.validators.minLength(3)
    ]
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    value: signal(''),
    required: true,
    disabled: signal(false),
    placeholder: 'user@example.com',
    validators: [
      SignalFormService.validators.required(),
      SignalFormService.validators.email()
    ]
  }
];

// Create form
const myForm = this.formService.createForm<MyFormType>(fields);

// Handle submission
async onSubmit(): Promise<void> {
  if (!myForm.isValid()) {
    this.showErrors.set(true);
    return;
  }

  try {
    const result = await this.formService.submitForm(myForm);
    if (result.success) {
      console.log('Form submitted:', myForm.values());
    }
  } catch (error) {
    console.error('Submission failed:', error);
  }
}
```

### Signal Form Models
**Location:** `src/app/models/signal-form.ts`

Key interfaces:
- `SignalFormField<T>` - Form field configuration
- `SignalForm<T>` - Complete form structure
- `SignalValidator<T>` - Validation function interface
- `ValidationResult` - Validation result structure

## Angular 21 Patterns to Use

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

**Location:** `src/app/directives/`

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
- `GlobalFilterValue` - Global filter values (dateFilter, trending, dateRange)
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

## Global Filtering System

This POC implements a global filtering system that propagates filter values across all widgets.

### Filter Interface

```typescript
export interface GlobalFilterValue {
  dateFilter?: string;      // 'last-12-months', 'last-6-months', 'last-3-months', 'last-month', 'custom'
  trending?: string;        // 'monthly', 'weekly', 'daily'
  dateRange?: DateRange;    // Custom date range (start/end)
}
```

### Filter Options

**Date Filter:**
- All (no filter)
- Last 12 months
- Last 6 months
- Last 3 months
- Last month
- Custom range (uses dateRange.start/end)

**Trending Filter:**
- All (no filter)
- Monthly trend
- Weekly trend
- Daily trend

### How Filters Work

1. **Filter Panel** - Located in `demo.component.html`, displays two dropdowns for Date and Trending filters
2. **Filter Propagation** - Changes to `globalFilterValue` are passed to GridStack component via `[globalFilterValue]` input
3. **Widget Reception** - GridStack propagates filters to all widget instances via the `onGlobalFilterChanges()` method
4. **Widget Implementation** - Each widget can implement `onGlobalFilterChanges()` to respond to filter updates

### Implementing Filters in Widgets

To make a widget respond to global filters:

```typescript
export class MyWidgetComponent extends BaseWidgetComponent {
  onGlobalFilterChanges(change: SimpleChange): void {
    const { dateFilter, trending } = change.currentValue;

    // Apply date filter
    if (dateFilter === 'last-12-months') {
      // Filter data to last 12 months
    }

    // Apply trending filter
    if (trending === 'monthly') {
      // Sort/group by monthly trend
    }
  }
}
```

### Example Implementation

See `data-widget.component.ts` for a complete example of date filtering logic that:
- Filters data based on predefined date ranges (last X months)
- Supports custom date ranges
- Updates filter statistics and display

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

## Implementation Status

✅ **Completed:**

### GridStack System
1. Models and interfaces (`src/app/models/`)
2. GridStack container component (`src/app/components/grid-stack/`)
3. Widget wrapper component (`src/app/components/widget-wrapper/`)
4. Draggable directive (`src/app/directives/draggable-widget.directive.ts`)
5. Example widgets for testing (hello, chart, data, fallback)
6. Edit and view modes working
7. Demo page with sidebar and widget gallery (PX Dashboard)
8. Global filtering system (Date and Trending filters)

### Signal Form System
1. SignalFormFieldComponent - Reusable form field component (`src/app/components/signal-form-field/`)
2. SignalFormValidatorComponent - Form validation component (`src/app/components/signal-form-validator/`)
3. SignalFormDemoComponent - Complete demo with User Profile and Contact forms (`src/app/pages/signal-form-demo/`)
4. SignalFormService - Centralized form management (`src/app/services/signal-form.service.ts`)
5. Signal form models and interfaces (`src/app/models/signal-form.ts`)
6. Real-time validation with built-in validators
7. Beautiful Tailwind CSS styling with glassmorphism design
8. Pre-fill functionality and form statistics
9. Form submission handling with loading states
10. Comprehensive accessibility support

**Next Steps for Enhancement:**

- Add more widget types as needed
- Implement state persistence (localStorage/backend)
- Add widget configuration/settings UI
- Implement NgRx for state management (if complexity grows)
- Add comprehensive unit and integration tests
- Add Module Federation support (if needed for micro-frontends)
- Extend signal form system with additional input types and validators
- Implement form field custom components (date pickers, rich text editors, etc.)

## Additional Notes

- This is a POC demonstrating both GridStack drag-and-drop widgets and signal-based forms
- Successfully upgraded from Angular 16.2.0 to Angular 21.0.0 with modern patterns
- Signal forms showcase Angular 21 signals for reactive state management
- Beautiful Tailwind CSS implementation with glassmorphism design
- Both systems are production-ready with comprehensive error handling
- State management (NgRx) can be added later if complexity grows
- Module Federation support not required for current POC scope
- Keep implementations focused and maintainable
