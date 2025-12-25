# Component Playground

A development page to view and test all UI components in The CRNA Club design system.

## Access the Playground

When running the dev server (`npm run dev`), visit:

**http://localhost:5173/playground**

## What's Included

The playground displays all implemented UI components:

- ✅ **Buttons** - All variants (default, secondary, outline, ghost, link, destructive) and sizes
- ✅ **Cards** - Simple, interactive, and with footers
- ✅ **Badges** - Default variants and custom status badges
- ✅ **Form Inputs** - Text, password, and disabled states
- ✅ **Checkboxes** - Normal, checked, and disabled states
- ✅ **Select Dropdowns** - With state selection example
- ✅ **Tabs** - Navigation tabs for organizing content
- ✅ **Empty States** - Placeholder for no-content scenarios
- ✅ **Loading Skeletons** - Loading state placeholders
- ✅ **Icons** - Common Lucide React icons
- ✅ **Color Palette** - Brand colors reference

## Purpose

This page helps with:

1. **Development** - See all components in one place while building
2. **Testing** - Verify components work correctly with interactions
3. **Design Reference** - Ensure consistency across the app
4. **Documentation** - Show developers how components look and behave

## Usage in Development

The playground is a standalone page (no sidebar/layout) to focus purely on component display. It's meant for internal development use only and won't be visible to end users.

## Components Directory

All components are located in:
- `/src/components/ui/` - Base components (shadcn/ui style)
- `/src/components/layout/` - Layout components
- `/src/components/features/` - Feature-specific components

## Adding New Components

When you create a new component, add it to the playground:

1. Import the component at the top of `/src/pages/PlaygroundPage.jsx`
2. Add a new Card section showcasing the component
3. Include examples of different states/variants
4. Add a description of what it's used for

This keeps the playground up-to-date as a living documentation tool.
