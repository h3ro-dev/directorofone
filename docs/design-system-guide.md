# Design System Guide - Director of One

## Overview

The Director of One Design System provides a comprehensive set of design tokens, components, and utilities to create consistent, professional, and accessible user interfaces.

## Getting Started

### 1. Include the CSS File
```html
<link rel="stylesheet" href="/src/styles/design-system.css">
```

### 2. Use the Design Tokens
Access design tokens via CSS custom properties or the JSON file for JavaScript applications.

## Color System

### Primary Colors
Used for main brand elements, CTAs, and key interactive elements.
- `--color-primary-500`: Main brand color (#0066cc)
- `--color-primary-600`: Hover state (#0052a3)
- `--color-primary-50`: Light background (#e6f2ff)

### Secondary Colors
Used for complementary elements and secondary actions.
- `--color-secondary-500`: Secondary brand color (#0ea5e9)
- `--color-secondary-600`: Hover state (#0284c7)

### Neutral Colors
Used for text, backgrounds, and borders.
- `--color-text-primary`: Main text (#171717)
- `--color-text-secondary`: Secondary text (#404040)
- `--color-bg-primary`: Main background (#ffffff)

### Semantic Colors
- `--color-success`: Success messages (#10b981)
- `--color-warning`: Warnings (#f59e0b)
- `--color-error`: Errors (#ef4444)
- `--color-info`: Information (#3b82f6)

## Typography

### Font Families
- **Sans-serif**: System font stack for body text
- **Monospace**: For code and technical content

### Type Scale
```css
.heading-1 { /* 48px */ }
.heading-2 { /* 36px */ }
.heading-3 { /* 30px */ }
.heading-4 { /* 24px */ }
.heading-5 { /* 20px */ }
.heading-6 { /* 18px */ }
.body-large { /* 18px */ }
.body-default { /* 16px */ }
.body-small { /* 14px */ }
.caption { /* 12px */ }
```

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing System

Based on a 4px base unit:
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px
- `--space-16`: 64px

## Components

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Get Started</button>
<button class="btn btn-primary btn-large">Get Started</button>
```

#### Secondary Button
```html
<button class="btn btn-secondary">Learn More</button>
```

#### Outline Button
```html
<button class="btn btn-outline">Contact Us</button>
```

#### Button Sizes
- `.btn-small`: Compact size
- Default: Standard size
- `.btn-large`: Large size

### Cards
```html
<div class="card">
  <h3 class="heading-5">Card Title</h3>
  <p class="body-default">Card content goes here.</p>
</div>

<!-- Hoverable Card -->
<div class="card card-hover">
  <h3 class="heading-5">Interactive Card</h3>
  <p class="body-default">This card has hover effects.</p>
</div>
```

### Grid System
```html
<!-- Basic Grid -->
<div class="grid grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Responsive Column</div>
  <div>Responsive Column</div>
  <div>Responsive Column</div>
</div>
```

### Container
```html
<div class="container">
  <!-- Content with max-width and padding -->
</div>
```

### Section
```html
<section class="section">
  <!-- Section with vertical padding -->
</section>
```

## Utility Classes

### Flexbox
- `.flex`: Display flex
- `.flex-col`: Flex direction column
- `.items-center`: Align items center
- `.justify-center`: Justify content center
- `.justify-between`: Justify content space-between
- `.gap-{size}`: Gap between flex items

### Text Alignment
- `.text-left`
- `.text-center`
- `.text-right`

### Colors
- `.text-primary`: Primary text color
- `.text-secondary`: Secondary text color
- `.text-tertiary`: Tertiary text color
- `.bg-primary`: Primary background
- `.bg-secondary`: Secondary background
- `.bg-tertiary`: Tertiary background

### Border Radius
- `.rounded-sm`: Small radius
- `.rounded`: Default radius
- `.rounded-md`: Medium radius
- `.rounded-lg`: Large radius
- `.rounded-full`: Full radius (circle)

### Shadows
- `.shadow-sm`: Small shadow
- `.shadow`: Default shadow
- `.shadow-md`: Medium shadow
- `.shadow-lg`: Large shadow
- `.shadow-xl`: Extra large shadow

## Responsive Design

### Breakpoints
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### Responsive Utilities
Prefix utilities with breakpoint names:
```html
<div class="text-center md:text-left lg:text-right">
  Responsive text alignment
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Responsive grid
</div>
```

## Accessibility Guidelines

1. **Color Contrast**: Ensure text meets WCAG AA standards
   - Normal text: 4.5:1 ratio
   - Large text: 3:1 ratio

2. **Focus States**: All interactive elements have visible focus indicators

3. **Semantic HTML**: Use appropriate HTML elements
   - Headings for hierarchy
   - Buttons for actions
   - Links for navigation

4. **Alt Text**: Provide descriptive alt text for images

5. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible

## Best Practices

1. **Consistency**: Use design tokens instead of hard-coded values
2. **Composition**: Combine utility classes for complex layouts
3. **Performance**: Only include the CSS you need
4. **Maintainability**: Follow the naming conventions
5. **Accessibility**: Always consider users with disabilities

## Examples

### Hero Section
```html
<section class="section bg-secondary">
  <div class="container text-center">
    <h1 class="heading-1 text-primary">Welcome to Director of One</h1>
    <p class="body-large text-secondary">Your journey starts here</p>
    <button class="btn btn-primary btn-large">Get Started</button>
  </div>
</section>
```

### Feature Grid
```html
<section class="section">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <h3 class="heading-5">Feature One</h3>
        <p class="body-default text-secondary">Description here</p>
      </div>
      <div class="card">
        <h3 class="heading-5">Feature Two</h3>
        <p class="body-default text-secondary">Description here</p>
      </div>
      <div class="card">
        <h3 class="heading-5">Feature Three</h3>
        <p class="body-default text-secondary">Description here</p>
      </div>
    </div>
  </div>
</section>
```