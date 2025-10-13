# Reference Implementation Guide

This POC is based on the Angular 15 implementation from the main `mfe.custom-page` project.

## Reference Documentation

All implementation details are documented in the parent project:

1. **[../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md](../mfe.custom-page/DRAG_AND_DROP_IMPLEMENTATION.md)**
   - Complete implementation guide
   - Component breakdown with code examples
   - Migration guide to Angular 16.2.12

2. **[../mfe.custom-page/CLAUDE.md](../mfe.custom-page/CLAUDE.md)**
   - Project architecture overview
   - Module structure

3. **Reference Implementation Files**
   - Grid Stack Container: `../mfe.custom-page/src/modules/common/grid-stack/grid-stack/grid-stack.component.ts`
   - Widget Wrapper: `../mfe.custom-page/src/modules/common/grid-stack/grid-stack-widget/grid-stack-widget.component.ts`
   - Draggable Directive: `../mfe.custom-page/src/modules/common/grid-stack/draggable-widget.directive.ts`
   - Grid Options: `../mfe.custom-page/src/modules/custom-page/constants/grid-stack-options.ts`

## Current Project Setup

- ✅ Angular 16.2.0
- ✅ Angular CDK 16.2.12
- ✅ GridStack 10.3.1
- ✅ TypeScript ~5.1.0
- ✅ RxJS ~7.8.0

## Next Steps

1. Create standalone components following Angular 16 patterns
2. Implement GridStack wrapper component
3. Add widget wrapper component
4. Create draggable directive
5. Test drag-and-drop functionality

## Development

```bash
# Start dev server
yarn start

# Build
yarn build

# Run tests
yarn test
```

The app runs on `http://localhost:4200` by default.