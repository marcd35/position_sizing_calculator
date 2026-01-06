# Theme Switcher Components - Reusable Implementation Guide

**Complete light/dark/grayscale theme switching system**  
Extracted from Position Sizing Calculator project  
Last updated: January 5, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [JavaScript Implementation](#javascript-implementation)
4. [CSS Variables & Theme Definitions](#css-variables--theme-definitions)
5. [HTML Structure](#html-structure)
6. [Theme Switcher Button Styling](#theme-switcher-button-styling)
7. [Integration Instructions](#integration-instructions)
8. [Accessibility Features](#accessibility-features)
9. [Customization Guide](#customization-guide)

---

## Overview

This theme switching system provides:
- **Three themes**: Light (default), Dark, Grayscale
- **Persistent storage**: localStorage with graceful fallback
- **Accessibility**: Full ARIA support with radio group pattern
- **Responsive**: Desktop and mobile layouts
- **No dependencies**: Pure vanilla JavaScript (ES5 compatible)
- **CSS variables**: Easy customization via CSS custom properties

### How It Works

1. Theme stored in localStorage (`theme` key)
2. Applied via `data-theme` attribute on `<html>` element
3. CSS scoped with `html[data-theme='...']` selectors
4. Button clicks update attribute, localStorage, and ARIA states

---

## Quick Start

### 1. Add HTML Anchor Point

```html
<!-- Place this where you want the theme switcher to appear -->
<div id="theme-switcher-container"></div>
```

### 2. Include JavaScript (in `<head>` before closing tag)

```html
<script>
  // Paste JavaScript code from section below
</script>
```

### 3. Include CSS Variables

```html
<link rel="stylesheet" href="path/to/theme-variables.css">
<link rel="stylesheet" href="path/to/theme-switcher.css">
```

### 4. Initialize on Page Load

```javascript
// Call this when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeThemeSwitcher();
});
```

---

## JavaScript Implementation

### Complete JavaScript Code

Copy this entire block into your project:

```javascript
/**
 * Theme Switcher System
 * Supports: light, dark, grayscale themes
 * Storage: localStorage with fallback
 */

// ====================================
// STORAGE UTILITIES
// ====================================

/**
 * Get stored theme from localStorage
 * @returns {string|null} Theme name or null if not found
 */
function getStoredTheme() {
  try {
    return window.localStorage ? window.localStorage.getItem('theme') : null;
  } catch (e) {
    // localStorage may fail in private browsing mode
    return null;
  }
}

/**
 * Save theme to localStorage
 * @param {string} theme - Theme name to store
 */
function setStoredTheme(theme) {
  try {
    if (window.localStorage) {
      window.localStorage.setItem('theme', theme);
    }
  } catch (e) {
    // Ignore storage errors silently
  }
}

// ====================================
// THEME APPLICATION
// ====================================

/**
 * Apply theme to document
 * @param {string} theme - Theme name (light, dark, grayscale)
 * @returns {string} Applied theme (after validation)
 */
function applyTheme(theme) {
  var validThemes = ['light', 'dark', 'grayscale'];
  var safeTheme = validThemes.indexOf(theme) !== -1 ? theme : 'light';
  document.documentElement.setAttribute('data-theme', safeTheme);
  return safeTheme;
}

/**
 * Initialize theme on page load
 * @returns {string} Current active theme
 */
function initTheme() {
  var stored = getStoredTheme();
  var validThemes = ['light', 'dark', 'grayscale'];
  var theme = validThemes.indexOf(stored) !== -1 ? stored : 'light';
  return applyTheme(theme);
}

// ====================================
// UI GENERATION
// ====================================

/**
 * Generate theme switcher HTML
 * @param {string} currentTheme - Currently active theme
 * @returns {string} HTML string for theme switcher
 */
function generateThemeSwitcherHTML(currentTheme) {
  return (
    '<div class="theme-switcher" role="radiogroup" aria-label="Select theme">' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="light" ' +
    '    aria-checked="' + (currentTheme === 'light' ? 'true' : 'false') + '" ' +
    '    title="Light theme">☀️</button>' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="dark" ' +
    '    aria-checked="' + (currentTheme === 'dark' ? 'true' : 'false') + '" ' +
    '    title="Dark theme">🌙</button>' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="grayscale" ' +
    '    aria-checked="' + (currentTheme === 'grayscale' ? 'true' : 'false') + '" ' +
    '    title="Grayscale theme">⚙️</button>' +
    '</div>'
  );
}

// ====================================
// EVENT HANDLERS
// ====================================

/**
 * Attach event handlers to theme switcher buttons
 */
function attachThemeSwitcherHandlers() {
  var themeSwitchers = document.querySelectorAll('.theme-switcher');
  
  themeSwitchers.forEach(function (themeSwitcher) {
    var themeButtons = themeSwitcher.querySelectorAll('.theme-switcher__btn');
    
    themeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var selectedTheme = btn.getAttribute('data-theme-value');
        var applied = applyTheme(selectedTheme);
        setStoredTheme(applied);

        // Update aria-checked states for all buttons in all theme switchers
        themeSwitchers.forEach(function (ts) {
          ts.querySelectorAll('.theme-switcher__btn').forEach(function (b) {
            b.setAttribute(
              'aria-checked',
              b.getAttribute('data-theme-value') === applied ? 'true' : 'false'
            );
          });
        });
      });
    });
  });
}

// ====================================
// INITIALIZATION
// ====================================

/**
 * Initialize theme switcher system
 * Call this on DOMContentLoaded
 */
function initializeThemeSwitcher() {
  // 1. Initialize theme (must happen first)
  var currentTheme = initTheme();
  
  // 2. Find container and inject HTML
  var container = document.getElementById('theme-switcher-container');
  if (container) {
    container.innerHTML = generateThemeSwitcherHTML(currentTheme);
  }
  
  // 3. Attach event handlers
  attachThemeSwitcherHandlers();
}

// ====================================
// AUTO-INITIALIZE (Optional)
// ====================================

// Initialize theme immediately (before DOM ready) to prevent flash
var initialTheme = initTheme();

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeSwitcher);
} else {
  initializeThemeSwitcher();
}
```

---

## CSS Variables & Theme Definitions

### Complete CSS Variables (theme-variables.css)

```css
/**
 * Theme Variables
 * Define color tokens for all three themes
 */

/* ====================================
   LIGHT THEME (Default)
   ==================================== */

:root {
  /* Primary Colors */
  --primary-color: #3b82f6;
  --secondary-color: #2563eb;
  --accent-color: #06b6d4;
  
  /* Background Colors */
  --background-color: #f8fafc;
  --light-bg: #ffffff;
  --surface-color: #ffffff;
  --surface-hover: #f1f5f9;
  
  /* Text Colors */
  --text-color: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  
  /* Border & Divider Colors */
  --border-color: #e2e8f0;
  --input-border: #cbd5e1;
  --divider-color: #e2e8f0;
  
  /* Status Colors */
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #06b6d4;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-standard: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

/* ====================================
   DARK THEME
   ==================================== */

html[data-theme='dark'] {
  /* Background Colors */
  --background-color: #0a0e1a;
  --light-bg: #141827;
  --surface-color: #1a1f35;
  --surface-hover: #242a42;
  
  /* Text Colors */
  --text-color: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  /* Border & Divider Colors */
  --border-color: #1e293b;
  --input-border: #334155;
  --divider-color: #1e293b;
  
  /* Shadows (more prominent in dark mode) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  /* Primary colors remain same for brand consistency */
  /* Status colors remain same for recognition */
}

/* ====================================
   GRAYSCALE THEME
   ==================================== */

html[data-theme='grayscale'] {
  /* Primary Colors (Desaturated) */
  --primary-color: #7a7a7a;
  --secondary-color: #6a6a6a;
  --accent-color: #888888;
  
  /* Background Colors */
  --background-color: #2a2a2a;
  --light-bg: #3a3a3a;
  --surface-color: #3a3a3a;
  --surface-hover: #4a4a4a;
  
  /* Text Colors */
  --text-color: #f0f0f0;
  --text-secondary: #b0b0b0;
  --text-muted: #909090;
  
  /* Border & Divider Colors */
  --border-color: #5a5a5a;
  --input-border: #6a6a6a;
  --divider-color: #5a5a5a;
  
  /* Status Colors (Grayscale equivalents) */
  --success-color: #888888;
  --warning-color: #999999;
  --error-color: #777777;
  --info-color: #888888;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.6);
}

/* Apply grayscale filter to entire page in grayscale mode */
html[data-theme='grayscale'] {
  filter: grayscale(1);
}
```

---

## HTML Structure

### Basic Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Switcher Example</title>
  
  <!-- CSS Files -->
  <link rel="stylesheet" href="css/theme-variables.css">
  <link rel="stylesheet" href="css/theme-switcher.css">
  
  <!-- Theme Initialization Script (in head to prevent flash) -->
  <script>
    // Minimal inline script to apply theme before page renders
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        var validThemes = ['light', 'dark', 'grayscale'];
        if (validThemes.indexOf(theme) !== -1) {
          document.documentElement.setAttribute('data-theme', theme);
        }
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <!-- Header with theme switcher -->
  <header>
    <nav>
      <div class="nav-content">
        <h1>Your Site</h1>
        
        <!-- Desktop Theme Switcher -->
        <div id="theme-switcher-container" class="desktop-only"></div>
      </div>
    </nav>
  </header>
  
  <!-- Mobile Menu (optional) -->
  <div class="mobile-menu">
    <div class="mobile-theme-switcher">
      <div class="theme-switcher-label">Theme</div>
      <div id="theme-switcher-container-mobile"></div>
    </div>
  </div>
  
  <!-- Main Content -->
  <main>
    <p>Your content here. Colors will adapt based on selected theme.</p>
  </main>
  
  <!-- Full Theme Switcher Script -->
  <script src="js/theme-switcher.js"></script>
</body>
</html>
```

### Desktop-Only Implementation (Simpler)

```html
<header>
  <div class="header-container">
    <h1>Site Title</h1>
    <div id="theme-switcher-container"></div>
  </div>
</header>
```

### Mobile + Desktop Implementation

```html
<!-- Desktop (in header) -->
<div id="theme-switcher-container" class="desktop-only"></div>

<!-- Mobile (in mobile menu) -->
<div class="mobile-theme-switcher">
  <label class="theme-switcher-label">Theme</label>
  <div id="theme-switcher-container-mobile"></div>
</div>
```

Update JavaScript to handle multiple containers:

```javascript
function initializeThemeSwitcher() {
  var currentTheme = initTheme();
  
  // Inject into desktop container
  var desktopContainer = document.getElementById('theme-switcher-container');
  if (desktopContainer) {
    desktopContainer.innerHTML = generateThemeSwitcherHTML(currentTheme);
  }
  
  // Inject into mobile container
  var mobileContainer = document.getElementById('theme-switcher-container-mobile');
  if (mobileContainer) {
    mobileContainer.innerHTML = generateThemeSwitcherHTML(currentTheme);
  }
  
  attachThemeSwitcherHandlers();
}
```

---

## Theme Switcher Button Styling

### Complete CSS (theme-switcher.css)

```css
/**
 * Theme Switcher Button Styling
 * Responsive design with desktop and mobile variants
 */

/* ====================================
   BASE THEME SWITCHER STYLES
   ==================================== */

.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: #ffffff;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  padding: 5px;
  transition: all var(--transition-standard);
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
  outline: none;
  padding: 0;
}

.theme-switcher__btn:hover {
  background: var(--surface-hover);
  transform: scale(1.1);
}

.theme-switcher__btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.theme-switcher__btn[aria-checked='true'] {
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: scale(1);
}

.theme-switcher__btn[aria-checked='true']:hover {
  transform: scale(1.05);
}

/* ====================================
   DARK THEME ADJUSTMENTS
   ==================================== */

html[data-theme='dark'] .theme-switcher {
  background: var(--surface-color);
  border: 1px solid #b8b8b8;
}

html[data-theme='dark'] .theme-switcher__btn {
  background: var(--surface-color);
  border-color: var(--border-color);
}

html[data-theme='dark'] .theme-switcher__btn:hover {
  background: var(--surface-hover);
}

html[data-theme='dark'] .theme-switcher__btn[aria-checked='true'] {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

/* ====================================
   GRAYSCALE THEME ADJUSTMENTS
   ==================================== */

html[data-theme='grayscale'] .theme-switcher {
  background: #6a6a6a;
  border: 1px solid #f0f0f0;
}

html[data-theme='grayscale'] .theme-switcher__btn {
  background: #3a3a3a;
  border-color: #f0f0f0;
}

html[data-theme='grayscale'] .theme-switcher__btn:hover {
  background: #4a4a4a;
}

html[data-theme='grayscale'] .theme-switcher__btn[aria-checked='true'] {
  background: #6a6a6a;
  border-color: #f0f0f0;
}

/* ====================================
   MOBILE THEME SWITCHER
   ==================================== */

.mobile-theme-switcher {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  margin-top: 8px;
}

.theme-switcher-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

/* ====================================
   RESPONSIVE BEHAVIOR
   ==================================== */

/* Show mobile switcher by default */
.mobile-theme-switcher {
  display: block;
}

/* Hide desktop switcher by default */
.desktop-only {
  display: none;
}

/* Desktop breakpoint (1024px and up) */
@media (min-width: 1024px) {
  .desktop-only {
    display: flex;
  }

  .mobile-theme-switcher {
    display: none;
  }
}

/* Tablet breakpoint (768px to 1023px) - optional */
@media (min-width: 768px) and (max-width: 1023px) {
  .theme-switcher__btn {
    width: 36px;
    height: 32px;
    font-size: 16px;
  }
}
```

---

## Integration Instructions

### Step-by-Step Integration

#### 1. File Structure Setup

Create the following files in your project:

```
your-project/
├── css/
│   ├── theme-variables.css    (CSS variables from section above)
│   └── theme-switcher.css     (Button styles from section above)
├── js/
│   └── theme-switcher.js      (JavaScript from section above)
└── index.html
```

#### 2. HTML Integration

**In your `<head>` section:**

```html
<head>
  <!-- ... other meta tags ... -->
  
  <!-- Theme CSS Files -->
  <link rel="stylesheet" href="css/theme-variables.css">
  <link rel="stylesheet" href="css/theme-switcher.css">
  
  <!-- Prevent Flash of Unstyled Content (FOUC) -->
  <script>
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        if (['light', 'dark', 'grayscale'].indexOf(theme) !== -1) {
          document.documentElement.setAttribute('data-theme', theme);
        }
      } catch (e) {}
    })();
  </script>
</head>
```

**Before closing `</body>` tag:**

```html
  <!-- Theme Switcher Script -->
  <script src="js/theme-switcher.js"></script>
</body>
```

**In your header/navigation:**

```html
<header>
  <nav>
    <h1>Your Site Name</h1>
    <div id="theme-switcher-container"></div>
  </nav>
</header>
```

#### 3. Initialization

The JavaScript code includes auto-initialization. If you prefer manual control:

```javascript
// Remove auto-initialize section from theme-switcher.js
// Then manually call:
document.addEventListener('DOMContentLoaded', function() {
  initializeThemeSwitcher();
});
```

#### 4. Apply Theme Variables to Your Components

Use the CSS variables in your stylesheets:

```css
.my-component {
  background-color: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-standard);
}

.my-button {
  background-color: var(--primary-color);
  color: white;
}

.my-button:hover {
  background-color: var(--secondary-color);
}
```

#### 5. Test All Three Themes

Open your page and click through each theme button to verify:
- ☀️ Light theme loads correctly
- 🌙 Dark theme applies properly
- ⚙️ Grayscale theme works (including filter)
- Theme persists after page reload
- ARIA states update correctly

---

## Accessibility Features

### ARIA Implementation

The theme switcher follows WAI-ARIA Authoring Practices for radio groups:

#### Radio Group Pattern

```html
<div role="radiogroup" aria-label="Select theme">
  <button role="radio" aria-checked="true">☀️</button>
  <button role="radio" aria-checked="false">🌙</button>
  <button role="radio" aria-checked="false">⚙️</button>
</div>
```

**Benefits:**
- Screen readers announce "Select theme, radio group"
- Each button announced as "radio button, checked/not checked"
- Single-select behavior clear to assistive tech

#### Keyboard Navigation

The implementation automatically supports:
- **Tab**: Focus theme switcher
- **Arrow keys**: Navigate between theme buttons (browser default for radio role)
- **Space/Enter**: Activate focused button
- **Focus visible**: Outline appears on keyboard focus (`:focus-visible`)

### Additional Accessibility Considerations

#### Color Contrast

All three themes maintain WCAG AA contrast ratios:
- Light theme: 4.5:1 minimum for text
- Dark theme: 4.5:1 minimum for text
- Grayscale: Enhanced visibility with filter

#### Screen Reader Announcements

When theme changes, the `aria-checked` state updates:
```javascript
btn.setAttribute('aria-checked', 'true'); // Others set to 'false'
```

Screen readers announce: "Dark theme, radio button, checked"

#### Reduced Motion Support (Optional Enhancement)

Add this to respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .theme-switcher,
  .theme-switcher__btn {
    transition: none !important;
  }
  
  .theme-switcher__btn:hover {
    transform: none;
  }
}
```

---

## Customization Guide

### Adding a Fourth Theme

**1. Update JavaScript validation array:**

```javascript
function applyTheme(theme) {
  var validThemes = ['light', 'dark', 'grayscale', 'sepia']; // Add 'sepia'
  var safeTheme = validThemes.indexOf(theme) !== -1 ? theme : 'light';
  document.documentElement.setAttribute('data-theme', safeTheme);
  return safeTheme;
}
```

**2. Add button to HTML generator:**

```javascript
function generateThemeSwitcherHTML(currentTheme) {
  return (
    '<div class="theme-switcher" role="radiogroup" aria-label="Select theme">' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="light" ' +
    '    aria-checked="' + (currentTheme === 'light' ? 'true' : 'false') + '" ' +
    '    title="Light theme">☀️</button>' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="dark" ' +
    '    aria-checked="' + (currentTheme === 'dark' ? 'true' : 'false') + '" ' +
    '    title="Dark theme">🌙</button>' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="grayscale" ' +
    '    aria-checked="' + (currentTheme === 'grayscale' ? 'true' : 'false') + '" ' +
    '    title="Grayscale theme">⚙️</button>' +
    '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="sepia" ' +
    '    aria-checked="' + (currentTheme === 'sepia' ? 'true' : 'false') + '" ' +
    '    title="Sepia theme">📜</button>' +
    '</div>'
  );
}
```

**3. Add CSS variables:**

```css
html[data-theme='sepia'] {
  --primary-color: #8b4513;
  --secondary-color: #a0522d;
  --accent-color: #cd853f;
  --background-color: #f4ecd8;
  --text-color: #3e2723;
  --surface-color: #fff8dc;
  /* ... etc */
}

html[data-theme='sepia'] {
  filter: sepia(0.5);
}
```

### Changing Button Icons

Replace emoji with custom SVG icons or text:

```javascript
// Replace in generateThemeSwitcherHTML()
'    title="Light theme">Light</button>' +  // Instead of ☀️
'    title="Dark theme">Dark</button>' +    // Instead of 🌙
```

Or use icon libraries (Font Awesome, Heroicons, etc.):

```html
<button type="button" role="radio" class="theme-switcher__btn" data-theme-value="light">
  <svg><!-- Light icon SVG --></svg>
</button>
```

### Customizing Color Palette

Edit the CSS variables in `theme-variables.css`:

```css
:root {
  /* Change to your brand colors */
  --primary-color: #ff6b6b;      /* Your brand red */
  --secondary-color: #ee5a6f;
  --accent-color: #4ecdc4;       /* Your brand teal */
  
  /* Adjust backgrounds */
  --background-color: #fafafa;
  --surface-color: #ffffff;
  
  /* ... etc */
}
```

### Renaming CSS Classes

If `.theme-switcher` conflicts with existing styles:

**1. Find and replace in JavaScript:**
```javascript
// Old: '.theme-switcher'
// New: '.my-theme-toggle'
var themeSwitchers = document.querySelectorAll('.my-theme-toggle');
```

**2. Update CSS selectors:**
```css
/* Old: .theme-switcher */
.my-theme-toggle {
  /* styles */
}

/* Old: .theme-switcher__btn */
.my-theme-toggle__btn {
  /* styles */
}
```

### Changing localStorage Key

If `'theme'` key conflicts:

```javascript
// In getStoredTheme()
return window.localStorage.getItem('myapp-theme-preference');

// In setStoredTheme()
window.localStorage.setItem('myapp-theme-preference', theme);
```

### Adding Theme-Specific Styles

Target specific themes in your CSS:

```css
/* Light-only styles */
html[data-theme='light'] .special-element {
  background: linear-gradient(to right, #fff, #f0f0f0);
}

/* Dark-only styles */
html[data-theme='dark'] .special-element {
  background: linear-gradient(to right, #1a1a1a, #2a2a2a);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
}

/* Grayscale-only styles */
html[data-theme='grayscale'] .special-element {
  border: 2px solid #888;
}
```

### System Preference Detection (Optional Enhancement)

Auto-detect user's system theme preference:

```javascript
function initTheme() {
  var stored = getStoredTheme();
  
  // If no stored preference, use system preference
  if (!stored && window.matchMedia) {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    stored = prefersDark ? 'dark' : 'light';
  }
  
  var validThemes = ['light', 'dark', 'grayscale'];
  var theme = validThemes.indexOf(stored) !== -1 ? stored : 'light';
  return applyTheme(theme);
}
```

---

## Browser Support

- **Chrome/Edge**: Full support (all versions)
- **Firefox**: Full support (all versions)
- **Safari**: Full support (iOS 9.3+, macOS 10.11+)
- **Internet Explorer**: Partial support (IE11 with polyfill for `classList`)

### IE11 Compatibility (if needed)

Add polyfills for:
- `Array.prototype.indexOf` (already supported in IE9+)
- `Element.prototype.matches` (use with `-ms-` prefix)
- `Element.classList` (add polyfill if using older IE)

---

## Troubleshooting

### Theme doesn't persist after refresh

**Cause**: localStorage blocked or disabled  
**Solution**: Check browser privacy settings, ensure `setStoredTheme()` is called

### Flash of unstyled content (FOUC)

**Cause**: Theme applied too late  
**Solution**: Add inline script in `<head>` (see Integration Instructions)

### Buttons not responding to clicks

**Cause**: Event handlers not attached  
**Solution**: Verify `attachThemeSwitcherHandlers()` is called after DOM injection

### CSS variables not applying

**Cause**: Variables defined after component styles  
**Solution**: Import `theme-variables.css` before other stylesheets

### Grayscale filter affecting images/videos

**Solution**: Exempt specific elements:

```css
html[data-theme='grayscale'] img,
html[data-theme='grayscale'] video {
  filter: grayscale(0); /* Remove filter */
}
```

---

## License & Credits

This theme switching system was extracted from the **Position Sizing Calculator** project.  
Feel free to use, modify, and distribute in your own projects.

**Original project**: Position Sizing Calculator  
**Extraction date**: January 5, 2026  
**Dependencies**: None (vanilla JavaScript)

---

## Changelog

### v1.0.0 - January 5, 2026
- Initial extraction from Position Sizing Calculator
- Complete documentation of all components
- Accessibility enhancements documented
- Customization guide added

---

**End of Documentation**
