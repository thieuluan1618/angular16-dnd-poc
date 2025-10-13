# Getting Started

## 🚀 Quick Start

The application is now ready to run! Follow these steps:

### 1. Start the Development Server

```bash
yarn start
# or
npm start
```

The app will be available at: **http://localhost:4200/**

### 2. What You'll See

The demo page includes:

- **Header** with mode toggle and action buttons
- **Sidebar** (in edit mode) with draggable widget prototypes
- **Main grid area** where you can place and arrange widgets
- **Footer** with version information

### 3. Try These Features

#### Edit Mode (Default)

✅ **Drag widgets** from the sidebar onto the grid
✅ **Resize widgets** by dragging from corners/edges
✅ **Move widgets** by dragging them around the grid
✅ **Remove widgets** using the × button
✅ **Clear all** with the "Clear Layout" button
✅ **Add sample layout** to see pre-configured widgets

#### View Mode

✅ **Toggle to view mode** to see static display
✅ **No editing** - widgets are locked in place
✅ **Clean presentation** without edit controls

### 4. Persistence

The layout is automatically saved to **localStorage**:

- Refresh the page and your layout will be restored
- Clear localStorage to reset the layout
- Each layout change is automatically saved

## 📦 Available Widget Types

### Hello Widget
- Simple demonstration widget
- Shows widget properties and mode
- Drag-friendly size (4x2 grid units)

### Chart Widget
- Data visualization example
- Pure CSS bar chart
- Larger default size (6x3 grid units)

## 🎨 Customization

### Adding New Widgets

1. **Create your widget component** in `src/app/widgets/`:

```typescript
import { Component } from '@angular/core';
import { BaseWidgetComponent } from '../../base/base-widget.component';

@Component({
  selector: 'app-my-widget',
  standalone: true,
  template: `<div>My Widget Content</div>`
})
export class MyWidgetComponent extends BaseWidgetComponent {
  // Your widget logic here
}
```

2. **Register it** in `src/app/widgets/widget-registry.ts`:

```typescript
import { MyWidgetComponent } from './my-widget/my-widget.component';

export const WIDGET_REGISTRY: WidgetRegistryEntry[] = [
  // ... existing widgets
  {
    key: 'MyWidgetComponent',
    component: MyWidgetComponent,
    displayName: 'My Custom Widget'
  }
];
```

3. **Add to prototypes** in `src/app/pages/demo/demo.component.ts`:

```typescript
widgetPrototypes: WidgetPrototype[] = [
  // ... existing prototypes
  {
    id: 'my-widget-1',
    name: 'my-widget',
    displayName: 'My Widget',
    type: 'custom',
    component: 'MyWidgetComponent',
    defaultWidth: 4,
    defaultHeight: 2,
    minWidth: 2,
    minHeight: 1,
    icon: '⭐'
  }
];
```

### Customizing Grid Options

Edit `src/app/config/grid-stack-options.ts`:

```typescript
export const gridStackEditModeOptions: GridStackOptions = {
  column: 12,        // Number of columns
  minRow: 4,         // Minimum rows
  cellHeight: 'auto', // Cell height
  margin: 8,         // Spacing between widgets
  // ... more options
};
```

## 🔧 Development

### Project Structure

```
src/app/
├── base/                    # Base widget class
├── components/              # GridStack & widget wrapper
├── config/                  # GridStack configuration
├── directives/              # Draggable directive
├── models/                  # TypeScript interfaces
├── pages/demo/              # Demo page
├── tokens/                  # DI tokens
├── utils/                   # Helper functions
└── widgets/                 # Widget implementations
```

### Key Files

- **GridStack Container**: `src/app/components/grid-stack/`
- **Widget Wrapper**: `src/app/components/widget-wrapper/`
- **Draggable Directive**: `src/app/directives/draggable-widget.directive.ts`
- **Widget Registry**: `src/app/widgets/widget-registry.ts`
- **Demo Page**: `src/app/pages/demo/`

### Angular 16 Patterns

This project uses modern Angular 16 features:

- ✅ **Standalone components** (no NgModules)
- ✅ **inject()** function for dependency injection
- ✅ **DestroyRef** for lifecycle cleanup
- ✅ **bootstrapApplication()** for standalone bootstrapping

## 📚 Documentation

- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Reference Guide**: See `../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md`
- **GridStack Docs**: https://gridstackjs.com/
- **Angular 16 Docs**: https://v16.angular.io/

## 🐛 Troubleshooting

### Dev Server Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
yarn install
yarn start
```

### Layout Not Saving

- Check browser console for localStorage errors
- Ensure localStorage is enabled in your browser
- Try clearing browser cache

### Widgets Not Appearing

- Check the browser console for errors
- Verify widget is registered in `WIDGET_REGISTRY`
- Verify component key matches in prototype

### TypeScript Errors

```bash
# Rebuild the project
yarn build
```

## 🎯 Next Steps

1. **Add your own widgets** following the examples
2. **Customize the styling** in component SCSS files
3. **Add backend persistence** to replace localStorage
4. **Implement widget settings dialogs**
5. **Add more grid options** (undo/redo, templates, etc.)

## 💡 Tips

- Use the browser's **DevTools** to inspect GridStack events
- Check the **console** for layout change logs
- Try different **screen sizes** to test responsiveness
- Experiment with **grid options** in the config file

## 🤝 Contributing

This is a proof-of-concept implementation. Feel free to:

- Add more widget types
- Improve the UI/UX
- Add advanced features
- Share your improvements!

---

**Happy coding! 🎉**
