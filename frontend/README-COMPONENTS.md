# Director of One - Component Library & Design System

## Overview

This project includes a comprehensive design system and component library built with Next.js, TypeScript, and Tailwind CSS.

## Architecture

### 1. Design System (`/src/styles/design-system/`)
- **tokens.ts**: Design tokens for colors, typography, spacing, etc.
- **css-variables.css**: CSS custom properties for theming
- **index.ts**: Utility functions for theme management

### 2. Component Library (`/src/components/`)

#### UI Components
- **Button**: Versatile button with multiple variants and states
- **Card**: Flexible card component with header, content, and footer sections
- **Typography**: Heading, Text, Label, and Badge components
- **Input**: Form inputs including text input, textarea, and form groups

#### Layout Components
- **Container**: Responsive container with size variants
- **Section**: Page sections with consistent spacing
- **Grid**: Responsive grid system
- **Stack**: Flexbox-based layout component

#### Section Components
- **Hero**: Hero section with multiple layout variants
- **Features**: Feature showcase section with card layouts

## Usage

### Importing Components

```typescript
import { Button, Card, Hero, Container } from '@/components';
```

### Theme Management

```typescript
import { initTheme, toggleTheme, setTheme } from '@/styles/design-system';

// Initialize theme on app load
initTheme();

// Toggle between light and dark
toggleTheme();

// Set specific theme
setTheme('dark');
```

### Component Examples

#### Button
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

#### Card
```tsx
<Card variant="bordered" hover>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Hero Section
```tsx
<Hero
  badge="New Feature"
  title="Welcome to Our App"
  subtitle="Build amazing things"
  description="Start building today with our powerful tools."
  primaryAction={{ label: "Get Started", href: "/signup" }}
  variant="simple"
/>
```

## Design Tokens

The design system includes comprehensive tokens for:
- **Colors**: Brand, neutral, semantic (success, warning, error)
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale from 0 to 96
- **Shadows**: Multiple shadow depths
- **Border Radius**: From small to full rounded
- **Animation**: Durations and easing functions
- **Breakpoints**: Responsive design breakpoints

## Features

1. **Dark Mode Support**: Built-in dark mode with CSS variables
2. **Responsive Design**: Mobile-first responsive components
3. **Accessibility**: ARIA attributes and keyboard navigation
4. **Type Safety**: Full TypeScript support with exported types
5. **Customizable**: Easy to extend with Tailwind classes
6. **Performance**: Optimized with React forwardRef and proper memoization

## Development

To run the development server:

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 to see the landing page.

## Landing Page Structure

The landing page demonstrates the component library with:
1. Hero section with call-to-action buttons
2. Features grid showcasing key capabilities
3. Benefits section with elevated cards
4. CTA section with gradient background

All content is driven by the JSON file at `/content/copy/landing.json` for easy updates.