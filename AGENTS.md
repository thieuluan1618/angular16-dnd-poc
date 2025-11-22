# Agents Documentation

This document provides comprehensive information about the available agents, tools, and systems in the Angular 21 POC application.

## Table of Contents

1. [Signal Form System](#signal-form-system)
2. [GridStack Drag & Drop System](#gridstack-drag--drop-system)
3. [Available CLI Tools](#available-cli-tools)
4. [Development Workflow](#development-workflow)
5. [Component Architecture](#component-architecture)

---

## Signal Form System

### Overview
A comprehensive, signal-based form management system built with Angular 21 signals and Tailwind CSS styling. Provides real-time validation, reactive state management, and beautiful modern UI components.

### Core Components

#### SignalFormFieldComponent
**Location:** `src/app/components/signal-form-field/`

A reusable form field component that handles different input types with validation and styling.

**Features:**
- Multiple input types: text, email, password, number, date, textarea, select, checkbox
- Real-time validation with customizable error messages
- Beautiful Tailwind CSS styling with animations
- Accessibility support with ARIA labels
- Responsive design for all screen sizes

**Usage:**
```html
<app-signal-form-field
  [field]="fieldConfig"
  [errors]="fieldErrors"
  [showErrors]="showFieldErrors"
  (touchedChange)="onFieldTouched($event)"
/>
```

#### SignalFormValidatorComponent
**Location:** `src/app/components/signal-form-validator/`

Form validation component that displays real-time validation status and provides submit/cancel functionality.

**Features:**
- Real-time form validation status
- Submit button with loading states
- Form statistics (total fields, required, valid, invalid)
- Configurable submit/cancel buttons
- Validation summary with icons

**Usage:**
```html
<app-signal-form-validator
  [form]="signalForm"
  [showErrors]="showErrors"
  [showSubmit]="true"
  [submitText]="'Submit Form'"
  (submit)="onFormSubmit()"
/>
```

#### SignalFormDemoComponent
**Location:** `src/app/pages/signal-form-demo/`

Complete demo showcasing user profile and contact forms with pre-fill functionality.

**Features:**
- Two demo forms: User Profile and Contact Form
- Pre-fill functionality for testing
- Real-time validation feedback
- Form submission handling with loading states
- Beautiful glassmorphism design
- Responsive layout with statistics panel

**Access:** `http://localhost:4200/signal-forms`

### SignalFormService

**Location:** `src/app/services/signal-form.service.ts`

Centralized form management service providing utilities and validators.

#### Built-in Validators
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

#### Key Methods
- `createForm<T>(fields: SignalFormField[]): SignalForm<T>` - Create signal-based form
- `createUserProfileForm(): SignalForm<UserProfile>` - Pre-configured user profile form
- `createContactForm(): SignalForm<ContactForm>` - Pre-configured contact form
- `submitForm<T>(form: SignalForm<T>): Promise<{ success: boolean; message: string }>` - Submit form
- `resetForm<T>(form: SignalForm<T>): void` - Reset form to initial values

### Signal Form Models

**Location:** `src/app/models/signal-form.ts`

#### Core Interfaces

```typescript
// Form field configuration
interface SignalFormField<T = any> {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  value: WritableSignal<T>;
  required: boolean;
  disabled: WritableSignal<boolean>;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  validators?: SignalValidator<T>[];
}

// Form validation result
interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Signal validator function
interface SignalValidator<T = any> {
  name: string;
  validate: (value: T) => ValidationResult;
}
```

### Usage Examples

#### Creating a Custom Form
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
```

#### Handling Form Submission
```typescript
async onSubmit(): Promise<void> {
  if (!this.myForm.isValid()) {
    this.showErrors.set(true);
    return;
  }

  try {
    this.myForm.isSubmitting.set(true);
    const result = await this.formService.submitForm(this.myForm);

    if (result.success) {
      // Handle success
      console.log('Form submitted:', this.myForm.values());
    } else {
      // Handle error
      console.error('Submission failed:', result.message);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    this.myForm.isSubmitting.set(false);
  }
}
```

---

## GridStack Drag & Drop System

### Overview
A drag-and-drop widget system using GridStack.js for creating dynamic dashboard layouts with widgets that can be moved, resized, and configured.

### Core Components

#### GridStackComponent
**Location:** `src/app/components/grid-stack/`

Main wrapper component that initializes GridStack.js and manages widget lifecycle.

**Features:**
- Edit and view modes
- Widget drag and drop functionality
- Global filtering across all widgets
- Responsive grid layout
- Touch device support

**Configuration Options:**
```typescript
// Edit mode options
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

// View mode options
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

#### WidgetWrapperComponent
**Location:** `src/app/components/widget-wrapper/`

Wraps individual widget instances and handles widget-specific events.

**Features:**
- Dynamic widget loading
- Widget-specific event handling (remove, zoom, settings)
- Local and remote widget support
- Input property management

#### DraggableDirective
**Location:** `src/app/directives/draggable-widget.directive.ts`

Makes sidebar widgets draggable into the grid.

**Features:**
- GridStack drag-in integration
- Widget metadata storage
- Enable/disable states
- Drag clone creation

### Widget Types

#### Available Widgets
- **Hello Widget**: Simple greeting widget
- **Chart Widget**: Data visualization with Chart.js
- **Data Widget**: Table/grid data display with filtering
- **Fallback Widget**: Error handling for unknown widget types

#### Creating Custom Widgets
```typescript
// Extend BaseWidgetComponent
export class MyCustomWidgetComponent extends BaseWidgetComponent {
  override ngOnInit(): void {
    super.ngOnInit();
    // Custom initialization
  }

  onGlobalFilterChanges(change: SimpleChange): void {
    // Handle global filter changes
    const { dateFilter, trending } = change.currentValue;
    // Apply filters to widget data
  }
}
```

---

## Available CLI Tools

### Angular CLI Commands
```bash
# Development
npm start                    # Start development server (port 4200)
ng serve                     # Alternative start command

# Building
npm run build               # Build for production
ng build                    # Alternative build command

# Testing
npm test                    # Run unit tests
ng test                     # Alternative test command

# Development with watch
npm run watch               # Build and watch for changes
```

### Useful Development Scripts

#### Manual Testing with Chrome DevTools
```bash
# Open Chrome DevTools manually
google-chrome http://localhost:4200/signal-forms

# Check network tab for API calls
# Check console for errors and logs
# Use Elements tab to inspect DOM and styles
```

#### Cache Management
```bash
# Clear Angular cache
rm -rf .angular

# Clear node modules cache
rm -rf node_modules/.cache

# Clean build artifacts
npm run clean  # if available
```

---

## Development Workflow

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 2. Signal Form Development
1. Define form field configurations in components
2. Use SignalFormService for form creation and validation
3. Implement form submission handling
4. Style with Tailwind CSS classes
5. Test real-time validation and error handling

### 3. GridStack Development
1. Create widget components extending BaseWidgetComponent
2. Register widgets in the widget registry
3. Implement global filter handling
4. Test drag-and-drop functionality
5. Verify responsive behavior

### 4. Testing Process
1. **Unit Tests:** Test individual components and services
2. **Integration Tests:** Test component interactions
3. **Manual Testing:** Verify UI/UX in browser
4. **Accessibility Testing:** Check screen reader and keyboard navigation
5. **Performance Testing:** Monitor bundle size and runtime performance

### 5. Code Quality
```bash
# Lint code (if configured)
npm run lint

# Format code (if configured)
npm run format

# Type checking
npx tsc --noEmit
```

---

## Component Architecture

### Standalone Components
All components use Angular 21 standalone components pattern:

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, FormsModule, /* other imports */],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponentComponent {
  // Component implementation
}
```

### Dependency Injection
Uses Angular 21 `inject()` function instead of constructor injection:

```typescript
export class MyComponentComponent {
  private formService = inject(SignalFormService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
}
```

### Signal Usage
Leverages Angular 21 signals for reactive state management:

```typescript
export class MyComponentComponent {
  // Writable signals
  count = signal(0);
  isLoading = signal(false);

  // Computed signals
  doubleCount = computed(() => this.count() * 2);
  statusMessage = computed(() =>
    this.isLoading() ? 'Loading...' : 'Ready'
  );
}
```

### Lifecycle Management
Uses Angular 16+ `takeUntilDestroyed()` for cleanup:

```typescript
ngOnInit(): void {
  this.someObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => {
      this.handleData(data);
    });
}
```

---

## File Structure

```
src/app/
├── components/
│   ├── grid-stack/              # GridStack main component
│   ├── widget-wrapper/          # Individual widget wrapper
│   ├── signal-form-field/       # Reusable form field component
│   └── signal-form-validator/   # Form validation component
├── directives/
│   └── draggable-widget/        # Draggable widget directive
├── models/
│   ├── signal-form.ts           # Signal form interfaces
│   └── grid-stack.ts            # GridStack widget models
├── pages/
│   ├── demo/                    # GridStack demo page
│   └── signal-form-demo/        # Signal form demo page
├── services/
│   └── signal-form.service.ts   # Signal form management service
├── utils/
│   └── ...                      # Utility functions
├── widgets/
│   ├── hello/                   # Hello widget implementation
│   ├── chart/                   # Chart widget implementation
│   ├── data/                    # Data widget implementation
│   └── fallback/                # Fallback widget implementation
└── app.component.ts             # Root component
```

---

## Browser Support

The application supports modern browsers with the following versions:
- Chrome: 111+
- Firefox: 111+
- Safari: 16.0+
- Edge: 111+

For older browser support, update the `.browserslistrc` file accordingly.

---

## Performance Considerations

### Signal Forms
- Use computed signals for derived state
- Avoid expensive operations in computed properties
- Implement proper change detection strategies
- Use OnPush change detection where appropriate

### GridStack
- Run GridStack operations outside Angular zone
- Implement proper cleanup for widget instances
- Use virtual scrolling for large widget lists
- Optimize widget rendering performance

### Bundle Optimization
- Use lazy loading for large components
- Implement code splitting for routes
- Optimize images and assets
- Use Angular's built-in optimization features

---

## Troubleshooting

### Common Issues

#### Signal Form Errors
- **NG0950:** Input field not available during initialization
  - Solution: Use optional inputs and defensive checks
- **Validation not working:** Check validator implementation
  - Solution: Ensure validators return proper ValidationResult objects
- **Template binding errors:** Move complex logic to component methods
  - Solution: Use computed properties for template expressions

#### GridStack Issues
- **Widgets not loading:** Check widget registration
  - Solution: Ensure widgets are properly registered in the registry
- **Drag and drop not working:** Verify DraggableDirective setup
  - Solution: Check GridStack initialization and CSS classes
- **Performance issues:** Optimize widget rendering
  - Solution: Use OnPush change detection and proper cleanup

#### Build Issues
- **TypeScript errors:** Check type definitions
  - Solution: Ensure proper typing for signals and observables
- **CSS compilation:** Verify Tailwind CSS configuration
  - Solution: Check tailwind.config.js and import statements
- **Bundle size:** Analyze bundle composition
  - Solution: Use webpack-bundle-analyzer for bundle analysis

### Debug Tools

#### Browser DevTools
- **Console:** Check for JavaScript errors and warnings
- **Network:** Monitor API calls and resource loading
- **Elements:** Inspect DOM structure and CSS
- **Performance:** Analyze runtime performance
- **Application:** Debug Angular-specific features

#### Angular DevTools
- **Component Tree:** Inspect component hierarchy
- **Profiler:** Analyze change detection performance
- **Injector Graph:** Debug dependency injection

---

## Best Practices

### Signal Forms
1. **Type Safety:** Use TypeScript interfaces for form data
2. **Validation:** Implement comprehensive client-side validation
3. **Accessibility:** Ensure proper ARIA labels and keyboard navigation
4. **User Experience:** Provide clear feedback and error messages
5. **Performance:** Use computed signals for derived state

### GridStack Widgets
1. **Modularity:** Keep widgets self-contained and reusable
2. **Performance:** Implement proper cleanup and optimization
3. **Responsiveness:** Ensure widgets work on all screen sizes
4. **Accessibility:** Make widgets keyboard accessible
5. **Error Handling:** Implement graceful error recovery

### Code Quality
1. **Consistency:** Follow established coding patterns
2. **Documentation:** Maintain clear and comprehensive documentation
3. **Testing:** Write comprehensive unit and integration tests
4. **Security:** Validate and sanitize all user inputs
5. **Maintainability:** Keep code modular and well-organized

---

## Key Dependencies

- **@angular/core**: ^21.0.0 - Angular framework
- **@angular/cdk**: ^21.0.0 - Angular Component Dev Kit
- **@angular/forms**: ^21.0.0 - Angular forms (signal form system)
- **gridstack**: ^10.3.1 - Drag-and-drop grid layout library
- **rxjs**: ~7.8.0 - Reactive programming
- **typescript**: ~5.9.3 - TypeScript compiler
- **tailwindcss**: ^3.4.0 - Utility-first CSS framework

---

## Angular 21 Implementation Example: DemoComponent

The demo component showcases all Angular 21 patterns:

```typescript
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, GridStackComponent, /* ... */],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  private toastService = inject(ToastService);

  // Signals for state
  mode = signal<'edit' | 'view'>('edit');
  widgets = signal<GridWidget[]>([]);
  globalFilterValue = signal<GlobalFilterValue>({...});

  // Computed derived state
  gridStackOptions = computed(() =>
    this.mode() === 'edit' ? gridStackEditModeOptions : gridStackViewModeOptions
  );

  // Methods using signal updates
  toggleMode(): void {
    this.mode.update(current => current === 'edit' ? 'view' : 'edit');
  }

  onLayoutChange(widgets: GridWidget[]): void {
    this.widgets.set(widgets);
    this.saveLayout();
  }
}
```

Template uses modern control flow:
```html
@if (mode() === 'edit') {
  <!-- edit mode UI -->
}

@for (widget of widgetPrototypes; track widget.id) {
  <!-- widget item -->
}

<app-grid-stack
  [mode]="mode()"
  [widgets]="widgets()"
  [options]="gridStackOptions()"
  (onChange)="onLayoutChange($event)"
/>
```

## Angular 21 Patterns

### Standalone Components
```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, FormsModule, /* other imports */],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponentComponent { }
```

### Dependency Injection with inject()
```typescript
export class MyComponentComponent {
  private formService = inject(SignalFormService);
  private destroyRef = inject(DestroyRef);
}
```

### Signals for Reactive State
```typescript
export class MyComponentComponent {
  // Writable signals for state
  count = signal(0);
  isLoading = signal(false);

  // Computed signals for derived state
  doubleCount = computed(() => this.count() * 2);

  // Update signals
  increment(): void {
    this.count.update(v => v + 1);
  }

  // Set signals
  reset(): void {
    this.count.set(0);
  }
}
```

### Modern Control Flow in Templates
```html
<!-- @if instead of *ngIf -->
@if (isLoading()) {
  <p>Loading...</p>
}

<!-- @for instead of *ngFor -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- Signal binding with () -->
<p>Count: {{ count() }}</p>
```

### Lifecycle Management
```typescript
ngOnInit(): void {
  this.someObservable$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => this.handleData(data));
}
```

---

## Implementation Guidelines

### When Creating Components
1. **Read reference implementation first** - Check `../mfe.custom-page/src/modules/common/grid-stack/`
2. **Use standalone components** - No NgModules
3. **Use inject() function** - Not constructor DI
4. **Use takeUntilDestroyed()** - For observable cleanup
5. **Follow the same event flow** - As documented in DRAG_AND_DROP_IMPLEMENTATION.md
6. **Copy core logic carefully** - GridStack initialization, event handlers, widget loading

### GridStack Zone Management
```typescript
private zone = inject(NgZone);

this.zone.runOutsideAngular(() => {
  // GridStack operations here
});
```

### What to Keep the Same
- GridStack initialization logic
- Event handling (drag, drop, resize, remove)
- Widget loading mechanism
- Data attribute storage for drag-and-drop
- Zone management for performance
- Background grid calculation

---

## Common Issues & Solutions

### GridStack CSS Not Loading
- Ensure `@import 'gridstack/dist/gridstack.min.css';` is in `src/styles.scss`
- Check that gridstack package is installed

### TypeScript Errors with GridStack
- GridStack has its own type definitions
- Import types from 'gridstack': `import { GridStack, GridStackOptions } from 'gridstack';`

### Signal Form Validation Not Working
- Check validator implementation
- Ensure validators return proper ValidationResult objects
- Verify validators are properly added to field config

### Widget Not Loading
- Check widget registration in widget registry
- Ensure widget selector matches component
- Verify component is properly exported

### Performance Issues
- Use OnPush change detection where appropriate
- Implement proper cleanup for subscriptions
- Run GridStack operations outside Angular zone
- Avoid expensive operations in computed properties

---

## Summary: Angular 21 Modernization

This POC demonstrates **modern Angular 21 development** with:

✅ **Standalone Components** - No NgModules required  
✅ **Signals & Computed** - Fully reactive state management  
✅ **Modern Control Flow** - `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`  
✅ **inject() Function** - No constructor dependency injection  
✅ **Signal Forms** - Signal-based form validation system  
✅ **GridStack Drag & Drop** - Full drag-and-drop widget system  
✅ **Tailwind CSS** - Utility-first styling  

All components (DemoComponent, SignalFormDemoComponent, Angular21DemoComponent, TailwindDemoComponent) follow these modern patterns consistently.

---

This documentation provides a comprehensive guide for working with the signal form system, GridStack drag-and-drop functionality, and Angular 21 patterns in the POC application.