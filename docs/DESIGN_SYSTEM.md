# Design System Documentation

This document describes the design system, UI patterns, and implementation details for the Position Sizing Calculator. Use this as a template for applying consistent design patterns to other projects.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Theme Architecture](#theme-architecture)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Component Patterns](#component-patterns)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Animation & Transitions](#animation--transitions)

## Design Philosophy

### Core Principles

1. **Clarity Over Complexity** - Financial tools need clear, scannable information
2. **Accessibility First** - Screen reader support, keyboard navigation, high contrast
3. **Progressive Enhancement** - Works without JavaScript, enhanced with JS
4. **Mobile-First** - Responsive from 320px to 4K displays
5. **Performance** - No unnecessary animations, optimized rendering
6. **Consistency** - Shared patterns across all three calculators

### Design Goals

- ✅ **Professional** - Clean, modern financial UI aesthetic
- ✅ **Trustworthy** - Clear hierarchy, authoritative results presentation
- ✅ **Efficient** - Minimal clicks, auto-calculation, keyboard shortcuts
- ✅ **Adaptable** - Three theme modes (light, dark, grayscale)

## Theme Architecture

### Implementation Overview

The theme system uses CSS custom properties (CSS variables) with HTML data attributes for switching.

**File:** `src/css/variables.css`

### Theme Structure

```css
/* Light theme (default) - defined in :root */
:root {
    --primary-color: #3b82f6;
    --background-color: #f8fafc;
    --text-color: #0f172a;
    /* ... more tokens */
}

/* Dark theme - scoped to html[data-theme="dark"] */
html[data-theme="dark"] {
    --primary-color: #3b82f6;        /* Same blue */
    --background-color: #0a0e1a;     /* Dark background */
    --text-color: #f8fafc;           /* Light text */
    /* ... more tokens */
}

/* Grayscale theme - scoped to html[data-theme="grayscale"] */
html[data-theme="grayscale"] {
    --primary-color: #7a7a7a;        /* Gray instead of blue */
    --background-color: #2a2a2a;     /* Dark background */
    --text-color: #f0f0f0;           /* Light text */
    /* ... more tokens */
}
```

### Theme Switching JavaScript

**File:** `src/js/layout.js`

```javascript
// Get stored theme from localStorage
function getStoredTheme() {
    try {
        return window.localStorage ? window.localStorage.getItem('theme') : null;
    } catch {
        return null;
    }
}

// Apply theme to HTML element
function applyTheme(theme) {
    const validThemes = ['light', 'dark', 'grayscale'];
    const safeTheme = validThemes.indexOf(theme) !== -1 ? theme : 'light';
    document.documentElement.setAttribute('data-theme', safeTheme);
    return safeTheme;
}

// Initialize theme on page load
function initTheme() {
    const stored = getStoredTheme();
    const validThemes = ['light', 'dark', 'grayscale'];
    const theme = validThemes.indexOf(stored) !== -1 ? stored : 'light';
    return applyTheme(theme);
}
```

### Theme Switcher UI

**HTML Structure:**

```html
<div class="theme-switcher" role="radiogroup" aria-label="Select theme">
    <button type="button" role="radio" class="theme-switcher__btn" 
            data-theme-value="light" aria-checked="true" title="Light theme">
        ☀️
    </button>
    <button type="button" role="radio" class="theme-switcher__btn" 
            data-theme-value="dark" aria-checked="false" title="Dark theme">
        🌙
    </button>
    <button type="button" role="radio" class="theme-switcher__btn" 
            data-theme-value="grayscale" aria-checked="false" title="Grayscale theme">
        ⚙️
    </button>
</div>
```

**CSS Styling:**

```css
.theme-switcher {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: #ffffff;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    padding: 5px;
}

.theme-switcher__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 28px;
    border: 1px solid #3a3a3a;
    background: #ffffff;
    border-radius: 50px;
    font-size: 14px;
    cursor: pointer;
    transition: all var(--transition-standard);
}

.theme-switcher__btn[aria-checked="true"] {
    background: var(--primary-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

## Color System

### Color Tokens

All colors are defined as CSS custom properties in `src/css/variables.css`.

#### Primary Colors

```css
:root {
    /* Brand & Interactive */
    --primary-color: #3b82f6;        /* Blue - primary actions, links */
    --secondary-color: #2563eb;      /* Darker blue - hover states */
    --accent-color: #06b6d4;         /* Cyan - accents, highlights */
    
    /* Semantic Colors */
    --success-color: #10b981;        /* Green - success states */
    --error-color: #ef4444;          /* Red - errors, validation */
    --gray-color: #64748b;           /* Gray - secondary text */
}
```

#### Surface Colors

```css
:root {
    /* Backgrounds & Surfaces */
    --background-color: #f8fafc;     /* Page background */
    --light-bg: #ffffff;             /* Cards, containers */
    --surface-color: #ffffff;        /* Elevated surfaces */
    --surface-hover: #f1f5f9;        /* Hover state */
    --surface-active: #e2e8f0;       /* Active/pressed state */
}
```

#### Text Colors

```css
:root {
    /* Text */
    --text-color: #0f172a;           /* Primary text */
    --text-secondary: #64748b;       /* Secondary/muted text */
    --on-primary-color: #ffffff;     /* Text on primary color */
}
```

#### Border Colors

```css
:root {
    /* Borders */
    --border-color: #e2e8f0;         /* Standard borders */
    --input-border: #cbd5e1;         /* Input field borders */
}
```

### Method-Specific Accent Colors

Used for visual differentiation in instructions page:

```css
:root {
    --accent-intro: #06b6d4;         /* Cyan - intro section */
    --accent-method1: #8b5cf6;       /* Purple - Total Risk % */
    --accent-method2: #f59e0b;       /* Amber - Dollar Risk */
    --accent-method3: #10b981;       /* Green - Position % */
    --accent-results: #ec4899;       /* Pink - Results section */
}
```

**Usage Example:**

```css
.method-section--method1 {
    border-left: 4px solid var(--accent-method1);
}
```

### Color Usage Guidelines

| Use Case | Token | Example |
|----------|-------|---------|
| Primary button | `--primary-color` | Submit button background |
| Text links | `--primary-color` | Navigation links |
| Body text | `--text-color` | Paragraph text |
| Secondary text | `--text-secondary` | Labels, hints |
| Card background | `--light-bg` | Result cards, containers |
| Borders | `--border-color` | Card borders, dividers |
| Error text | `--error-color` | Validation messages |
| Success states | `--success-color` | Confirmation messages |

## Typography

### Font Stacks

```css
:root {
    /* Sans-serif for UI */
    --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 
                        'Segoe UI', system-ui, sans-serif;
    
    /* Monospace for numbers */
    --font-family-mono: 'JetBrains Mono', 'Fira Code', 
                        'Consolas', monospace;
}
```

### Font Sizes

```css
:root {
    --font-size-small: 13px;         /* Labels, captions */
    --font-size-medium: 15px;        /* Buttons, navigation */
    --font-size-normal: 16px;        /* Body text */
    --font-size-large: 1.5em;        /* Headings */
}
```

### Font Weights

```css
:root {
    --font-weight-normal: 400;       /* Regular text */
    --font-weight-medium: 500;       /* Buttons, emphasis */
    --font-weight-semibold: 600;     /* Subheadings */
    --font-weight-bold: 700;         /* Headings */
}
```

### Typography Usage

**Body Text:**
```css
body {
    font-family: var(--font-family-base);
    font-size: var(--font-size-normal);
    font-weight: var(--font-weight-normal);
    color: var(--text-color);
    line-height: 1.6;
}
```

**Headings:**
```css
h1, h2, h3 {
    font-weight: var(--font-weight-bold);
    color: var(--text-color);
    line-height: 1.2;
}

h1 { font-size: 2em; }
h2 { font-size: 1.5em; }
h3 { font-size: 1.25em; }
```

**Numeric Values (Tabular Figures):**
```css
.result-value, .copyable {
    font-family: var(--font-family-mono);
    font-variant-numeric: tabular-nums;  /* Fixed-width numbers */
}
```

## Spacing System

### Spacing Tokens

```css
:root {
    --gap-small: 8px;               /* Tight spacing */
    --gap-medium: 16px;             /* Standard spacing */
    --gap-large: 24px;              /* Loose spacing */
    --section-spacing: 24px;        /* Between sections */
}
```

### Border Radius

```css
:root {
    --border-radius-small: 6px;     /* Inputs, small buttons */
    --border-radius: 12px;          /* Cards, containers */
}
```

### Spacing Usage

**Component Spacing:**
```css
.input-container {
    margin-bottom: var(--gap-large);  /* 24px between input groups */
}

.button-group {
    gap: var(--gap-medium);           /* 16px between buttons */
}

.card {
    padding: var(--gap-large);        /* 24px internal padding */
    border-radius: var(--border-radius);  /* 12px rounded corners */
}
```

**Consistent Grid:**
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--gap-large);
}
```

## Component Patterns

### Buttons

**Primary Button (Submit):**

```html
<button type="button" class="btn btn--primary">Submit</button>
```

```css
.btn {
    font-family: var(--font-family-base);
    font-size: var(--font-size-medium);
    font-weight: var(--font-weight-medium);
    padding: 12px 24px;
    border: 2px solid var(--border-color);
    border-radius: 50px;
    cursor: pointer;
    transition: all var(--transition-standard);
    background: transparent;
    color: var(--text-color);
}

.btn--primary {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn--primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}
```

**Danger Button (Clear):**

```html
<button type="button" class="btn btn--danger">Clear</button>
```

```css
.btn--danger {
    border-color: var(--error-color);
    color: var(--error-color);
}

.btn--danger:hover {
    background: rgba(239, 68, 68, 0.1);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}
```

### Input Fields

**Text/Number Input:**

```html
<div class="input-container">
    <label for="entryPrice" class="input-label">Entry Price</label>
    <input type="number" id="entryPrice" class="input-field" 
           step="0.01" min="0" placeholder="0.00" />
</div>
```

```css
.input-label {
    display: block;
    font-weight: var(--font-weight-semibold);
    margin-bottom: 8px;
    color: var(--text-color);
}

.input-field {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid var(--input-border);
    border-radius: var(--border-radius-small);
    font-size: var(--font-size-normal);
    font-family: var(--font-family-mono);
    background: var(--light-bg);
    color: var(--text-color);
    transition: all var(--transition-standard);
}

.input-field:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: var(--surface-color);
}

.input-field.error {
    border-color: var(--error-color);
}
```

### Cards

**Result Card:**

```html
<div class="result-item">
    <span class="result-label">Max Shares</span>
    <span class="result-value copyable">100</span>
</div>
```

```css
.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: var(--light-bg);
    border-bottom: 2px solid var(--border-color);
    transition: all var(--transition-standard);
}

.result-item:hover {
    background-color: var(--surface-hover);
    transform: translateX(4px);
    border-bottom-color: var(--primary-color);
}

.result-label {
    font-size: var(--font-size-small);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--font-weight-semibold);
}

.result-value {
    font-family: var(--font-family-mono);
    font-size: 18px;
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    font-variant-numeric: tabular-nums;
}

.copyable {
    color: var(--primary-color);
    cursor: pointer;
    user-select: all;
}

.copyable:hover {
    text-decoration: underline;
}
```

### Position Indicator

**Long/Short Position Badge:**

```html
<div class="position-indicator" data-position="long">
    <span class="position-label">Position Type</span>
    <span id="position-indicator" class="position-value" data-position="long">
        LONG
    </span>
</div>
```

```css
.position-indicator {
    border-radius: 50px;
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 20px;
    margin-bottom: 20px;
    background: var(--surface-hover);
    transition: all var(--transition-standard);
}

/* Long position - Blue */
.position-indicator[data-position="long"] {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.08));
    border-color: #3b82f6;
    border-left: 4px solid #3b82f6;
}

#position-indicator[data-position="long"] {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 8px 16px;
    border-radius: 50px;
    font-weight: var(--font-weight-semibold);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Short position - Orange */
.position-indicator[data-position="short"] {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.08));
    border-color: #f97316;
    border-left: 4px solid #f97316;
}

#position-indicator[data-position="short"] {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
    padding: 8px 16px;
    border-radius: 50px;
    font-weight: var(--font-weight-semibold);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}
```

### Progressive Disclosure (Details)

**Advanced Options:**

```html
<details class="advanced-section">
    <summary class="advanced-summary">Advanced (optional)</summary>
    <div class="advanced-content">
        <!-- Advanced inputs here -->
    </div>
</details>
```

```css
.advanced-section {
    margin-bottom: var(--gap-large);
}

.advanced-summary {
    padding: 12px 16px;
    background: var(--light-bg);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-small);
    cursor: pointer;
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    transition: all var(--transition-standard);
}

.advanced-summary:hover {
    background: var(--surface-hover);
    border-color: var(--primary-color);
}

.advanced-content {
    margin-top: var(--gap-medium);
    padding: var(--gap-medium);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-small);
    background: var(--light-bg);
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
/* Base styles: 320px+ (mobile) */

/* Tablet portrait: 768px+ */
@media (min-width: 768px) {
    /* Larger inputs, better spacing */
}

/* Desktop: 900px+ */
@media (min-width: 900px) {
    /* Two-column layout */
    .calculator-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--gap-large);
    }
}

/* Large desktop: 1200px+ */
@media (min-width: 1200px) {
    /* Maximum width, centered */
    .container {
        max-width: 1200px;
    }
}
```

### Two-Column Layout

**Desktop Grid:**

```css
@media (min-width: 900px) {
    .calculator-grid {
        display: grid;
        grid-template-columns: minmax(400px, 1fr) minmax(400px, 1fr);
        gap: var(--gap-large);
        align-items: start;
    }
    
    .calculator-inputs {
        /* Left column */
    }
    
    .calculator-results {
        /* Right column - sticky */
        position: sticky;
        top: var(--gap-large);
    }
}
```

## Accessibility

### ARIA Patterns

**Live Region for Announcements:**

```html
<div id="aria-live" aria-live="polite" 
     style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">
    Updates will be announced here.
</div>
```

**Usage in JavaScript:**
```javascript
// Announce result to screen readers
const liveRegion = document.getElementById('aria-live');
if (liveRegion) {
    liveRegion.textContent = `Results calculated. Max shares: ${shares}`;
}
```

### Keyboard Navigation

**Keyboard Shortcuts:**

```javascript
document.addEventListener('keydown', (e) => {
    // Enter = Calculate
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        calculateButton.click();
    }
    
    // Escape = Clear
    if (e.key === 'Escape') {
        e.preventDefault();
        clearButton.click();
    }
});
```

### Focus States

```css
/* Visible focus indicators */
*:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Button focus */
.btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## Animation & Transitions

### Transition Timing

```css
:root {
    --transition-standard: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Fade-In Animation

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.results-section {
    animation: fadeIn 0.5s ease-out;
}
```

### Hover Effects

```css
.card:hover {
    transform: translateX(4px);  /* Subtle slide */
    box-shadow: var(--box-shadow-medium);
}

.btn:hover {
    transform: translateY(-2px);  /* Lift effect */
}
```

### Performance Considerations

- Use `transform` instead of `top`/`left` for animations
- Avoid animating `width`, `height`, or `margin`
- Prefer `opacity` and `transform` (GPU-accelerated)
- Add `will-change` for complex animations

```css
.animated-element {
    will-change: transform, opacity;
    transform: translateZ(0);  /* Force GPU acceleration */
}
```

## Shadows

### Shadow System

```css
:root {
    /* Light, subtle shadows */
    --box-shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
                        0 1px 2px -1px rgba(0, 0, 0, 0.1);
    
    /* Medium elevation */
    --box-shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                         0 2px 4px -2px rgba(0, 0, 0, 0.1);
    
    /* High elevation */
    --box-shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                        0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
```

### Usage Hierarchy

- **Light:** Input fields, subtle borders
- **Medium:** Cards, buttons (hover)
- **Large:** Modals, popovers, floating elements

## Best Practices

### 1. Always Use CSS Variables

❌ **Don't:**
```css
.button {
    background: #3b82f6;
    color: #ffffff;
}
```

✅ **Do:**
```css
.button {
    background: var(--primary-color);
    color: var(--on-primary-color);
}
```

### 2. Maintain Consistent Spacing

❌ **Don't:**
```css
.card { padding: 23px; }
.section { margin-bottom: 18px; }
```

✅ **Do:**
```css
.card { padding: var(--gap-large); }
.section { margin-bottom: var(--gap-medium); }
```

### 3. Use Semantic HTML

❌ **Don't:**
```html
<div class="button" onclick="submit()">Submit</div>
```

✅ **Do:**
```html
<button type="submit" class="btn btn--primary">Submit</button>
```

### 4. Design for Dark Mode from Start

Always test components in all three themes:
- Light (default)
- Dark
- Grayscale

### 5. Mobile-First Responsive

Write base styles for mobile, then enhance for larger screens with media queries.

## Applying This System to Other Projects

### Quick Start Checklist

1. ✅ Copy `src/css/variables.css` for theme tokens
2. ✅ Set up HTML data attribute theming: `html[data-theme="..."]`
3. ✅ Implement theme switcher with localStorage persistence
4. ✅ Use consistent spacing tokens (--gap-small/medium/large)
5. ✅ Define semantic color tokens (--primary, --error, --success)
6. ✅ Establish typography scale (--font-size-small/normal/large)
7. ✅ Create component library (buttons, inputs, cards)
8. ✅ Test accessibility (keyboard nav, screen readers, contrast)
9. ✅ Implement responsive breakpoints (mobile-first)
10. ✅ Document patterns in project-specific design system

This design system provides a solid foundation for building consistent, accessible, and maintainable web applications.
